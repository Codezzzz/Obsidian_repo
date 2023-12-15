https://velog.io/@metamong/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-ESLint%EC%99%80-Prettier-Husky-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0




플러그인
```
"eslint-config-prettier": "^9.0.0",

"eslint-plugin-autofix": "^1.1.0",

"eslint-plugin-import": "^2.29.0",

"eslint-plugin-jsx-a11y": "^6.8.0",

"eslint-plugin-prettier": "^5.0.1",

"eslint-plugin-react": "^7.33.2",

"eslint-plugin-react-hooks": "^4.6.0",

"eslint-plugin-simple-import-sort": "^10.0.0",

"eslint-plugin-unused-imports": "^3.0.0",

"http-proxy-middleware": "^2.0.6",

"husky": "^8.0.3",

"lint-staged": "^15.1.0",

"prettier": "^3.1.0",

"vite-plugin-eslint": "^1.8.1"
```

.eslintrc
```
{

  "extends": [

    "eslint:recommended",

    "plugin:react/recommended",

    "plugin:import/recommended",

    // "plugin:jsx-a11y/recommended",

    "eslint-config-prettier"

  ], // eslint에서 기본적으로 추천하는 것을 사용하되, rules에 있는 것들을 추가적으로 적용

  "rules": {

    "no-var": "error", // var 금지

    "no-multiple-empty-lines": "error", // 여러 줄 공백 금지

    "no-console": ["warn", { "allow": ["warn", "error", "info"] }], // console.log() 금지

    "eqeqeq": "error", // 일치 연산자 사용 필수

    "dot-notation": "error", // 가능하다면 dot notation 사용

    "react/jsx-no-useless-fragment": "warn",

    "react/react-in-jsx-scope": "off",

    "react/prop-types": "off",

    "react/no-unknown-property": ["error", { "ignore": ["include"] }],

    "autofix/no-debugger": "error",

    "jsx-a11y/click-events-have-key-events": "off",

    "jsx-ally/anchor-is-valid": "off",

    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",

    "unused-imports/no-unused-imports": "error",

    "unused-imports/no-unused-vars": [

      "warn",

      {

        "vars": "all",

        "varsIgnorePattern": "^_",

        "args": "after-used",

        "argsIgnorePattern": "^_"

      }

    ],

    "simple-import-sort/imports": [

      "error",

      {

        "groups": [["^\\u0000"], ["^@?\\w"], ["^~/", "^\\."]]

      }

    ],

    "simple-import-sort/exports": "error",

    "import/first": "error",

    "import/newline-after-import": "error",

    "import/no-duplicates": "error"

  },

  "parserOptions": {

    "ecmaVersion": "latest",

    "sourceType": "module",

    "ecmaFeatures": {

      "jsx": true

    }

  },

  "env": {

    "browser": true,

    "es2021": true

  },

  "plugins": [

    "react",

    "react-hooks",

    "prettier",

    "autofix",

    "unused-imports",

    "simple-import-sort",

    "import"

  ],

  "settings": {

    "react": {

      "version": "detect"

    },

    "import/resolver": {

      "node": {

        "paths": ["src"],

        "extensions": [".js", ".jsx"]

      }

    }

  }

}
```

lint-staged 

```
npx husky add .husky/pre-commit "yarn lint-staged"
npx husky add .husky/pre-commit "yarn format"
```

```
"scripts": {

"start": "vite",

"build": "vite build",

"postinstall": "husky install",

"format": "prettier --cache --write ./src/**/*.{js,jsx}",

"lint": "eslint --cache ./src/**/*.{js,jsx}",

"lint:fix": "eslint --cache --fix ./src/**/*.{js,jsx}"

},

"lint-staged": {

"src/**/*.{js,jsx,ts,tsx}": [

"yarn format",

"yarn lint:fix"

]

},
```