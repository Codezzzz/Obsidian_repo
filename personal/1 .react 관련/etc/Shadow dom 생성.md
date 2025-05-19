
```jsx
import { useEffect, useRef, useState } from "react";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createCache from "@emotion/cache";
import { createPortal } from "react-dom";

export type ShadowDomProps = {
  children: React.ReactNode;
  nodeId: string;
};

function ShadowDom({ children, nodeId }: ShadowDomProps) {
  const [rootNode, setRootNode] = useState<ShadowRoot | null>(null);
  const [cacheNode, setCacheNode] = useState<EmotionCache | null>(null);
  useEffect(() => {
    const wisenutPlugin = document.getElementById(nodeId);

    if (wisenutPlugin && !wisenutPlugin.shadowRoot) {
      const root = wisenutPlugin.attachShadow({ mode: "open" });
      if (root) {
        setRootNode(root);
        setCacheNode(
          createCache({
            container: root,
            key: "wisenut",
          })
        );
      }
    }
  }, []);

  return (
    <>
      {rootNode &&
        cacheNode &&
        createPortal(
          <CacheProvider value={cacheNode}>{children}</CacheProvider>,
          rootNode
        )}
    </>
  );
}

export default ShadowDom;
```