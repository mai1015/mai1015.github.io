---
layout: post
title: Vuex Error With TypeScript
category: TypeScript
tags: [TypeScript, Vue, Vuex, Javascript]
comments: true
---
Vuex is a cool library for vue that allow the project to control state easier. However, I was trying to use it with typescript. It causes error like this. I use `championswimmer/vuex-module-decorators` library to support vuex annotation.

```js
ERR_ACTION_ACCESS_UNDEFINED: Are you trying to access this.someMutation() or this.someGetter inside an @action?
That works only in dynamic modules.
If not dynamic use this.context.commit("mutationName", payload) and this.context.getters["getterName"]
Error: Could not perform action login
at Store.eval (webpack-internal:///./node_modules/vuex-module-decorators/dist/esm/index.js:311:33)
at step (webpack-internal:///./node_modules/vuex-module-decorators/dist/esm/index.js:96:23)
at Object.eval [as throw] (webpack-internal:///./node_modules/vuex-module-decorators/dist/esm/index.js:77:53)
at rejected (webpack-internal:///./node_modules/vuex-module-decorators/dist/esm/index.js:68:65)
undefined
```

I dont understand why it happends because I did not acess any mutation or getter. I was confused. So, I modify my code again and again to see whats wrong. I return a Promise in action and I rejected it. And it cause the same error. So, I search it on google. It turns out that is an [issue](https://github.com/championswimmer/vuex-module-decorators/issues/26). The library warps the error, so the error is confusing. All I did then is add `rawError` option to the annatation so it becomes `@Action({rawError: true})`. And it display error normally.