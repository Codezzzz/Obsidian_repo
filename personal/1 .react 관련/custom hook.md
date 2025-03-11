```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

// 1️⃣ 개별 플러그인 타입
interface PluginHook<S, A> {
    state: S;
    actions: A;
}

type Plugin<K extends string, S, A> = {
    [key in K]: PluginHook<S, A>;
};

type PluginMap<Hooks extends Plugin<string, any, any>> = {
    [K in keyof Hooks]: {
        state: Hooks[K] extends PluginHook<infer S, any> ? S : never;
        actions: Hooks[K] extends PluginHook<any, infer A> ? A : never;
    };
};

type CombinedState<Hooks extends Plugin<string, any, any>> = {
    [K in keyof PluginMap<Hooks> as keyof PluginMap<Hooks>[K]['state']]: PluginMap<Hooks>[K]['state'];
};

export function useExtendedPlugins<Hooks extends Plugin<string, any, any>, P>({
    hooks,
    parser
}: {
    hooks: Hooks;
    parser?: (state: CombinedState<Hooks>) => P;
}) {
    const _hooks = useMemo(() => {
        return hooks;
    }, [hooks]);

    const combinedState = useMemo(() => {
        const state = Object.entries(_hooks).reduce((acc, [, value]) => {
            const { state } = value as PluginMap<Hooks>;
            return { ...acc, ...state };
        }, {}) as CombinedState<Hooks>;

        return {
            ...state,
            ...(parser ? parser(state) : {})
        } as CombinedState<Hooks> & P;
    }, [_hooks, parser]);

    return {
        hooks: _hooks,
        state: combinedState
    };
}

```