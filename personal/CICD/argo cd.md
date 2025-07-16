
https://argo-cd.readthedocs.io/en/stable/getting_started/

설치 삭제
```sh
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## 비번 확인
```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=``"{.data.password}" | base64 -d; echo
```


## install argocd cli
```sh
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64
```

## add argo cd ssh
```
argocd repo add {GIT_URL} --ssh-private-key-path ~/.ssh/id_rsa
```


## add cluster
```
argocd login localhost:8080
argocd cluster add {CLUSTER_NAME} --name {NAME}
```