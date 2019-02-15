---
layout: post
title: Full page background with css3
category: HTML
published: true
tags: [HTML,CSS3]
comments: true
---
I was trying to make a page with a full image background. It was simple. I fit everything into one `div` with class container. And give the background to the body tag.

```css
body {
    background-image: url(/image/bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;
}
```

It works well. However, I tried to make it responsive to different devices. It leaves an ugly white space at the bottom. I can tell that it is because the body did not have a value of height. I have to force it to have the height of the screen. Then, the code becomes:

```css
body {
    height: 100%;
    background-image: url(/image/bg.jpg);
    background-repeat: no-repeat;
    background-size: cover;
}
```

It actually overdoes it. I now have a scroller at the right. This is so confusing for the unexpected result. After researching a little bit. The `margin` value actually pull the body down, so I got a margin for the body at the top.

There is a simple fix. I just add one more `div` that warps container, and give it `overflow: auto;`.

```css
.page {
    overflow: auto;
}
```