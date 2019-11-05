---
layout: post
title: Deploy kubernetes and helm (国内部署 kubernetes)
category: Linux
tags: [Linux, MacOS, route]
comments: true
---
国内部署 k8s 是真的难，坑太多了。这两个花了两天终于成功部署一个能用都了

# 尝试
首先，我从alpine系统下尝试部署，可是源里面都 test kubernetes 不能用。运行 `kubeadm init` 每次都是部署失败，即使kubelet启动成功了。但是卡在docker这里，因为其他组件都不会成功运行。日志也没有任何相关资料，github上都问题解决方案都没有用。所以，必须得换一个系统。 并且国内墙了google，源都不能访问。

# 过程
我选用了`Debian 10`作为我都主系统。
## Docker
安装完成后，可以直接通过 `curl https://get.docker.com/ | bash -` 来安装docker。
不知道为什么 `Debian 10` 安装不上 `cri-o`。`docker` 用起来也没问题，所以就不在这里纠结了。
然后检查一下运行状况，没问题，修改一下配置。
```json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "insecure-registries" : [
    "10.0.1.121:5000",
    "127.0.0.1:5000"
  ],
  "registry-mirrors": ["https://************.myhuaweicloud.com"],
  "storage-driver": "overlay2",
  "data-root": "/mnt/docker"
}
```
这里我配置了华为的镜像，需要先在[这里](https://mirrors.huaweicloud.com/)注册，就能获取一个链接。`kubeadm` 推荐`systemd` 作为 `cgroup` 的驱动，所以改动一下。

## Kubernetes
之后就可以开始安装 `k8s`了。
参考了一下这些文章：
1. [debian9.8搭建kubernetes多主节点集群(一)](https://blog.csdn.net/tete2csdn/article/details/89405672)
2. [kubernetes遇到问题](https://blog.51cto.com/xudate/2150607)
3. [k8s 1.12.1 的坑和解决方法](https://segmentfault.com/a/1190000017010166)
4. [Kubernetes使用中发现的问题和错误](https://my.oschina.net/eima/blog/1860598)
5. [Creating a single control-plane cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#instructions)
6. [Kubernetes on bare-metal in 10 minutes](https://blog.alexellis.io/kubernetes-in-10-minutes/)

按照第一篇文章「木子甘」，先进行了系统的设置
```bash
echo -e "net.bridge.bridge-nf-call-ip6tables =1\nnet.bridge.bridge-nf-call-iptables =1\nnet.ipv4.ip_forward = 1" >> /etc/sysctl.conf;sysctl -p;swapoff -a;sed -ri "/swap/s@(.*)@#/&@g" /etc/fstab;echo "SELINUX=disabled" > /etc/selinux/config
```
然后加入阿里云的源来按照`k8s`的主要程序。
```bash
apt-get install -y apt-transport-https curl && \
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg |apt-key add -  && \
echo "deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main"  >>/etc/apt/sources.list.d/kubernetes.list  && \
apt update
```

之后就可以固定住他们的版本了，这样能保证稳定性。
```bash
apt-mark hold kubelet kubeadm kubectl docker-ce
```
在配置开始之前，先获取下`docker`的镜像：
```bash
IMAGE="kube-apiserver:v1.15.2 kube-controller-manager:v1.15.2 kube-scheduler:v1.15.2 kube-proxy:v1.15.2 pause:3.1 etcd:3.3.10 coredns:1.3.1"
for imageName in ${IMAGE} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
    
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
done
```
这里从其他源下载了镜像，然后改成`k8s`的名字。注意版本要按照刚刚安装的版本一样，之后就可以开始配置`k8s`了。

然后就可以通过`kubeadm`进行初始化了。这里设置了内网的ip，还有api服务器的ip。
```bash
kubeadm init --pod-network-cidr=10.0.1.0/16 --apiserver-advertise-address=10.0.1.***
```
之后，如果没有报错`k8s`就算成功运行了。

### 配置账号
如果运行成功，他会提示你配置一下你的账号。要不然不能管理服务。按照提示输入就好了。
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 配置网络
在这`k8s`成功运行但是他还没准备好。因为网络策略还没配置。详细的配置程序在[官方文档](https://kubernetes.io/docs/concepts/cluster-administration/addons/)有很详细的说明。我挑选了[calico](https://docs.projectcalico.org/v3.8/getting-started/kubernetes/)。
```bash
kubectl apply -f https://docs.projectcalico.org/v3.8/manifests/calico.yaml
```
至此，`k8s`就算准备好了。但是它默认禁止了主节点不会运行其他的程序，所以我们要先把那个去掉
```bash
kubectl get no -o yaml | grep taint -A 5
kubectl taint nodes --all node-role.kubernetes.io/master-
```

这样就大功告成了

## Helm
参考了这位大大写的[kunernets使用helm安装tiller踩坑](https://www.jianshu.com/p/d0cdbb49569b)。真的解决了我的问题。
`Helm`安装很简单，直接从github上的release会有各个版本的编译文件。直接下载下来放在`/usr/local/bin`就好。
之后就可以进行配置了。首先，如果打开了`k8s`的`rbac`，那么我们得先建立一个账号。
```ymal
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```
写入到`rbac-config.yaml`就可以用命令导入账号了。
```bash
$ kubectl create -f rbac-config.yaml
serviceaccount "tiller" created
clusterrolebinding "tiller" created
$ helm init --service-account tiller --history-max 200
```

但是这里也是得先获得一个`tiller`的镜像。我在`docker hub`上面找到了`doublemine/kubernetes-helm.tiller`的镜像。
然后可以参照这个[文档](https://whmzsu.github.io/helm-doc-zh-cn/quickstart/tiller_ssl-zh_cn.html)来签名。然后带上一个`helm`的源就可以开始配置了。我们还是选择阿里云的源。
```bash
helm init --debug --tiller-tls --tiller-tls-cert ./tiller.cert.pem --tiller-tls-key ./tiller.key.pem --tiller-tls-verify --tls-ca-cert ca.cert.pem --tiller-image doublemine/kubernetes-helm.tiller:v2.14.3 --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts --service-account tiller
```

这里安装就完成了。

其他可能有用的
1. [构建单节点的master的k8s应用 集成helm管理(参考了一些其他大神的资料)](https://my.oschina.net/kikro/blog/3039635)
2. [Kubernetes 集群使用 Helm 搭建 GitLab 并配置 Ingress](https://blog.csdn.net/aixiaoyang168/article/details/81057101)