---
layout: post
title: "Shipping an Unreal Engine 5 plugin without its source"
category: Unreal
tags: [Unreal Engine, UE5, Plugins, Build]
comments: true
description: Package a UE5 plugin with BuildPlugin, then strip the source so users get binaries, headers and the Build.cs files UnrealBuildTool still needs.
---

Sometimes you need to hand someone an Unreal plugin without handing over the code: an SDK for partners, a paid plugin, or a tool you can't open-source yet. Unreal supports this, but "delete the Source folder" is not the answer. UnrealBuildTool still needs part of it.

These notes are for UE 5.3 on Windows. The ideas carry over to other versions, but a binary plugin only loads in the engine version it was built for. Ship one package per engine version.

## 1. Build it with BuildPlugin

The **Package** button in the editor's Plugins window runs the same UAT command, so you may as well call it directly and script it:

```bat
Engine\Build\BatchFiles\RunUAT.bat BuildPlugin ^
  -Plugin="C:\Work\MyPlugin\MyPlugin.uplugin" ^
  -Package="C:\Out\MyPlugin" ^
  -TargetPlatforms=Win64
```

It is worth knowing what this does, because it explains what you can delete later:

- It copies the plugin into a throwaway host project and builds it there: `UnrealEditor` Development for your host platform, and `UnrealGame` Development and Shipping for each target platform.
- It copies the build products into the package, along with `Source`, `Content`, `Resources`, `Shaders`, the generated headers under `Intermediate/Build/.../Inc`, and anything listed in `Config/FilterPlugin.ini`. `Tests` folders are left out.
- It rewrites the packaged `.uplugin` with `"Installed": true` and the engine version it was built against. You don't need to add either by hand.

Make sure this build succeeds before you remove anything. Everything after this point happens in the package folder, never in your working copy.

## 2. Tell UnrealBuildTool not to compile

In the packaged plugin, open each module's `Build.cs` and add one line:

```csharp
public class MyPluginRuntime : ModuleRules
{
    public MyPluginRuntime(ReadOnlyTargetRules Target) : base(Target)
    {
        bUsePrecompiled = true;

        PublicDependencyModuleNames.AddRange(new[] { "Core", "CoreUObject", "Engine" });
        PrivateDependencyModuleNames.AddRange(new[] { "Slate", "SlateCore" });
    }
}
```

`bUsePrecompiled` makes UBT link the binaries you shipped instead of trying to build the module, which would fail without the `.cpp` files. Keep the dependency lists. UBT still uses them to work out what your module links against when it builds the user's project.

## 3. Strip the source

Inside `Source/<Module>/`:

- Keep the `Build.cs`. A plugin with no C++ users still needs it, because UBT discovers modules through these files.
- Keep the public headers your users need to call your code from C++. If nobody will use the plugin from C++, you can delete all headers.
- Delete every `.cpp` and every private header.

This is where a clean `Public`/`Private` split pays off. If your public headers include private ones, you'll find out now.

## 4. Decide what binaries to ship

- `Binaries/Win64/*.dll` is what the editor loads. Keep it.
- `Binaries/Win64/*.pdb` holds debug symbols. They're large and make reverse engineering easier, so delete them unless you want users to get readable crash stacks.
- `Intermediate/Build/Win64/UnrealGame/{Development,Shipping}/...` holds the static `.lib` files. Packaged games link plugins statically, so without these the user's project opens and runs in the editor but fails to package.
- `Intermediate/Build/Win64/UnrealEditor/...` holds the libraries C++ projects link against in the editor. Keep them if users will call your code from C++. A private editor-only module doesn't need its libraries in either folder.

Some sellers use that `UnrealGame` gap for trial builds: ship without it, and the plugin works in the editor but can't be packaged until the user buys the full version.

## 5. Test it like a user

Two checks catch nearly every mistake:

1. Put the stripped package in a fresh C++ project's `Plugins` folder. Generate project files, build, open the editor, then package a Shipping build.
2. Do the same in a Blueprint-only project, which has no compiler step and will fail loudly if anything still expects source.

If UBT tries to compile your module, a `Build.cs` is missing `bUsePrecompiled`. If packaging fails at link time, an `UnrealGame` library is missing.

## Further reading

- *How To Package And Sell Binary Plugins For UE5* (Algosyntax), which covers the same steps and the trade-offs of selling binary versus source plugins.
- `Engine/Source/Programs/AutomationTool/Scripts/BuildPluginCommand.Automation.cs` and `Engine/Source/Programs/UnrealBuildTool/Configuration/ModuleRules.cs` in the engine source, for exactly what gets built and copied.
