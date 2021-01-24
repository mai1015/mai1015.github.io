---
layout: post
title: Istio Upstream Connection Overflow
category: Kubernetes
tags: [Kubernetes, K8S, Openshift, Istio]
comments: true
---
## Backgroun
I found some failed request 503 error for the microservice deployment in Openshift 4.5 with Service Mesh v1. The error shown is `upstream connect error or disconnect/reset before headers. reset reason: overflow`.

## Problem
I found the solution during the search and refer to the documentation. It is because Service Mesh v1 is using (Istio 1.3)[https://istio.io/v1.3/docs/reference/config/networking/v1alpha3/destination-rule/#ConnectionPoolSettings-HTTPSettings]. And the Connection poll is set to 1024 for http1MaxPendingRequests, http2MaxRequests, etc. It is different from version 1.8 where it is default to 2^32-1. Therefore, it is required to set it differently.

## Solution
This is not really a good solution I believe. and it require sometime to investigate, but you can increase those settings with destination rules.
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: sample-destinationrule
spec:
  host: sample
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
    connectionPool:
      http:
        http1MaxPendingRequests: 10240
        http2MaxRequests: 10240
  subsets:
  - name: v1
    labels:
      version: "v1"
```
