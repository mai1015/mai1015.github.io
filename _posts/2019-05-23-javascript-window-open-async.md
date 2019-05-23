---
layout: post
title: Javascript open new Window blocked when asynchronous
category: Javascript
tags: [Javascript, Vue, async, Typescript]
comments: true
---
## Problem
When you trying to open a new tag for your user. It is ok if we just use `window.open` right away. However, we need to do complex task like making request from server to generate the link. Then it will be block by the browser.

## Solution
The solution is pretty straight forward. You can open new tab and modify it after you get the link. This is the sample code below.

```js
async clicked(e) {
    // create new window
    var w = window.open('', '_blank');
    // fetch url
    var url = await someFunction();
    // then modify the location
    w.location.href = w;
}
```

The reason of that is the tab should be open during that user click event loop. Otherwise, it is going to assume that is a pop-up that should be blocked. That is why you can get ad pop-up on some site when you click.

This is from [stackoverflow](https://stackoverflow.com/questions/19026162/javascript-window-open-from-callback)