
```tsx

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


