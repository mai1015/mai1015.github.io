---
layout: post
title: C Pointer
category: Note
tags: [C,Linux]
comments: true
---
C pointer is powerful that can point to anywhere with good definition. Here are collections of interesting way to use pointer.

|definition        | meaning                                               | link                  |
|------------------|-------------------------------------------------------|:---------------------:|
|`type *i;`        | simple pointer                                        | [here](#type-i)       |
|`type *i[n];`     | array of n pointer                                    | [here](#type-in)      |
|`type (*p)[n];`   | a pointer to an array of n                            | [here](#type-pn)      |
|`type (*p)();`    | a pointer to function that return type                | [here](#type-p)       |
|`type (*p[n])();` | a pointer to an array of n functions that return type | [here](#type-xn)      |

### `type *i`
```c
int j;
int *i;
i = &j;
*i = 10;
// j == 10
```

### `type *i[n]`
```c
int j;
int *i[10];
i[0] = &j;
*i[0] = 10;
// j == 10
```

### `type (*p)[n]`
```c
int i[10];
int (*p)[10];
p = &i;
*p[0] = 10;
*((*p)+1) = 11;
// i = {10,11,?,...,?}
```

### `type (*p)()`
```c
int test() {
	printf("%s\n", "test");
	return 1;
}
int main() {
	int (*x)();
	x = &test;
	int z = x();
	printf("%d\n", z);
}
//result:
//test
//1
```

### `type (*x[n])()`
```c
int test() {
	printf("%s\n", "test");
	return 1;
}
int main() {
	int (*x[10])();
	x[0] = &test;
	int z = x[0]();
	printf("%d\n", z);
}
//result:
//test
//1
```