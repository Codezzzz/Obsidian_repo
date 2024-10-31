```jsx
function WithReactNodeHook<T>({
    hooks,
    children
}: {
    children: (hooks: T) => React.ReactNode;
    hooks: () => T;
}) {
    // hooks function name is start with use
    const functionName = hooks.name;
    if (!functionName.startsWith('use')) {
        throw new Error('hooks function name is start with use');
    }
    const _hooks = (hooks as () => T)();
    return <>{children(_hooks)}</>;
}
```