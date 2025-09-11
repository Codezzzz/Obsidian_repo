```yml
.k8s_update_template: &k8s_update_template
    stage: k8s-update
    image: alpine:3.18
    before_script:
        - apk add --no-cache git curl bash ca-certificates openssh
        - curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
        - chmod +x kubectl
        - mv kubectl /usr/local/bin/
        - rm -rf gensunny-k8s

    script:
        - |
            echo "K8S_REPO_URL: $K8S_REPO_URL"
            mkdir -p ~/.ssh
            chmod 700 ~/.ssh


            echo "SSH_PRIVATE_KEY length: $(printf "%s" "$SSH_PRIVATE_KEY" | wc -c)"
            printf "%s" "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
            chmod 600 ~/.ssh/id_rsa

            ssh-keyscan -H gitlab.wisenut.kr >> ~/.ssh/known_hosts

            git config --global user.email "ci@gensunny.com"
            git config --global user.name "GitLab CI"
            git clone $K8S_REPO_URL gensunny-k8s

            cd gensunny-k8s


            curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
            mv kustomize /usr/local/bin/


            echo "Updating k8s manifests for $APP_NAME..."

            # Git 루트 디렉토리 저장
            GIT_ROOT=$(pwd)
            echo "Git root directory: $GIT_ROOT"

            # 해당 환경 브랜치로 체크아웃
            git checkout main || git checkout -b main

            NEW_IMAGE_TAG="$CI_COMMIT_SHORT_SHA"

            # kustomization.yaml이 있는 디렉토리로 이동
            DIR=$CHANGED_DIR
            echo "Moving to directory: $DIR"
            cd $DIR

            # Kustomize를 사용한 이미지 태그 업데이트
            echo "Using Kustomize for image tag update..."
            kustomize edit set image $REGISTRY_URL/$IMAGE_NAME:$NEW_IMAGE_TAG

            kustomize build . > output/deploy.yaml

            # Git 루트로 돌아가기
            echo "Returning to git root: $GIT_ROOT"
            cd $GIT_ROOT

            # 변경사항 확인
            echo "Checking git status..."
            git status


            # 변경사항 커밋 및 푸시
            git add $DIR
            if git diff --staged --quiet; then
                echo "No changes to commit"
            else
                git commit -m "Update $APP_NAME image tag to $NEW_IMAGE_TAG [skip ci]"

                git pull --rebase origin main
                git push origin main
                echo "Successfully updated k8s manifests for $APP_NAME"
            fi

```