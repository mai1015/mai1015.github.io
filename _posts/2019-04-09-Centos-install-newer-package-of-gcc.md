---
layout: post
title: Centos install newer package of gcc via yum
category: Notes
tags: [Centos, Linux, yum, gcc]
comments: true
---
Centos is popular for it is stability and security. It meets all kinds of purpose for commercial requirements. However, to maintain security and stability, most of its package are outdated. It is harder to run newer version compiled program with lower version of gcc.

We can solve this easily by compiler new version of gcc. It is not that hard, but requires some time to do the job. We can fix it in a easy way. Thanks to *Software Colletions*, it is provide in RHSCL(Red Hat Software Collections) in `devtoolset-7`. We just simply need to enable it and download it from the repository. It can be done in following steps. You can find more information [here]](https://www.softwarecollections.org/en/scls/rhscl/devtoolset-7/)

1. Install the `centos-release-scl` in centos repository
```bash
sudo yum install centos-release-scl
```

2. Enable RHSCL repository
```bash
sudo yum-config-manager --enable rhel-server-rhscl-7-rpms
```

3. Install the cllections
```bash
sudo yum install devtoolset-7
```

4. Enable the package
```bash
scl enable devtoolset-7 bash
```

You can find more other package from the [website](https://www.softwarecollections.org/en/scls/user/rhscl/). I can also download `node` from [here](https://www.softwarecollections.org/en/scls/rhscl/rh-nodejs10/). So we do not need to spend time compile the software.