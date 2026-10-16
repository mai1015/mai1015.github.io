---
layout: post
title: "Port in use on Windows when nothing is using it"
category: Windows
tags: [Windows, WSL, Hyper-V, Networking]
comments: true
description: Hyper-V and WinNAT reserve blocks of TCP ports on Windows machines with WSL 2 or Docker. How to see the reserved ranges and keep a port for yourself.
---

The symptom: a dev server that ran fine yesterday won't start today. Depending on the runtime, the error looks like one of these:

```text
listen EACCES: permission denied 0.0.0.0:3000
An attempt was made to access a socket in a way forbidden by its access permissions.
Error: bind: address already in use
```

`netstat -ano | findstr :3000` shows nothing listening. Rebooting sometimes fixes it, and sometimes moves the problem to a different port.

## The cause

On machines with Hyper-V, WSL 2 or Docker Desktop, Windows reserves blocks of TCP ports for the virtual network. The service doing the NAT for those networks is `winnat`. A reserved port isn't in use by any process, so `netstat` doesn't list it, but ordinary programs can't bind to it either. The reservations are taken again at each boot, which is why the broken port seems to wander.

Check whether your port falls inside a reserved range:

```bat
netsh int ipv4 show excludedportrange protocol=tcp
```

```text
Protocol tcp Port Exclusion Ranges

Start Port    End Port
----------    --------
      2869        2869
      2980        3079
      5357        5357
     50000       50059     *

* - Administered port exclusions.
```

Here port 3000 sits inside `2980–3079`, so nothing can bind it.

## Fix: reserve the port yourself

From an administrator prompt:

```bat
net stop winnat
netsh int ipv4 add excludedportrange protocol=tcp startport=3000 numberofports=1
net start winnat
```

Stopping WinNAT releases its reservations. Adding your own exclusion before it starts again means it can't claim that port, and your program can still bind it. Your exclusion shows up in the list with a `*`, as an administered exclusion.

Notes:

- Stopping `winnat` briefly cuts networking for WSL 2 and containers. Run this when nothing important is talking through them.
- Add `store=persistent` to keep the exclusion across reboots.
- Do the same with `ipv6` in place of `ipv4` if the program listens on IPv6.

## If the reserved blocks are everywhere

These blocks come out of Windows' dynamic port range. Check where that range starts:

```bat
netsh int ipv4 show dynamicport tcp
```

The Windows default starts at 49152. If yours starts at 1024, which some installs and updates leave behind, the reservations can land on common dev ports like 3000, 5000 and 8080. Moving the range back to the default keeps them out of the way after the next reboot:

```bat
netsh int ipv4 set dynamic tcp start=49152 num=16384
netsh int ipv6 set dynamic tcp start=49152 num=16384
```

## Summary

- Run `netsh int ipv4 show excludedportrange protocol=tcp` first; it explains most "in use but not used" errors on Windows.
- Stop `winnat`, add an exclusion for the ports you depend on, then start `winnat` again.
- If the reservations keep landing on low ports, move the dynamic port range back to 49152.
