```sh

changedPaths=$(pnpm --filter ...[$(git rev-parse origin/$(git rev-parse --abbrev-ref HEAD))] exec pwd)

if [[ $changedPaths =~ ^No.* ]]; then changedProjects=""; else

changedProjects=$( sed 's|.*/||' <<< $changedPaths )

fi

printf 'Detected changed project: %s\n' $changedProjects

```