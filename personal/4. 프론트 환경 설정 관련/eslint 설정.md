https://velog.io/@rmaomina/prettier-eslint-settings

https://velog.io/@xmun74/Next.js-TS%EC%97%90%EC%84%9C-ESLint-Prettier-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0



```json
"eslint": "^8.52.0",

"eslint-plugin-import": "^2.29.0",

"husky": "^8.0.3",

"lint-staged": "^15.0.2",

"prettier": "^3.0.3",

"typescript": "^4.9.4"


"@typescript-eslint/eslint-plugin": "^6.9.1",

"@typescript-eslint/parser": "^6.9.1",

"eslint-config-prettier": "^9.0.0",

"eslint-plugin-prettier": "^5.0.1",

"eslint-plugin-react": "^7.33.2"
```


.eslintignore
.eslintrc.js
.prettierrc
```json
"scripts": {

	"postinstall": "husky install",
	
	"prepare": "husky install",
	
	"lint": "eslint --ext .js,.jsx,.ts,.tsx .",
	
	"prettier": "prettier --write --config ./.prettierrc \"packages/**/**/*.{ts,tsx}\"",
	
	"lint:fix": "eslint --fix 'packages/**/*.{ts,tsx}'",
	
	"lint-staged": "lint-staged"

},

"lint-staged": {

	"**/*.{js,ts,tsx}": [
	
		"yarn lint:fix",
		
		"yarn prettier"
	
	]

},

"husky": {

	"hooks": {
	
		"pre-commit": "lint-staged"
	
	}

},
```

```sh
/.husky/pre-commot

#!/usr/bin/env sh

. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged
```