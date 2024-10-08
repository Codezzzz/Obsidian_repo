
단건
```sh

changedPaths=$(pnpm --filter ...[$(git rev-parse origin/$(git rev-parse --abbrev-ref HEAD))] exec pwd)

if [[ $changedPaths =~ ^No.* ]]; then changedProjects=""; else

changedProjects=$( sed 's|.*/||' <<< $changedPaths )

fi

printf 'Detected changed project: %s\n' $changedProjects

```

여러건
```sh
changedPaths=$(pnpm --filter ...[$(git rev-parse origin/$(git rev-parse --abbrev-ref HEAD))] exec pwd)

  

if [[ $changedPaths =~ ^o.* ]]; then

changedProjects=""

else

# changedPaths를 배열로 처리 (줄바꿈을 기준으로)

IFS=$'\n' read -r -d '' -a pathsArray <<< "$changedPaths"

changedProjects=()

# 배열에서 각 경로 처리

for path in "${pathsArray[@]}"; do

project=$(sed 's|.*/||' <<< "$path")

changedProjects+=("$project")

done

# 결과 출력

printf 'Detected changed projects:\n'

for project in "${changedProjects[@]}"; do

printf '%s\n' "$project"

done

fi

  

# 변경된 프로젝트 리스트 출력

echo "${changedProjects[@]}"
```