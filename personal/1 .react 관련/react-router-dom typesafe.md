

# v1

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    NavigateOptions,
    Link as RouterLink,
    NavLink as RouterNavLink,
    useNavigate as useRouterNavigate
} from 'react-router-dom';

// ✅ 제너릭으로 routeMap을 받도록 수정
export const createTypedRouterUtils = <T extends Record<string, string>>(routeMap: T) => {
    //  특정 경로에서 `:param`을 추출하는 유틸 타입
    type ExtractParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
        : Path extends `${string}:${infer Param}`
          ? { [K in Param]: string }
          : undefined;

    //  routeMap의 각 경로에서 필요한 params를 추출
    type RouteParamsMap = {
        [Key in keyof T]: ExtractParams<T[Key]> extends undefined
            ? undefined
            : ExtractParams<T[Key]>;
    };

    //  params가 필요한 라우트 목록
    type WithParamsRoutes = {
        [K in keyof RouteParamsMap]: RouteParamsMap[K] extends undefined ? never : K;
    }[keyof RouteParamsMap];

    // params가 필요 없는 라우트 목록
    type WithoutParamsRoutes = Exclude<keyof T, WithParamsRoutes>;

    // path를 빌드하는 함수 (오버로딩)
    function buildPath<R extends WithParamsRoutes>(route: R, params: RouteParamsMap[R]): string;
    function buildPath<R extends WithoutParamsRoutes>(route: R): string;
    function buildPath<R extends keyof T>(route: R, params?: unknown): string {
        let path = routeMap[route] as string;

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                path = path.replace(`:${key}`, value as string);
            });
        }

        return path;
    }

    // Link 컴포넌트
    type LinkProps<R extends keyof T> = R extends WithParamsRoutes
        ? { to: R; params: RouteParamsMap[R] } & Omit<React.ComponentProps<typeof RouterLink>, 'to'>
        : { to: R; params?: never } & Omit<
              React.ComponentProps<typeof RouterLink>,
              'to' | 'params'
          >;

    const Link = <R extends keyof T>({ to, params, ...props }: LinkProps<R>) => {
        const path = buildPath(to as any, params as any);
        return <RouterLink to={path} {...props} />;
    };

    //  NavLink 컴포넌트
    type NavLinkProps<R extends keyof T> = R extends WithParamsRoutes
        ? { to: R; params: RouteParamsMap[R] } & Omit<
              React.ComponentProps<typeof RouterNavLink>,
              'to'
          >
        : { to: R; params?: never } & Omit<
              React.ComponentProps<typeof RouterNavLink>,
              'to' | 'params'
          >;

    const NavLink = <R extends keyof T>({ to, params, ...props }: NavLinkProps<R>) => {
        const path = buildPath(to as any, params as any);
        return <RouterNavLink to={path} {...props} />;
    };

    //  useNavigate Hook
    const useNavigate = () => {
        const navigate = useRouterNavigate();

        return <R extends keyof T>(
            to: R,
            ...args: R extends WithParamsRoutes
                ? [params: RouteParamsMap[R], options?: NavigateOptions]
                : [options?: NavigateOptions]
        ) => {
            //  params가 필요한 경우와 필요 없는 경우를 분리
            const params =
                args.length > 0 && typeof args[0] === 'object' && !Array.isArray(args[0])
                    ? (args[0] as RouteParamsMap[R])
                    : undefined;

            const options = (args.length > 0 && (params ? args[1] : args[0])) as
                | NavigateOptions
                | undefined;

            const path = buildPath(to as any, params as any);
            navigate(path, options);
        };
    };

    return { buildPath, Link, NavLink, useNavigate };
};

};
```


https://github.com/fredericoo/react-router-typesafe


# v2


```tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';

type Narrowable = string | number | bigint | boolean;
type NarrowKeys<A> =
    | (A extends Narrowable ? A : never)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    | { [K in keyof A]: A[K] extends Function ? A[K] : NarrowKeys<A[K]> };

type NarrowArray<A> = NarrowKeys<A>[];

type Flatten<T> = { [K in keyof T]: T[K] } & {};

