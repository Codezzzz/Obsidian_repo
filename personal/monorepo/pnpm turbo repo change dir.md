
```sh
npx turbo run build --dry=json --filter="...[origin/develop]" | jq -r '.tasks[].package'
```