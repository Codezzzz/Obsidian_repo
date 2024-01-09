
https://registry-1.docker.io/v2/library/python/manifests/3.11
https://registry-1.docker.io/v2/library/nginx/manifests/latest
https://registry-1.docker.io/v2/library/node/manifests/18

```sh
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce-cli_20.10.11~3-0~ubuntu-focal_amd64.deb
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/containerd.io_1.4.11-1_amd64.deb
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce_20.10.11~3-0~ubuntu-focal_amd64.deb
```

docker 설치
```sh
sudo dpkg --force-all -i ./*.deb
```

docker 권한
```
sudo usermod -aG docker [username]
sudo service docker restart
```

docker compose 설치
```sh
wget [https://github.com/docker/compose/releases/download/1.24.0/docker-compose-Linux-x86_64](https://github.com/docker/compose/releases/download/1.24.0/docker-compose-Linux-x86_64)
mv docker-compose-Linux-x86_64 docker-compose
sudo mv docker-compose /usr/local/bin/
sudo chmod +x /usr/local/bin/docker-compose
```

docker build (mac m1일경우)
```
docker build --platform linux/amd64 -t ${imageName} .
```

docker rebuild
```
docker build --no-cache --platform linux/amd64 -t ${imageName} .
```

docker 이미지 압축
```
docker save ${이미지이름} > ${이미지이름}.tar
```

docker 이미지 파일 로드
```
docker load < ${파일이름}.tar
```

docker 구동
```
docker run -p 3000:3000 ${imageName} #shell 꺼지때 까지만
docker run -d -p 3000:3000 ${imageName} #항상 실행
docker-compose up -d
docker-compose up -d --force-recreate --build
```

docker 이미지 삭제
```
docker rm -f $(docker ps -aq --filter ancestor=${imageName}) # 특정 이름의 컨테이너 삭제

docker rmi ${imageName} #이미지 삭제
```

docker container 접속
```
docker exec -it ${containerName} /bin/bash
```

docker-compose not Dockerfile
```
version: "3"

services:
	korean-re: # 이름은 어떤걸로 지정해도 상관없음
		image: korean-re
		container_name: korean-re-container
		volumes:
			- /app/node_modules #도커
			- ./:/app # 로컬에 있는 모든 파일을 맵핑
		ports:
			- 3100:3100
		
		stdin_open: true
```

docker-compose use Dockerfile
```sh
version: "3"

services:
	
	korean-re: # 이름은 어떤걸로 지정해도 상관없음
		build:
			dockerfile: Dockerfile # dockerfile이름
		context: ./ # 도커파일 위치 명시
		volumes:
			- /app/node_modules #도커
			- ./:/app # 로컬에 있는 모든 파일을 맵핑
		ports:
			- 3100:3100
		stdin_open: true
```7