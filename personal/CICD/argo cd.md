
https://argo-cd.readthedocs.io/en/stable/getting_started/

## 설치
```sh
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## 비번
```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=``"{.data.password}" | base64 -d; echo
```


argocd repo add https://github.com/Codezzzz/wise-ui.git --username codezzzz --password 486dy4dy


argocd repo add git@gitlab.wisenut.kr:saas/gensunny/gensunny-k8s.git --ssh-private-key-path ~/.ssh/argo_rsa

git@github.com:Codezzzz/wise-ui.git

argocd repo add --insecure-skip-server-verification git@gitlab.wisenut.kr:saas/gensunny/gensunny-k8s.git


ssh-keyscan gitlab.wisenut.kr | argocd cert add-ssh --batch


argocd repo add git@github.com:argoproj/argocd-example-apps.git --ssh-private-key-path ~/.ssh/id_rsa