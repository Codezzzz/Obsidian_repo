
```ts
type OmitPrivateAndProtected<T> = {
    [K in keyof T as K extends `_${string}` | `#${string}` ? never : K]: T[K];
};
```

```ts

function classToFunction<V extends new (...args: any[]) => any>(Clazz: V) {
    return (...args: ConstructorParameters<V>): OmitPrivateAndProtected<InstanceType<V>> => {
        const instance = new Clazz(...args);
        // 타입 체킹을 위해 Private/Protected를 제외한 타입을 반환
        return instance as OmitPrivateAndProtected<InstanceType<V>>;
    };
}
```