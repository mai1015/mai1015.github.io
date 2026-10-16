---
layout: post
title: "Loading mod content from .pak files in UE5"
category: Unreal
tags: [Unreal Engine, UE5, Modding, Pak, DLC]
comments: true
description: Notes from getting user-made content into a shipped UE5 game as separate .pak files, and the four things that cost the most time.
---

The goal was simple to state: let people build content in their own copy of the editor, package it, and have the shipped game load it without rebuilding the game. In Unreal terms that means cooking each mod into its own `.pak` file and mounting it at runtime.

Epic's starting points are the **Simple UGC** example (mods as content-only plugins, cooked separately from the game) and **ChunkDownloader** (downloading and mounting extra paks). Both are worth watching first; links are at the end. What follows is what neither of them made obvious.

## The flow

1. The mod is a content-only plugin. It is cooked against a release version of the base game, so it only contains its own assets.
2. The game finds the mod's `.pak` file and mounts it.
3. The game registers the mod's content root, such as `/BakeryShop/`, so asset paths resolve.
4. The asset registry scans that root, and the game can list and load what's inside.

A trimmed sketch of steps 2 to 4:

```cpp
#include "Misc/CoreDelegates.h"
#include "Misc/PackageName.h"
#include "IPlatformFilePak.h"
#include "AssetRegistry/AssetRegistryModule.h"

bool UModLoader::MountMod(const FString& PakPath, const FString& ModName)
{
#if WITH_EDITOR
    // The editor works on uncooked assets and doesn't use the pak file layer. See pitfall 2.
    return false;
#else
    if (!FCoreDelegates::MountPak.IsBound())
    {
        UE_LOG(LogTemp, Warning, TEXT("No pak platform file (was the game started with -NoPak?)"));
        return false;
    }

    IPakFile* Pak = FCoreDelegates::MountPak.Execute(PakPath, /*PakOrder*/ 1000);
    if (!Pak)
    {
        return false;
    }

    // Decided when the pak was built, for example ../../../MyGame/Plugins/Mods/BakeryShop/
    const FString PluginRoot = Pak->PakGetMountPoint();
    const FString Root = FString::Printf(TEXT("/%s/"), *ModName);
    FPackageName::RegisterMountPoint(Root, FPaths::Combine(PluginRoot, TEXT("Content/")));

    IAssetRegistry& Registry = FModuleManager::LoadModuleChecked<FAssetRegistryModule>("AssetRegistry").Get();
    Registry.ScanPathsSynchronous({ Root }, /*bForceRescan*/ true);
    return true;
#endif
}
```

Error handling and the plugin descriptor are left out to keep it short.

## Pitfall 1: IoStore

UE5 packages with IoStore on by default, which puts cooked assets into `.utoc`/`.ucas` containers instead of the `.pak`. With it on, the mod build didn't give us a `.pak` we could mount and load on its own.

Turning off **Use Io Store** (Project Settings > Packaging) for the builds involved gave a plain `.pak` with the assets inside, and mounting it worked as expected. Supporting IoStore containers for mods is possible, but it is a separate job. Decide which one you want before writing the loader.

## Pitfall 2: there is no pak layer in the editor

ChunkDownloader would log this in the editor:

```text
Unable to mount chunk 0 (no FCoreDelegates::MountPak bound)
```

The pak platform file binds `FCoreDelegates::MountPak` when it starts up, and in editor builds it only starts if you pass `-UsePaks`. The editor also can't load cooked or unversioned packages, which is exactly what a mod pak contains. So don't try to mount mods in the editor. Guard the code with `WITH_EDITOR`, as above, and test mod loading in packaged builds only.

## Pitfall 3: the mount point is baked in

My first instinct was to change where a pak mounts. You don't need to. The mount point is the common root of the file paths that went into the pak, so it is fixed when the pak is created, and `GetMountPoint()` already returns the right value.

What matters is that the mod was cooked with the same project name and plugin layout the game expects. Then `../../../MyGame/Plugins/Mods/BakeryShop/` lines up with where the game looks. If assets come out as missing after a successful mount, compare the mount point with the path you registered, character for character.

## Pitfall 4: mounted isn't discovered

After mounting, `LoadObject` on a known path works. Anything that asks the asset registry, such as "give me every map in this mod" or "every item data asset", sees nothing until you scan the new root with `ScanPathsSynchronous`. Run the scan once per mod right after mounting, then query as usual.

## References

- *Adding Mod Support with the Simple UGC Plugin* (Inside Unreal, YouTube)
- *ChunkDownloader Explained* (Inside Unreal, YouTube)
- Unreal Engine forums: *Get all Actors from mounted .pak*, *Loading Map from Pak at Runtime*, and *ChunkDownloader error "no FCoreDelegates::MountPak bound"*
- `Engine/Source/Runtime/PakFile/Private/IPlatformFilePak.cpp` (UE 5.3) for when the pak platform file is active
