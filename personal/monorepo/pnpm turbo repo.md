https://turbo.build/repo/docs/getting-started/add-to-existing-repository#add-a-turbojson-file


```
docker run --rm -p 3000:3000 \
  -e STORAGE_PROVIDER=local \
  -e STORAGE_PATH=turbo-cache \
  -e AUTH_MODE=static -e TURBO_TOKEN={TOKEN} \
  ghcr.io/ducktors/turborepo-remote-cache:2.6.1


export TURBO_API=http://localhost:3000
export TURBO_TEAM={TEAM}
export TURBO_TOKEN={TOKEN}

pnpm dlx turbo@2.1.3 run build:dev --filter=@{NAME}


```