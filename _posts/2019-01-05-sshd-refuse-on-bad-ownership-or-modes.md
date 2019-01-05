---
layout: post
title: SSH refuse on bad ownership or modes
category: Note
tags: [Linux, SSH]
comments: true
---
After I updated the gitlab to `11.6.1-ee`, ssh to git user failed.

I went on gitlab and did not found any useful information. Then I start checking my sshd services.

```
Jan  6 06:48:26 UltGeek-GitLabServer sshd[115940]: error: Unsafe AuthorizedKeysCommand "/opt/gitlab/embedded/service/gitlab-shell/bin/gitlab-shell-authorized-keys-check": bad ownership or modes for directory /opt/gitlab/embedded/service/gitlab-shell/bin
Jan  6 06:50:15 UltGeek-GitLabServer sshd[116182]: error: Unsafe AuthorizedKeysCommand "/opt/gitlab/embedded/service/gitlab-shell/bin/gitlab-shell-authorized-keys-check": bad ownership or modes for directory /opt
```

It turns out to be the wrong onwership or modes for the directory after I updated it. Then I update all the relative directory including `/opt` because ssh panic when any of the directory is writable for other group or user with `chmod 0755 dir`.

Finally, it is back to working agagin. I do not sure if this makes any sense but it indeed get a better security.