```tsx
type ExtractParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : Path extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : undefined;

export type RouteParams = {
    [Key in keyof typeof routeMap]: ExtractParams<(typeof routeMap)[Key]> extends undefined
        ? object
        : ExtractParams<(typeof routeMap)[Key]>;
};

export type RoutePaths = keyof typeof routeMap;

export const buildPath = <T extends keyof typeof routeMap>(
    route: T,
    params: T extends keyof RouteParams ? RouteParams[T] : undefined
): string => {
    let path = routeMap[route] as string;

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            path = path.replace(`:${key}`, value);
        });
    }

    return path;
};
```