---
layout: post
title: Install Oracle Java from source
category: Java
tags: [Java, Linux, Oracle]
comments: true
---
## Background
I am using `jhipster` to generate spring boot project. It compile but it does not work well. The first thing is that some function is not compatible. Also, hibernate insert data twice that cause `ConstraintViolationException`. I had post a [Issue](https://github.com/jhipster/generator-jhipster/issues/9914).

It works well on Java 8, so I have to install one more version. However, I cannot install via PPA. It is because webupd8 has [DISCONTINUED](https://launchpad.net/~webupd8team/+archive/ubuntu/java) since we need to login to download. So, I have to download java manually. I can use `update-alternatives` to switch version.

## Install
1. Download 1.8 jdk from [Oracle](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). Register an account and then download. It is better to download `jdk-8u211-linux-x64.tar.gz`.
2. `scp` upload the file to server.
3. unzip the file at server with `tar xzvf filename`.
4. Move the folder into `/usr/lib/jvm/` (The location my java 11 was installed).
5. Then use `update-alternatives` with commands.
   ```bash
   update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-8-oracle-amd64/bin/java 100
   update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-8-oracle-amd64/bin/javac 100
   update-alternatives --install /usr/bin/jar jar /usr/lib/jvm/java-8-oracle-amd64/bin/jar 100
   ```
6. Update command to specify version.
   ```bash
   update-alternatives --config java
   update-alternatives --config javac
   update-alternatives --config jar
   ```
7. Check `java` version if it works.
8. write `$JAVA_HOME` to specify location.
   I write it to `/usr/lib/jvm/default-java` and link to directory with `ln`.

Then when you switch version, you just change the link to specify version. Inspired by [Rahul](https://tecadmin.net/switch-between-java-versions-on-debian/).