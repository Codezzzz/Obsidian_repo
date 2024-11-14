클라우드에 배포 할때 헬스 체크가 통과해야 서비스가 정상 실행된다.
권한이랑 별개인 controller 생성해서 path에 넣어준다.
## 1. example service.yaml


```yaml
apiVersion: v1
kind: Service
metadata:
  name: ${NAME}
  namespace: default
  annotations:
    alb.ingress.kubernetes.io/healthcheck-path: ${HEALTH_CHECK_PATH}
spec:
  type: NodePort
  selector:
    app: ${NAME}
  ports:
    - protocol: TCP
      port: ${PORT} # 클러스터 내부에서 노출되는 포트
      targetPort: ${PORT} # Pod의 포트
      nodePort: ${PORT} # 클러스터 노드에서 접근할 포트
```