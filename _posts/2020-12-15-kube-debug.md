---
layout: post
title: Kubernetes Debugging Network
category: Kubernetes
tags: [Kubernetes, K8S]
comments: true
---
When you try to debug the network inside kubernetes but not much tool avaliable since all the image remove unused command. The easy way to to use busybox by deploying a pod using the following commandline `kubectl run -i --tty --rm debug --image=busybox --restart=Never -- sh`. Then you can access to `telnet`, `nc`, etc.
