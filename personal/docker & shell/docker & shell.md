```
nohup python -u app.py &
nohup 종료방법  
1. “ps -ef | grep 쉘스크립트파일명” 명령으로 데몬형식으로 실행  
2. "kill -9 PID번호“ 명령으로 해당 프로세스 종료
```

```
tail -f nohup.out
```

```
lsof -i :${PORT}
```

```
curl -is 211.39.140.174:3000
```

```
docker-compose up -d build #무정지
docker-compose up --force-recreate
sudo docker-compose ps
sudo docker-compose stop
docker-compose logs -f -t #로그확인

docker-compose up -d --force-recreate --build
```


```sh
PID=`ps -eaf | grep app.py | grep -v grep | awk '{print $2}'`

if [[ "" != "$PID" ]]; then

echo "killing $PID"

kill -9 $PID

nohup python3 -u app.py &

fi
