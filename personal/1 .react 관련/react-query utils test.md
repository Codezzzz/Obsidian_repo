

```tsx
// 타입 추출 헬퍼들
type TData<T> = T extends QueryOptions<infer D, any, any, any> ? D : never;
type TError<T> = T extends QueryOptions<any, infer E, any, any> ? E : never;

type AnyOptions = QueryOptions<any, any, any, QueryKey>;

// 개선된 QueryFactory 클래스
export class QueryFactory<
    TDefaultKey extends string,
    R extends Record<string, AnyOptions> = {},
    D extends Record<string, (...args: any[]) => AnyOptions> = {}
> {
    private readonly defaultKey: TDefaultKey;
    private registry = {} as R;
    private dynRegistry = {} as D;
    private queryClient: QueryClient;

    constructor(defaultKey: TDefaultKey, queryClient: QueryClient) {
        this.defaultKey = defaultKey;
        this.queryClient = queryClient;
    }

    // ======================== 정적 옵션 관리 ========================

    /** 정적 옵션 추가: queryKey는 ['defaultKey', key, ...] 강제 */
    add<K extends string, O extends AnyOptions & { queryKey: readonly [TDefaultKey, K, ...any[]] }>(
        key: K,
        option: O
    ) {
        (this.registry as Record<string, AnyOptions>)[key] = option;
        return this as unknown as QueryFactory<TDefaultKey, R & Record<K, O>, D>;
    }

    /** 정적 옵션 가져오기 */
    get<K extends keyof R>(key: K): R[K] | undefined {
        return this.registry[key];
    }

    /** 정적 옵션 제거 */
    removeQueryOption<K extends keyof R & string>(key: K): boolean {
        const existed = key in this.registry;
        if (existed) delete (this.registry as Record<string, AnyOptions>)[key];
        return existed;
    }

    // ======================== 동적 옵션 관리 ========================

    /** 동적 옵션 추가: args -> 옵션(옵션의 queryKey도 튜플로 강제) */
    addDynamic<
        K extends string,
        A extends readonly unknown[],
        O extends QueryOptions<any, any, any, readonly [TDefaultKey, K, ...A]>
    >(key: K, build: (...args: A) => O) {
        (this.dynRegistry as Record<string, (...a: A) => AnyOptions>)[key] = build as any;
        return this as unknown as QueryFactory<TDefaultKey, R, D & Record<K, (...args: A) => O>>;
    }

    /** 동적 옵션 빌드 */
    getDynamic<K extends keyof D>(key: K, ...args: Parameters<D[K]>): ReturnType<D[K]> {
        const builder = this.dynRegistry[key];
        return builder!(...args) as ReturnType<D[K]>;
    }

    // ======================== 유틸리티 메서드 ========================

    /** 등록된 키들 */
    getRegisteredKeys(): (keyof R & string)[] {
        return Object.keys(this.registry) as (keyof R & string)[];
    }

    getRegisteredDynamicKeys(): (keyof D & string)[] {
        return Object.keys(this.dynRegistry) as (keyof D & string)[];
    }

    /** defaultKey */
    getDefaultKey(): TDefaultKey {
        return this.defaultKey;
    }

    /** key 생성 헬퍼 */
    makeKey<K extends keyof R & string>(key: K): readonly [TDefaultKey, K];
    makeKey<K extends keyof D & string>(
        key: K,
        ...args: Parameters<D[K]>
    ): readonly [TDefaultKey, K, ...Parameters<D[K]>];
    makeKey(key: string, ...args: unknown[]) {
        return [this.defaultKey, key, ...args] as const;
    }

    // ======================== 쿼리 무효화 & 리패치 ========================

    /** 전부 무효화: ['defaultKey']로 시작하는 모든 쿼리 */
    invalidateAll(): Promise<void> {
        return this.queryClient.invalidateQueries({
            queryKey: [this.defaultKey]
        });
    }

    /** 정적 키 무효화 */
    invalidateByKey<K extends keyof R & string>(key: K): Promise<void>;
    /** 동적 키+args 무효화 (args 옵셔널 - prefix 매칭 가능) */
    invalidateByKey<K extends keyof D & string>(
        key: K,
        ...args: Partial<Parameters<D[K]>>
    ): Promise<void>;
    invalidateByKey(key: string, ...args: unknown[]): Promise<void> {
        const queryKey =
            args.length > 0
                ? [this.defaultKey, key, ...args] // 정확한 키 매칭
                : [this.defaultKey, key]; // prefix 매칭 (해당 key로 시작하는 모든 쿼리)

        return this.queryClient.invalidateQueries({ queryKey });
    }

    /** 리패치 메서드들 */
    refetchByKey<K extends keyof R & string>(key: K): Promise<void>;
    refetchByKey<K extends keyof D & string>(key: K, ...args: Parameters<D[K]>): Promise<void>;
    refetchByKey(key: string, ...args: unknown[]): Promise<void> {
        const queryKey = [this.defaultKey, key, ...args];
        return this.queryClient.refetchQueries({ queryKey });
    }

    refetchAll(): Promise<void> {
        return this.queryClient.refetchQueries({
            queryKey: [this.defaultKey]
        });
    }

    // ======================== React Hook 통합 ========================

    /** 통합 useQuery - 정적 키 */
    useQuery<K extends keyof R & string>(
        key: K,
        additional?: Partial<R[K]>
    ): UseQueryResult<TData<R[K]>, TError<R[K]>>;

    /** 통합 useQuery - 동적 키 */
    useQuery<K extends keyof D & string>(
        key: K,
        args: Parameters<D[K]>[number],
        additional?: Partial<ReturnType<D[K]>>
    ): UseQueryResult<TData<ReturnType<D[K]>>, TError<ReturnType<D[K]>>>;

    useQuery(key: string, argsOrAdditional?: any, additional?: any): UseQueryResult<any, any> {
        // 정적 키인지 확인
        if (key in this.registry) {
            const base = this.get(key as keyof R)!;
            return useReactQuery({
                ...(base as object),
                ...(argsOrAdditional as object)
            } as any);
        }

        // 동적 키인지 확인
        if (key in this.dynRegistry) {
            // args가 배열인지 확인하고 안전하게 스프레드
            const args = [argsOrAdditional];
            const dynamicOption = this.getDynamic(
                key as keyof D,
                ...(args as Parameters<D[keyof D]>)
            );
            return useReactQuery({
                ...(dynamicOption as object),
                ...(additional as object)
            } as any);
        }

        throw new Error(`Query key '${key}' not found in registry`);
    }

    /** 통합 useSuspenseQuery - 정적 키 */
    useSuspenseQuery<K extends keyof R & string>(
        key: K,
        additional?: Partial<R[K]>
    ): UseSuspenseQueryResult<TData<R[K]>, TError<R[K]>>;

    /** 통합 useSuspenseQuery - 동적 키 */
    useSuspenseQuery<K extends keyof D & string>(
        key: K,
        args: Parameters<D[K]>[number],
        additional?: Partial<ReturnType<D[K]>>
    ): UseSuspenseQueryResult<TData<ReturnType<D[K]>>, TError<ReturnType<D[K]>>>;

    useSuspenseQuery(
        key: string,
        argsOrAdditional?: any,
        additional?: any
    ): UseSuspenseQueryResult<any, any> {
        // 정적 키인지 확인
        if (key in this.registry) {
            const base = this.get(key as keyof R)!;
            return useReactSuspenseQuery({
                ...(base as object),
                ...(argsOrAdditional as object)
            } as any);
        }

        // 동적 키인지 확인
        if (key in this.dynRegistry) {
            const args = [argsOrAdditional];
            const dynamicOption = this.getDynamic(
                key as keyof D,
                ...(args as Parameters<D[keyof D]>)
            );
            return useReactSuspenseQuery({
                ...(dynamicOption as object),
                ...(additional as object)
            } as any);
        }

        throw new Error(`Query key '${key}' not found in registry`);
    }
}

```