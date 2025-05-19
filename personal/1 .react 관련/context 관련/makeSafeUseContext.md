```jsx
import type { Context } from "react";
import { useContext } from "react";

export const makeSafeUseContext = <T>(
  context: Context<T | null>,
  name: string,
): (() => T) => {
  return (): T => {
    const currContext = useContext(context);
    if (!currContext) {
      throw new Error(`${name}.Provider was not found in tree`);
    }
    return currContext;
  };
};
```