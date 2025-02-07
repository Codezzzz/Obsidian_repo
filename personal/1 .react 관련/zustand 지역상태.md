https://github.com/pmndrs/zustand/issues/128
https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md


https://github.com/fredericoo/zustand-context

## using contextapi

```jsx
import type { UseBoundStore, StoreApi } from 'zustand'
import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Higher-order function to create a context provider and a custom hook for a given Zustand store.
 * 
 * @param createStore - A factory function that creates a new Zustand store.
 * @returns A tuple containing the context provider and the custom hook.
 */
export function createStoreContext<TState>(createStore: () => UseBoundStore<StoreApi<TState>>) {

  /**
   * React context created to provide the Zustand store to components. 
   * This context will hold the Zustand store created by `createStore`.
   */
  const StoreContext = createContext<UseBoundStore<StoreApi<TState>>>(createStore());

  /**
   * React component that provides the Zustand store to its children components. 
   * It uses the `createStore` function to create a store instance and provides it via `StoreContext`.
   */
  const StoreProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ useStore ] = useState(createStore);
    return (
      <StoreContext.Provider value={useStore}>
        {children}
      </StoreContext.Provider>
    ) 
  };

  /**
   * Custom hook that provides access to the Zustand store within components. 
   * It uses `useContext` to access the store from `RowStoreContext` and returns the hook returned by the Zustand store.
   */
  const useStore = () => {
    const useStore = useContext(StoreContext);
    return useStore();
  };

  return [ StoreProvider, useStore ] as const;
}
```


```jsx
// In typescript, optionally set the state type
type CounterStoreState = {
  counter: number,
  setCounter: (newNumber: number) => void
}

// Create the store you want to use
const createCounterStore = () => create<CounterStoreState>(
  (set, get) => ({
    counter: 0,
    setCounter: (newNumber) => {
      set({ counter: newNumber })
    }
  })
)

// First is the React Context provider to wrap your components in, second is the hook to directly access the store
const [ CounterStoreProvider, useCounterStore ] = createStoreContext(createCounterStore)
```

