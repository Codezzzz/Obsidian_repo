https://velog.io/@johnsuhr4542/K8s-%EC%97%90%EC%84%9C-%EC%99%B8%EB%B6%80-%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%84%9C-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0

> aws, ncp 로드밸런서 사용하는대신 

##  1. 설치
```bash
curl -L -o ingress-nginx-controller.yml \
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/baremetal/deploy.yaml

kubectl apply -f ingress-nginx-controller.yml
```

> 베어매탈용 컨트롤러는 NodePort로 동작해서 LoadBalancer타입으로 변경

```bash
kubectl patch svc ingress-nginx-controller -n \
ingress-nginx -p '{"spec": {"type": "LoadBalancer"}}'
```


##  `MetalLB` 설치 

[참고](https://metallb.universe.tf/installation/)

쿠버네티스 설정 수정
```bash
$ kubectl edit configmap -n kube-system kube-proxy
===
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "ipvs"
ipvs:
  strictARP: true
```

```bash
$ curl -L -o namespace.yml https://raw.githubusercontent.com/metallb/metallb/v0.12.1/manifests/namespace.yaml

$ curl -L -o metallb.yml https://raw.githubusercontent.com/metallb/metallb/v0.12.1/manifests/metallb.yaml

$ vi metallb.yml
```

```bash
$ kubectl apply -f namespace.yml
$ kubectl apply -f metallb.yml
```

- speaker 간 통신시 암호화를 위해 `secret` 이 필요합니다.

```bash
$ kubectl create secret generic -n metallb-system \
memberlist --from-literal=secretKey="$(openssl rand -base64 128)"
```

- `configmap.yml` 이 필요합니다.

```yml
# configmap.yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - [HOST_IP]
```

- `HOST_IP` 에는 현재 노드(마스터)의 ipv4 주소를 입력합니다. `ifconfig` 명령어 혹은 AWS 콘솔 등에서 확인하면 됩니다.

```bash
$ ifconfig
===
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001
 inet 192.168.51.14  ...
```

- ipv4가 `192.168.51.14` 이니, `HOST_IP` 에는 `192.168.51.14-192.168.51.14` 로 지정해 주겠습니다.

```bash
$ kubectl apply -f configmap.yml
```


- 조금 기다린 후, 인그레스 컨트롤러의 `EXTERNAL-IP` 가 할당되는 것을 볼 수 있습니다.  
    백엔드단의 애플리케이션을 외부 80 포트로 노출해 보겠습니다.

```yml
# ingress-nginx.yml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-router
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
    - host: [YOUR_DOMAIN]
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: application
                port:
                  number: 8080
```

```bash
$ kubectl apply -f ingress-nginx.yml
```

외부에서 접근시 애플리케이션의 반환값을 표시하는 것을 알 수 있습니다.