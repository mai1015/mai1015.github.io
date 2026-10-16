---
layout: post
title: "A conflicting instance of AutomationTool is already running"
category: Unreal
tags: [Unreal Engine, UE5, AutomationTool, Build]
comments: true
description: Why UAT refuses to start when another build is running on the same engine install, how to find the other process, and the two switches that change the behaviour.
---

I worked on a desktop tool that packaged Unreal plugins by shelling out to `RunUAT` with a custom command. Most builds went through. Every so often one died two seconds after it started:

```text
UE: Running AutomationTool...
UE: Using bundled DotNet SDK version: 6.0.302
UE: Starting AutomationTool...
UE: Unhandled exception: System.Exception: A conflicting instance of AutomationTool is already running.
    Current location: D:\Program Files\Epic Games\UE_5.3\Engine\Binaries\DotNET\AutomationTool\AutomationTool.dll.
    A process manager may be used to determine the conflicting process and what tool may have launched it
UE:    at UnrealBuildBase.ProcessSingleton.RunSingleInstanceThread(...)
UE: AutomationTool exiting with ExitCode=1 (Error_Unknown)
UE: BUILD FAILED
```

Nothing was wrong with the plugin. The build never got as far as compiling.

## Why it happens

AutomationTool (UAT) only allows one instance per engine install. On startup it creates a named, machine-wide mutex, and the name comes from an MD5 of the path to `AutomationTool.dll`. If the mutex already exists, the new process throws the exception above and exits.

That has a few consequences that are easy to miss:

- It is per engine install, not per project. Two different projects packaged at the same time on the same UE 5.3 install will collide.
- Two different installs (say 5.3 and 5.4) never collide, because their paths differ.
- The editor counts. **Platforms > Package Project** runs UAT too, so a user packaging from the editor blocks your tool, and the other way round.
- A crashed UAT does not leave the lock behind. When the owning process exits, Windows closes its handle and the next run starts cleanly. If you keep seeing the error, something is still running.

In my case it was the tool itself: it let a second package job start while the first was still cooking.

## Finding the other process

In UE5, UAT runs on the bundled .NET runtime, so in Task Manager it shows up as `dotnet.exe`, not `AutomationTool.exe`. PowerShell shows which one it is and what launched it:

```powershell
Get-CimInstance Win32_Process -Filter "Name = 'dotnet.exe'" |
  Where-Object CommandLine -match 'AutomationTool' |
  Select-Object ProcessId, ParentProcessId, CommandLine
```

The command line tells you the project and the command, and the parent process ID tells you whether it came from the editor, your tool or a CI agent.

## Fixes

**Run one UAT per engine install, on purpose.** If you are writing a tool that calls UAT, put builds behind a queue keyed by engine path and run them one at a time. Show the queued state in the UI, so users don't read a waiting build as a hung one. This is the real fix; the switches below are for when you don't control every caller.

**`-WaitForUATMutex`.** Pass it to UAT and, instead of failing, the second instance logs that another UAT is running and waits for it, printing a line every 15 seconds:

```bat
Engine\Build\BatchFiles\RunUAT.bat BuildPlugin -Plugin="C:\Work\MyPlugin\MyPlugin.uplugin" -Package="C:\Out\MyPlugin" -WaitForUATMutex
```

This suits build machines that pick up jobs back to back. It is a poor fit for interactive tools, where the user just sees a build that doesn't move.

**`uebp_UATMutexNoWait=1`.** With this environment variable set, UAT skips the check and runs alongside the other instance. The check exists because two runs can write to the same build and intermediate files, so I would not use this to package two things side by side on one install.

## Sources

- `Engine/Source/Programs/Shared/EpicGames.Build/Automation/ProcessSingleton.cs` and `Engine/Source/Programs/AutomationTool/Program.cs` in the UE 5.3 source, which define the mutex, `-WaitForUATMutex` and `uebp_UATMutexNoWait`.
