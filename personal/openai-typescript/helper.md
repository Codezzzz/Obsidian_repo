```tsx
import { getQueryClient } from './react-query';
import { QueryKey } from '@tanstack/react-query';
import createFetchClient, { Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';
import { HttpMethod, PathsWithMethod, ResponseObjectMap, SuccessResponse } from 'openapi-typescript-helpers';

interface QueryMatcher {
    key: QueryKey;
    exact: (queryKey: QueryKey) => boolean;
    pathMatch: (queryKey: QueryKey) => boolean;
    patternMatch: (queryKey: QueryKey) => boolean;
    predicate: () => (query: any) => boolean;
    invalidate: (exact?: boolean) => void;
    invalidateRelated: () => void;
}

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// OpenAPI 스펙의 parameters를 추출하는 타입 (개선됨)
type ExtractParameters<T> = T extends { parameters: infer P } ? (P extends { path?: any; query?: any; header?: any } ? P : never) : never;

// OpenAPI 스펙의 requestBody를 추출하는 타입 (개선됨)
type ExtractRequestBody<T> = T extends { requestBody?: { content: { 'application/json': infer B } } }
    ? B
    : T extends { requestBody?: infer B }
      ? B
      : never;

// 파라미터가 존재하는지 확인하는 타입
type HasParameters<T> = ExtractParameters<T> extends never ? false : true;
type HasRequestBody<T> = ExtractRequestBody<T> extends never ? false : true;

// 적절한 params 타입을 결정하는 타입 (개선됨)
type ResolveParamsType<T> = (HasParameters<T> extends true ? { params: DeepPartial<ExtractParameters<T>> } : {}) &
    (HasRequestBody<T> extends true ? { body: DeepPartial<ExtractRequestBody<T>> } : {});

const OAIQueryKeyHelper = <Paths extends Record<string, any>>() => {
    function queryKeyHelper<
        TMethod extends HttpMethod,
        TPath extends PathsWithMethod<Paths, TMethod> = PathsWithMethod<Paths, TMethod>,
        TMethodType = Paths[TPath][TMethod],
    >(method: TMethod, path: TPath, params?: ResolveParamsType<TMethodType>) {
        const queryClient = getQueryClient();

        const queryKey = params ? ([method, path, params] as const) : ([method, path] as const);

        const matcher: QueryMatcher = {
            key: queryKey,
            exact: (otherKey: QueryKey) => JSON.stringify(queryKey) === JSON.stringify(otherKey),
            pathMatch: (otherKey: QueryKey) => otherKey[0] === queryKey[0] && otherKey[1] === queryKey[1],
            patternMatch: (otherKey: QueryKey) => {
                if (typeof otherKey[1] !== 'string' || typeof queryKey[1] !== 'string') {
                    return false;
                }
                const pattern = (queryKey[1] as string).split('/')[1];
                return (otherKey[1] as string).includes(pattern);
            },
            predicate: () => (query: any) => {
                if (!Array.isArray(query.queryKey)) return false;
                return query.queryKey[0] === queryKey[0] && query.queryKey[1] === queryKey[1];
            },
            invalidate: (exact = true) => {
                if (exact) {
                    queryClient.invalidateQueries({ queryKey, exact: true });
                } else {
                    queryClient.invalidateQueries({ predicate: matcher.predicate() });
                }
            },
            invalidateRelated: () => {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        if (!Array.isArray(query.queryKey)) return false;
                        if (typeof query.queryKey[1] !== 'string' || typeof queryKey[1] !== 'string') {
                            return false;
                        }
                        const pattern = (queryKey[1] as string).split('/')[1];
                        return (query.queryKey[1] as string).includes(pattern);
                    },
                });
            },
        };

        return {
            queryKey,
            matcher,
            ...matcher,
        };
    }

    return queryKeyHelper;
};

const OAILoggerMiddleware = (serviceName: string): Middleware => {
    return {
        onRequest: async (request) => {},
        onResponse: (response) => {},
        onError: (error) => {
            console.log(`${serviceName} error`, error);
        },
    };
};

const OAIAuthMiddleware = (serviceName: string): Middleware => {
    return {
        onRequest: async ({ request }) => {},
        onResponse: (response) => {},
        onError: (error) => {
            console.log(`${serviceName} error`, error);
        },
    };
};

const OAIAuthenticatorMiddleware = (serviceName: string): Middleware[] => {
    return [OAILoggerMiddleware(serviceName), OAIAuthMiddleware(serviceName)];
};

type OAIUtils = { baseUrl: string; middleware?: Middleware[]; isProxy?: boolean };

const createOAIUtils = <T extends Record<string, any>>({ baseUrl, middleware = [], isProxy = false }: OAIUtils) => {
    const url = isProxy ? `/api/proxy?endpoint=${baseUrl}` : baseUrl;

    const client = createFetchClient<T>({
        baseUrl: url,
    });

    middleware.forEach((middleware) => {
        client.use(middleware);
    });

    const OAIQuery = createClient(client);

    const queryKeyHelper = OAIQueryKeyHelper<T>();

    return {
        client,
        query: OAIQuery,
        queryKeyHelper,
    };
};

export { createOAIUtils, OAIAuthenticatorMiddleware, OAIAuthMiddleware, OAILoggerMiddleware, OAIQueryKeyHelper };

// ApiResponse 타입 (기존 유지)
export type ApiResponse<
    Paths extends Record<string, any>,
    TMethod extends HttpMethod,
    TPath extends PathsWithMethod<Paths, TMethod>,
> = TPath extends keyof Paths
    ? TMethod extends keyof Paths[TPath]
        ? SuccessResponse<ResponseObjectMap<Paths[TPath][TMethod]>, `${string}/${string}`> extends {
              result?: infer R;
          }
            ? R
            : SuccessResponse<ResponseObjectMap<Paths[TPath][TMethod]>, `${string}/${string}`>
        : never
    : never;

// ApiRequest 타입 (개선됨)
export type ApiRequest<
    Paths extends Record<string, any>,
    TMethod extends HttpMethod,
    TPath extends PathsWithMethod<Paths, TMethod>,
    TMethodType = Paths[TPath][TMethod],
> = (HasParameters<TMethodType> extends true ? { params: ExtractParameters<TMethodType> } : {}) &
    (HasRequestBody<TMethodType> extends true ? { body: ExtractRequestBody<TMethodType> } : {});
