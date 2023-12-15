## env 설정
https://velog.io/@restarea/vite-env-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0

## 절대경로
```jsx
// vite.config.ts
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
	},
		preview: {
			port: 3000,
		},
	
	plugins: [svgr(), react(), tsconfigPaths()],

});

// tsconfig.ts
"compilerOptions": {
	...
	"baseUrl": ".",
	"paths": {
	"@*": ["src/*"]

}
```

## Emotion
```jsx
export default defineConfig({
	plugins: [
		svgr(),
		tsconfigPaths(),
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: ["@emotion/babel-plugin"],
			},
		}),
	]
});
```

## Vite 상대경로 빌드
```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '', 👈
})
```