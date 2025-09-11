```yml
.docker_template: &docker_template
    stage: dockerize
    image: docker:latest
    services:
        - docker:dind
    before_script:
        - docker login -u $NCP_REGISTRY_USERNAME -p $NCP_REGISTRY_PASSWORD $REGISTRY_URL
    script:
        - |
            echo "Building Docker image for $APP_NAME using infra Dockerfile..."

            IMAGE_TAG="latest"

            docker build \
              --build-arg APP_NAME=@$APP_NAME \
              --build-arg APP_DIR=apps/$APP_NAME \
              --build-arg BUILD_COMMAND=$BUILD_COMMAND \
              -f infra/dockerfiles/Dockerfile \
              -t $REGISTRY_URL/$IMAGE_NAME:$IMAGE_TAG \
              -t $REGISTRY_URL/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA \
              .

            docker push $REGISTRY_URL/$IMAGE_NAME:$IMAGE_TAG
            docker push $REGISTRY_URL/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA

            echo "$REGISTRY_URL/$IMAGE_NAME:$IMAGE_TAG" > $IMAGE_NAME-docker-image.txt
    artifacts:
        paths:
            - $IMAGE_NAME-docker-image.txt
        expire_in: 1 hour

```