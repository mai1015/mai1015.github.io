---
layout: post
title: Useful Git commands and Clone local
category: Git
tags: [Linux, Git, VSC]
comments: true
---
Git is a strong version controll system. It allows you to track code and verison, and keep all the data you need to go back to certain version.

This is so good that we can use it even if we are working solo. We can see how the project grows. So, this is how to setup a project locally.

## Steps
Here are some steps to prepare you own repository.

1. you will need to create a project by `cd /path/to/project/`. Then use `git init` to init a new git repository.
2. Then you will need to add your project files. `git add .`
3. Finally `git commit -m "Inital"` to commit you first changes.

So, those step setup the basics. As you go futher, you will get more files in your project. Remember to add and commit it as you go.

1. Adding file to git: `git add file`
2. Commit: `git commit -m "message"`

If you only change some file, you can use `git commit -am "message"` to make a fast commit. It saves all your time to add files that changes.

If you want to make it easier to share, you can init a bare repository `git init --bare /path`. This does not really contain your work file as usual. You have to clone and commit it if you want to modify the file.

## Clone
If we want to get codes from other, we can use `git clone git://...` to clone other repository. and we can even clone our repository like `git clone /path/to/project/ /path`. 

So, you might say, why would you do it. It is because you want to keep an deployment copy else where that does not change a lot.

## Update
You got your copy of code, but you want to keep it up to date if you working with others. The command is `git pull`.

## Simple Deployment
So you are done with you coding. Now, you want to deploy you code, you can try this [gist](https://gist.github.com/noelboss/3fe13927025b89757f8fb12e9066f2fa). Add hooks that runs every commit.