
https://argo-cd.readthedocs.io/en/stable/getting_started/

## 1. 설치 삭제
```sh
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## 2. 비번 확인
```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=``"{.data.password}" | base64 -d; echo
```


## add argo cd
```
argocd repo add {GIT_URL} --ssh-private-key-path ~/.ssh/id_rsa
```


