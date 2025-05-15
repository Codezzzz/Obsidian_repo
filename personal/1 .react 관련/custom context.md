
```jsx
function createSplitContextWithActions<
  S,
  A extends Record<string, (...args: any[]) => any>
>(
  initialState: S,
  createActions: (set: React.Dispatch<React.SetStateAction<S>>) => A
) {
  const StateContext = React.createContext<S | undefined>(undefined);
  const ActionsContext = React.createContext<A | undefined>(undefined);

  function useStateContext(): S {
    const ctx = React.useContext(StateContext);
    if (ctx === undefined) throw new Error("StateContext must be used within Provider");
    return ctx;
  }

  function useActionsContext(): A {
    const ctx = React.useContext(ActionsContext);
    if (ctx === undefined) throw new Error("ActionsContext must be used within Provider");
    return ctx;
  }

  function createProvider() {
    return function Provider({ children }: { children: React.ReactNode }) {
      const [state, setState] = React.useState(initialState);

      const actions = React.useMemo(() => createActions(setState), []);

      return (
        <StateContext.Provider value={state}>
          <ActionsContext.Provider value={actions}>
            {children}
          </ActionsContext.Provider>
        </StateContext.Provider>
      );
    };
  }

  

  return {
    createProvider,
    useStateContext,
    useActionsContext,
  };
}


  const {
    createProvider,
    useStateContext: useTheme,
    useActionsContext: useThemeActions,
  } = createSplitContextWithActions('light' as 'light' | 'dark', (set) => ({
    toggle: () => set(prev => (prev === 'light' ? 'dark' : 'light')),
    setLight: () => set('light'),
    setDark: () => set('dark'),
  }));
  

```