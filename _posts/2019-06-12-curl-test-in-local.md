---
layout: post
title: cUrl Test in local
category: Note
tags: [cUrl, Linux, HTTP]
comments: true
---
So, when we try to access our local development website, we tend to access the website via `http://localhost:8080/`. However, when we need to test for domain name functionality, we need to manually resolve it in `hosts`.

With cURL, we can easily resolve the domain manually. Use `--resolve HOST:PORT:ADDRESS  Force resolve of HOST:PORT to ADDRESS`, we can change the address of the host.

```sh
# access http
curl --resolve 'mai1015.com:80:127.0.0.1' http://mai1015.com/path
# access http
curl --resolve 'mai1015.com:443:127.0.0.1' https://mai1015.com/path
```

So, the port is included in part of the resolve.

Or we can use `-H, --header LINE   Pass custom header LINE to server (H)` to hack the header. We can change the `host` in the header. And, the server assumes it is accessing the specified server.

```sh
curl -H 'Host: mai1015.com' http://127.0.0.1/something
```

However, it does not work in https because the certificate domain does not match the URL. It is better to use `--resolve`.

Source: [stackoverflow](https://stackoverflow.com/questions/3390549/set-curl-to-use-local-virtual-hosts)
