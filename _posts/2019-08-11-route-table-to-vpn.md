---
layout: post
title: Spilt traffic using route table in mac
category: Linux
tags: [Linux, MacOS, route]
comments: true
---
When working remotely, we need to access internal resource. Due to security concern, that they are often restricted to only access from local. Then, we need to connect to vpn that enable us to interact with internal server.

However, we do not want to send all the request over vpn, since it might be slow. How do we control how traffic over vpn?

This can be achive by using `route` command.

1. Connect to the vpn, uncheck `send all traffic over VPN connection`
2. Delete route to vpn by default. `sudo route delete -net default -interface ppp0`
3. Add route to physical interface. `sudo route add -net 0.0.0.0 -interface en0`
4. Add ip range route to vpn. `sudo route add -net 10.0.1.0 -netmask 255.255.255.0 -interface ppp0`

Then you are done, and only this ip with in the range will send via vpn.
Source: [link](https://superuser.com/questions/1108277/route-only-certain-ip-range-with-vpn-connection)