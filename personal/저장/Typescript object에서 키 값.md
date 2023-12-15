```typescript
const { img, ...rest } = data;

const formData = new FormData();

for (const key in rest) {
	const _key = key as keyof typeof rest;
	formData.append(key, rest[_key].toString());
}
```
