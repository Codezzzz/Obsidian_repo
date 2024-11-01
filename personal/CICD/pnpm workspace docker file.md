
```yaml
#### base stage ####
FROM node:20.12.0-alpine as alpine
# 필요한 구성요소 설치를 위해 `libc6-compat` 추가
RUN apk update
RUN apk add --no-cache libc6-compat


FROM alpine as base

RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store


# DOckerfile을 사용할때 주입할 변수
ARG APP_NAME
ARG APP_DIR
ARG BUILD_COMMAND

# 외부에서 주입된 값이나 새롭게 정의한 값을 위한 ENV값 정의
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


FROM base AS builder
# Set working directory
WORKDIR /app

# Host의 파일을 WORKDIR로 복사
COPY .turbo ./
COPY .turbo/config.json ./.turbo/
COPY . .

# turborepo의 강력한 기능인 prune 실행
RUN turbo prune ${APP_NAME} --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prefer-frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
# 프로젝트 소스들을 WORKDIR로 복사
COPY --from=builder /app/out/full/ .

RUN turbo run ${BUILD_COMMAND} --filter=${APP_NAME} --api="${URL}" --token="{TOKEN}" --team="{TEAM}"
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

FROM base AS runner

WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer --chown=nextjs:nodejs /app/${APP_DIR}/dist ./dist

 
FROM nginx
COPY --from=runner /app/dist /usr/share/nginx/html
COPY --from=builder /app/infra/nginx/default.conf /etc/nginx/conf.d/default.conf
```