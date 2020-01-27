---
layout: post
title: Spring Boot Autowiring Multiple implementation for Interface
category: Java
tags: [Java, SpringBoot, Autowiring]
comments: true
---
Autowiring is a convenient feature for development. Developers do not require to handle object creation, the application can help decide the object/s that a service or controller required to work.

When specifying a class, sometimes it is necessary to have an interface so you can make different implementation. However, it might confuse the application since it cannot choose the correct bean. There are ways to solve the problem.

1. Primary annotation.

    If you have multiple implementations, you can choose the one that is primarily used. Then apply `@Primary`, the application will automate wire all related interface to this implementation.

```java
public interface A {
	void a();
}

@Service
@Primary
public class B implements A {
	//...
}

@Service
public class C implements A {
	//...
}
```

	So the application will link it to class B.

2. Qualifier annotation

	If you need to choose between different implementation, you should use `@Qualifier`.

```java
public interface A {
	void a();
}

@Service
@Qualifier("firstService")
public class B implements A {
	//...
}

@Service
@Qualifier("secondService")
public class C implements A {
	//...
}
```

	If you need implementation C, you can specify with `@Qualifier`.

```java
@Component
public static class FirstManager {

    private final A a;

    @Autowired // inject FirstServiceImpl
    public FirstManager(@Qualifier("secondService") A a) {
        this.a = a;
    }
}
```

Reference: [link](https://stackoverflow.com/questions/51766013/spring-boot-autowiring-an-interface-with-multiple-implementations)
