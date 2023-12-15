
```sh

docker stop $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rm -f $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rmi {IMAGE_NAME}
```