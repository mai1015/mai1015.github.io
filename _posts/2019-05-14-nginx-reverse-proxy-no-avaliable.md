---
layout: post
title: Nginx reverse proxy solve no avaliable 
category: Nginx
tags: [Linux, Nginx, http, proxy]
comments: true
---
## Background
We use a main server reverse proxy all the request to other backend server. So, it means that the client access the main server, and nginx reverse proxy the request to the other serever.
![reverse proxy](https://www.cloudflare.com/img/learning/cdn/glossary/reverse-proxy/reverse-proxy-flow.svg)
So, we use subdomain to dynamically resolve the address so it is working well when server ip changes.

## Problem
Today, the nginx is not working as expected. It redirect all request to 502 page. And we found the error log.
```
2019/05/14 08:41:15 [error] 688#688: *4 connect() failed (110: Connection timed out) while connecting to upstream, client: 113.*.*.*, server: furry.top, request: "GET / HTTP/2.0", upstream: "https://116.*.*.*:443/", host: "furry.top", referrer: "https://furry.top/"
2019/05/14 08:41:15 [error] 688#688: *4 no live upstreams while connecting to upstream, client: 113.*.*.*, server: furry.top, request: "GET / HTTP/2.0", upstream: "https://https/", host: "furry.top", referrer: "https://furry.top/"
```
It is quite weird because when we reload the server it starts working. And then stop working after 10 seconds. We could not found why this happend.

## Attempts
I assume that it is because of the unstable connection. So, I check append `max_fails=0` config to ensure `upstream` does not fail. However, it gets worse. Nginx basically try to connect to backend continuously and not reply to any connection. However, when I `curl` backend address, it has successfully responsed. So nothing wrong with the connection but nginx some how cannot connect to the backend.

I have no idea why it happend. Then I check the connection with `netstat -ap`. One line draw my attention.
```
Proto Recv-Q Send-Q Local Address        Foreign Address   State     PID/Program name
tcp        0      1 main-server.a:36298  166.*.*.*:http    SYN_SENT  10128/nginx: worker
```
Since there is no respond from the address, it did not connect to correct backend address. But, why it only works for small period of time? Does it mean that the dns server did not work?

So I check in the configuration file again. I found `resolver 114.114.114.114`, this changes the DNS server. So, to verify the address. I use `dig` command, `dig @114.114.114.114 furry.top` and the result is that `114.114.114.114` is not working. So, I replace the DNS with `8.8.8.8` and the problem solved.

So, that's why nginx fail to connect to backend but I cannot find any log indicate that the DNS failed. It is because I did not check the default logging file.

```
[error] 2439#2439: upstream-dynamic-servers: 'furry.top' could not be resolved (110: Operation timed out)
```

The answer was there.