---
layout: post
title: Windows Subsystem Linux Development
category: Development
tags: [Windows, Linux, Development]
comments: true
---
Linux SHELL is very useful in development. It is color coded, easier to manage, and more command. Windows provide `WSL` to enable linux system in windows. To enable it this is the [official guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Basically, you need to enable `Windows Subsystem for Linux` in the program `windows fratures`. Then select one of the linux system in `Microsoft Store`. The one I recommand is `Debian`. It is small and `Ubuntu` is base on `Debian`.

After you restart and run `Debian`, linux will be ready to go. You now running full operational linux in windows. And it can access windows directories.

Installation will be easier. For git, just run `sudo apt install git`.

I try to let IDE (Intellij IDEA) to run git through `wsl`, I found a bat file from [here](https://stackoverflow.com/questions/43666009/using-git-in-windows-subsystem-for-linux-through-intellij).

```
@echo off
setlocal enabledelayedexpansion
set command=%*
set find=C:\Users\%USERNAME%\AppData\Local\Temp\git-commit-msg-.txt
set replace=/mnt/c/Users/%USERNAME%/AppData/Local/Temp/git-commit-msg-.txt
call set command=%%command:!find!=!replace!%%
echo | C:\Windows\Sysnative\bash.exe -c 'git %command%'
```

It works beautifully.

This is far from a good development. Since there are more to install. And I install `java` in windows, so I can use it eaiser without running `wsl java` all the time.