type PathParams<T> = keyof T extends never ? { params?: never } : { params: T };

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}`
    ? Record<Param, string> & NextPart
    : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
    ? ExtractParam<Segment, ExtractParams<Rest>>
    : ExtractParam<Path, {}>;

type PrefixIfRelative<Path extends string, Prefix extends string> = Path extends `/${string}`
    ? Path
    : Prefix extends ''
      ? `/${Path}`
      : Prefix extends '/'
        ? `${Prefix}${Path}`
        : `${Prefix}/${Path}`;

type ExtractPaths<Route extends RouteObject, Prefix extends string> = Route extends {
    children: infer C extends RouteObject[];
    path: infer P extends string;
}
    ? PrefixIfRelative<P, Prefix> | ExtractPaths<C[number], PrefixIfRelative<P, Prefix>>
    : Route extends { children: infer C extends RouteObject[] }
      ? ExtractPaths<C[number], Prefix>
      : Route extends { path: infer P extends string }
        ? PrefixIfRelative<P, Prefix>
        : never;

type TypesafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypesafeSearchParams };

const joinValidWith =
    (separator: string) =>
    (...valid: any[]) =>
        valid.filter(Boolean).join(separator);

export const typesafeBrowserRouter = <const R extends RouteObject>(routes: NarrowArray<R>) => {
    type Paths = ExtractPaths<R, ''>;

    function href<P extends Paths>(
        params: { path: Extract<P, string> } & PathParams<Flatten<ExtractParams<P>>> &
            RouteExtraParams
    ) {
        // applies all params to the path
        const path = params?.params
            ? Object.keys(params.params).reduce((path, param) => {
                  const value = params.params![param as keyof ExtractParams<P>];
                  if (typeof value !== 'string')
                      throw new Error(`Route param ${param} must be a string`);
                  return path.replace(`:${param}`, value);
              }, params.path)
            : params.path;

        const searchParams = new URLSearchParams(params?.searchParams);
        const hash = params?.hash?.replace(/^#/, '');

        return joinValidWith('#')(joinValidWith('?')(path, searchParams.toString()), hash);
    }

    return {
        router: createBrowserRouter(routes as RouteObject[]),
        href 
    };
};

```



# v3 

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createBrowserRouter,
    NavigateOptions,
    RouteObject,
    Link as RouterLink,
    NavLink as RouterNavLink,
    useNavigate as useRouterNavigate
} from 'react-router-dom';

type Narrowable = string | number | bigint | boolean;
type NarrowKeys<A> =
    | (A extends Narrowable ? A : never)
    // eslint-disable-next-line @typescript-eslint/ban-types
    | { [K in keyof A]: A[K] extends Function ? A[K] : NarrowKeys<A[K]> };

type NarrowArray<A> = NarrowKeys<A>[];

type Flatten<T> = { [K in keyof T]: T[K] } & object;

type PathParams<T> = keyof T extends never ? { params?: never } : { params: T };

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}`
    ? Record<Param, string> & NextPart
    : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
    ? ExtractParam<Segment, ExtractParams<Rest>>
    : ExtractParam<Path, object>;

type PrefixIfRelative<Path extends string, Prefix extends string> = Path extends `/${string}`
    ? Path
    : Prefix extends ''
      ? `/${Path}`
      : Prefix extends '/'
        ? `${Prefix}${Path}`
        : `${Prefix}/${Path}`;

type ExtractPaths<Route extends RouteObject, Prefix extends string> = Route extends {
    children: infer C extends RouteObject[];
    path: infer P extends string;
}
    ? PrefixIfRelative<P, Prefix> | ExtractPaths<C[number], PrefixIfRelative<P, Prefix>>
    : Route extends { children: infer C extends RouteObject[] }
      ? ExtractPaths<C[number], Prefix>
      : Route extends { path: infer P extends string }
        ? PrefixIfRelative<P, Prefix>
        : never;

type TypeSafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypeSafeSearchParams };

const joinValidWith =
    (separator: string) =>
    (...valid: any[]) =>
        valid.filter(Boolean).join(separator);

export const typeSafeBrowserRouter = <R extends RouteObject>(routes: NarrowArray<R>) => {
    type Paths = ExtractPaths<R, ''>;

    type Props<P extends Paths> = { to: Extract<P, string> } & PathParams<
        Flatten<ExtractParams<P>>
    > &
        RouteExtraParams;

    function buildPath<P extends Paths>(params: Props<P>) {
        // applies all params to the path
        const path = params?.params
            ? Object.keys(params.params).reduce((path, param) => {
                  const value = params.params![param as keyof ExtractParams<P>];
                  if (typeof value !== 'string')
                      throw new Error(`Route param ${param} must be a string`);
                  return path.replace(`:${param}`, value);
              }, params.to)
            : params.to;

        const searchParams = new URLSearchParams(params?.searchParams);
        const hash = params?.hash?.replace(/^#/, '');

        return joinValidWith('#')(joinValidWith('?')(path, searchParams.toString()), hash);
    }

    function Link<P extends Paths>(
        route: Props<P> & Omit<React.ComponentProps<typeof RouterLink>, 'to'>
    ) {
        const { to, params, ...rest } = route;

        const path = buildPath({ ...route, params, to });

        return <RouterLink to={path} {...rest} />;
    }

    function NavLink<P extends Paths>(
        route: Props<P> & Omit<React.ComponentProps<typeof RouterNavLink>, 'to'>
    ) {
        const { to, params, ...rest } = route;

        const path = buildPath({ ...route, params, to });

        return <RouterNavLink to={path} {...rest} />;
    }

    function useNavigate() {
        const navigate = useRouterNavigate();

        return (route: Props<Paths>, options?: NavigateOptions) => {
            const path = buildPath({ ...route });
            navigate(path, options);
        };
    }

    type DomRouteOpt = Parameters<typeof createBrowserRouter>[1];

    return {
        router: (opt?: DomRouteOpt) => createBrowserRouter(routes as RouteObject[], { ...opt }),
        buildPath,
        Link,
        NavLink,
        useNavigate
    };
};

```