---
layout: post
title: Ansible Automation for Server Deploy and Test
category: Development
tags: [Linux, Development, Docker]
comments: true
---
When talking about deploying a server, it is a pain to configure servers by hand. You have to type in commands line by line. Then edit the config file to make sure that works. If you need to configure all the time, it wastes a lot of time struggle and waits for server.

Then I look for a way to automate this process. I found a lot of program like chef, puppet, ansible, saltstack, terraform, cloudformation, etc. They are different but they serve one purpose, deploy servers for you.

First, I tried chef. It is cool, clear syntax, fast. I can always check if the setup was correct by config rules. However, after some day of experience, I give up. It has so many stuff to use, I have to keep search and try it out. If I am managing a lot of servers, I will definitely use it.

Then I found ansible. It is pretty easy to learn, the configuration file is using YMAL. One of the samples from documents.

```yaml
---
- hosts: webservers
  vars:
    http_port: 80
    max_clients: 200
  remote_user: root
  tasks:
  - name: ensure apache is at the latest version
    yum:
      name: httpd
      state: latest
  - name: write the apache config file
    template:
      src: /srv/httpd.j2
      dest: /etc/httpd.conf
    notify:
    - restart apache
  - name: ensure apache is running
    service:
      name: httpd
      state: started
  handlers:
    - name: restart apache
      service:
        name: httpd
        state: restarted
```

It is easy to both read and writes. It enables you to config server via ssh using ansible in your computer.

I learn a few, so I will take some example and show how ansible works and automate the process.

After the [installation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#intro-installation-guide) guide, you will configure the host that you want to config in groups. We create the file `/etc/ansible/hosts` to declare individual servers or server group.

```
192.0.2.50

[group]
aserver.example.org
bserver.example.org
```

Or if you want to move the file location, you can create `~/.ansible.cfg ` and put in the following content. It specifies the location of the host file.

```
[defaults]
inventory = /path/to/hosts
```

And we can start with a playbook. A playbook is the configuration file that contains what servers to deploy and the tasks to do. We can start with `nginx` installation.

```yaml
---

- name: ide source
  hosts: local
  tasks:
  - name: install nginx
    apt:
      name: 'nginx'
      update_cache: yes
      state: latest
```

This file will try to config all the server under `local` group and then use apt to install `nginx` to latest version after updated the cache. It is pretty clear. Or we can install multiple packages.

```yaml
- name: Install common
  become: yes
  apt:
    name: ['git', 'gdb', 'build-essential']
    update_cache: yes
    install_recommends: no
```

After that, we can make sure that nginx is started.

```yaml
- name: restart NGINX
  service:
    name: nginx
    state: started
```

So, that's all the basic function that ansible able to do easily. It also works with loop, I can install a list of item of go with. I have to add environment variable so I just activate the `.profile`.

```yaml
- name: install go ext
  become_user: "{{ user_name }}"
  shell: ". {{ home_path }}/.profile && go get -u {{ item }}"
  with_items:
    - github.com/stamblerre/gocode
    - github.com/uudashr/gopkgs/cmd/gopkgs
    - github.com/ramya-rao-a/go-outline
    - github.com/acroca/go-symbols
    - golang.org/x/tools/cmd/guru
    - golang.org/x/tools/cmd/gorename
    - github.com/rogpeppe/godef
    - github.com/zmb3/gogetdoc
    - github.com/sqs/goreturns
    - golang.org/x/tools/cmd/goimports
    - golang.org/x/lint/golint
    - github.com/alecthomas/gometalinter
    - honnef.co/go/tools/...
    - github.com/golangci/golangci-lint/cmd/golangci-lint
    - github.com/mgechev/revive
    - golang.org/x/tools/cmd/gopls
    - github.com/go-delve/delve/cmd/dlv
```

They are all useful and easy to maintain config.

And it provides `role` that allow reusable playbook. Then I just need to write

```yaml
- name: ide source
  hosts: ideserv
  become: yes
  roles:
    - ide
    - web
```

Then run `ansible-playbook coder.yml` and it will try to log in and do all the stuff for me.