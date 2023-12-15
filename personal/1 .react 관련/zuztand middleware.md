```ts
export function zuztandMiddleware<T>(
	fn: StateCreator<T, [["zustand/immer", never]], [], T>
) {
	return devtools(immer(fn), {
		serialize: {
			options: {
				map: true,
			},
		},
	});
}
```