
```sh

docker stop $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rm -f $(docker ps -aq --filter ancestor={IMAGE_NAME})
docker rmi {IMAGE_NAME}
```


docker stop $(docker ps -a -q) 
docker rm $(docker ps -a -q)
docker rmi -f $(docker images -a -q)