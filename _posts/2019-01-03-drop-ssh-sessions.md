---
layout: post
title: Drop Inactive SSH Sessions
category: Note
tags: [Linux, SSH]
comments: true
---
There will be many connect remain if we unexpectedly disconnected from the server. It remains inactive but still shows up when you type `w` command.

How to drop an ssh connection when unexpectedly disconnect from the server?

we can command to solve the problem

`ps -ef | grep sshd | grep -v root | grep -v 12345 | grep -v grep | awk '{print "sudo kill -9", $2}' |sh `

`ps -of` displays all the process. Then we want to display only sshd session and drop your own ssh session. and then kill it with sh command.

just to remember to replace 12345 with your pid. It won't kill any root user session.

If you are in linux you can try `pkill -o -u YOURUSERNAME sshd` to kill oldest SSH session.

[Resource](https://unix.stackexchange.com/questions/127571/terminate-dropped-ssh-sessions)