

```yml

workflow:
    auto_cancel:
        on_new_commit: interruptible # 새로운 커밋이 들어오면 이전 작업을 취소
        on_job_failure: none # 작업 실패 시 이전 작업을 취소하지 않음

stages:
    - dockerize
    - k8s-update
    - notify

default:
    tags:
        - gensunny-front-runner

variables:
    NODE_VERSION: '20.12.0'
    GIT_STRATEGY: clone
    GIT_DEPTH: 0
    REGISTRY_URL: '{REGISTRY_URL}'
    DOCKER_PULL_POLICY: 'if-not-present'
    ENABLE_NOTIFY: 'true'
    K8S_REPO_URL: '{REPO}'
    WEBHOOK_URL: '{URL}'

include:
    - local: 'ci-template/dockerize.yml'
    - local: 'ci-template/k8s-update.yml'
    - local: 'ci-template/notify.yml'

# =====================================
# DEV (develop 브랜치)

.branch_dev_condition: &branch_dev_condition $CI_COMMIT_BRANCH == "develop" || $CI_COMMIT_BRANCH == "feature/ci-dev" || $CI_COMMIT_BRANCH == "ci-dev"

dockerize_dev:
    extends: .docker_template
    parallel:
        matrix:
            - APP_NAME: 'gensunny-am'
              CHANGED_DIR: 'apps/gensunny-am'
              IMAGE_NAME: 'gensunny-am-dev'

            - APP_NAME: 'gensunny-as'
              CHANGED_DIR: 'apps/gensunny-as'
              IMAGE_NAME: 'gensunny-as-dev'

            - APP_NAME: 'gensunny-sm'
              CHANGED_DIR: 'apps/gensunny-sm'
              IMAGE_NAME: 'gensunny-sm-dev'

            - APP_NAME: 'gensunny-lp'
              CHANGED_DIR: 'apps/gensunny-lp'
              IMAGE_NAME: 'gensunny-lp-dev'
    variables:
        BUILD_COMMAND: 'build:dev'
    rules:
        # 브랜치 변경 시 실행
        - if: *branch_dev_condition
          changes:
              - $CHANGED_DIR/**
              - packages/**
              - package.json
              - pnpm-lock.yaml
              - pnpm-workspace.yaml

        # 수동 실행 (파일 변경 없어도)
        - if: *branch_dev_condition
          when: manual
          allow_failure: true

k8s_update_dev:
    extends: .k8s_update_template
    resource_group: k8s-update-dev
    parallel:
        matrix:
            - APP_NAME: 'gensunny-am'
              CHANGED_DIR: 'gensunny-front/dev/gensunny-am'
              IMAGE_NAME: 'gensunny-am-dev'
            - APP_NAME: 'gensunny-as'
              CHANGED_DIR: 'gensunny-front/dev/gensunny-as'
              IMAGE_NAME: 'gensunny-as-dev'
            - APP_NAME: 'gensunny-sm'
              CHANGED_DIR: 'gensunny-front/dev/gensunny-sm'
              IMAGE_NAME: 'gensunny-sm-dev'
            - APP_NAME: 'gensunny-lp'
              CHANGED_DIR: 'gensunny-front/dev/gensunny-lp'
              IMAGE_NAME: 'gensunny-lp-dev'
    needs:
        - job: dockerize_dev
          optional: true
    rules:
        - if: *branch_dev_condition
    allow_failure: true

# ==============================================
# PROD (main 브랜치)

.branch_prod_condition: &branch_prod_condition $CI_COMMIT_BRANCH == "main" ||
    $CI_COMMIT_BRANCH == "feature/ci-prod" ||
    $CI_COMMIT_BRANCH == "ci-prod" ||
    $CI_COMMIT_BRANCH =~ /^release\/.*$/

dockerize_prod:
    extends: .docker_template
    parallel:
        matrix:
            - APP_NAME: 'gensunny-am'
              CHANGED_DIR: 'apps/gensunny-am'
              IMAGE_NAME: 'gensunny-am'

            - APP_NAME: 'gensunny-as'
              CHANGED_DIR: 'apps/gensunny-as'
              IMAGE_NAME: 'gensunny-as'

            - APP_NAME: 'gensunny-sm'
              CHANGED_DIR: 'apps/gensunny-sm'
              IMAGE_NAME: 'gensunny-sm'

            - APP_NAME: 'gensunny-lp'
              CHANGED_DIR: 'apps/gensunny-lp'
              IMAGE_NAME: 'gensunny-lp'
    variables:
        BUILD_COMMAND: 'build:prod'
    rules:
        # 브랜치 변경 시 실행
        - if: *branch_prod_condition
          changes:
              - $CHANGED_DIR/**
              - packages/**
              - package.json
              - pnpm-lock.yaml
              - pnpm-workspace.yaml

        # 수동 실행 (파일 변경 없어도)
        - if: *branch_prod_condition
          when: manual
          allow_failure: true

k8s_update_prod:
    extends: .k8s_update_template
    resource_group: k8s-update-prod
    parallel:
        matrix:
            - APP_NAME: 'gensunny-am'
              CHANGED_DIR: 'gensunny-front/prod/gensunny-am'
              IMAGE_NAME: 'gensunny-am'
            - APP_NAME: 'gensunny-as'
              CHANGED_DIR: 'gensunny-front/prod/gensunny-as'
              IMAGE_NAME: 'gensunny-as'
            - APP_NAME: 'gensunny-sm'
              CHANGED_DIR: 'gensunny-front/prod/gensunny-sm'
              IMAGE_NAME: 'gensunny-sm'
            - APP_NAME: 'gensunny-lp'
              CHANGED_DIR: 'gensunny-front/prod/gensunny-lp'
              IMAGE_NAME: 'gensunny-lp'
    needs:
        - job: dockerize_prod
          optional: true
    rules:
        - if: *branch_prod_condition
    allow_failure: true


```
```