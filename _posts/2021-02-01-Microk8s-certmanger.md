---
layout: post
title: Microk8s Install Cert-manager
category: Kubernetes
tags: [Kubernetes, K8S, Microk8s]
comments: true
---
# Install
First you will need to install microk8s and enable `helm3` and `ingress` using `microk8s enable helm3 ingress`.

Then install cert-manager with helm with following cmd by (Envekus)[https://www.reddit.com/r/kubernetes/comments/g3z5sp/microk8s_with_certmanager_and_letsecncrypt/].
```bash
microk8s kubectl create namespace cert-manager
microk8s helm3 repo add jetstack https://charts.jetstack.io
microk8s helm3 repo update
microk8s helm3 install cert-manager jetstack/cert-manager \
  --namespace cert-manager --version v0.15.2 \
  --set installCRDs=true \
  --set ingressShim.defaultIssuerName=letsencrypt-production \
  --set ingressShim.defaultIssuerKind=ClusterIssuer \
  --set ingressShim.defaultIssuerGroup=cert-manager.io
```

Then setup cluster issuer with the following cmd.
```yaml
microk8s kubectl apply -f - <<YAML
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    email: CHANGE-ME@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-production-issuer-account-key
    solvers:
    - selector: {}
      http01:
        ingress:
          class: public
YAML
```
Then you will be able to gerenate the certificate. The ingress class in microk8s is `public` for me. Otherwise, it is not generating endpoint for ACME validation.
```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: example
  namespace: default
  annotations:
    kubernetes.io/ingress.class: "public"
    cert-manager.io/cluster-issuer: "letsencrypt-production"
spec:
  tls:
    - hosts:
        - example.com
      secretName: example-tls-acme
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            backend:
              serviceName: example
              servicePort: 8080

```
