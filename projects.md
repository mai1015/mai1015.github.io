---
layout: page
permalink: /projects/
title: Projects
wide: true
lead: What I build in the open. Employer work is described on the resume.
---

<div class="projects">

<article class="project project--fig">
  <a class="plate" href="https://github.com/ForgeAILab/forge"><img src="/resume/assets/img/forge-board-800.webp" width="1600" height="1000" loading="lazy" decoding="async" alt="Forge web UI showing a board of coding-agent tasks moving through backlog, todo, in progress, review and done"></a>
  <div class="project-text">
    <h2><a href="https://github.com/ForgeAILab/forge">Forge</a></h2>
    <p>A local-first workflow engine for coding agents, written in Rust. Each task moves through todo, in progress, review, merging and done in its own git worktree, and merge waits until the task's CI steps pass review. REST API, MCP endpoint, CLI and React UI ship in one binary.</p>
    <p class="data">Rust · SQLite · REST · MCP · React</p>
  </div>
</article>

<article class="project project--fig">
  <a class="plate" href="https://github.com/ForgeAILab/smith"><img src="/resume/assets/img/smith-approval.webp" width="1032" height="752" loading="lazy" decoding="async" alt="Smith terminal session asking for approval before running a host shell command"></a>
  <div class="project-text">
    <h2><a href="https://github.com/ForgeAILab/smith">Smith</a> and <a href="https://github.com/ForgeAILab/agent-runtime">agent-runtime</a></h2>
    <p>A terminal coding agent with a TUI and a headless mode, with coding tools, approval boundaries and session continuity. Underneath is a reusable Rust runtime for provider integration, the tool loop, cancellation, checkpoints and usage accounting, with deterministic tests.</p>
    <p class="data">Rust · TUI · Provider adapters</p>
  </div>
</article>

<article class="project">
  <h2><a href="https://github.com/ForgeAILab/spark">Spark</a></h2>
  <p>Project scaffolding and a composable pack registry in a Bun monorepo.</p>
  <p class="data">TypeScript · Bun</p>
</article>

<article class="project">
  <h2><a href="https://github.com/ForgeAILab/novelkit">NovelKit</a></h2>
  <p>A local-first writing desk for long fiction, with a setting wiki beside the manuscript. The repository has the website and releases.</p>
  <p class="data">Tauri 2 · Rust · React · TypeScript · SQLite</p>
</article>

<article class="project">
  <h2><a href="/resume/#zerkov-h">Zerkov</a></h2>
  <p>An extraction game in Godot 4 built around an offline raid loop. The code is private; screenshots are on the resume.</p>
  <p class="data">Godot 4 · Local saves · Native UI</p>
</article>

<article class="project">
  <h2><a href="https://github.com/mai1015/rust-release">rust-release</a></h2>
  <p>A Rust library that compares two folders recursively by file list and MD5.</p>
  <p class="data">Rust</p>
</article>

</div>

## Earlier

Student and early projects, 2019–2020.

- [Social engineering phishing demo]({% post_url 2019-02-06-Social-Engineering-Phishing %}), for EECS3482 at York University.
- [Real Home](/projects/realhome/): a React front end over a Spring Boot and Hibernate REST backend.
- [FuzzyPaws website](/projects/ultgeek/), originally UltGeek, converted to a static Jekyll site.
- [Covid-19 information site](https://github.com/mai1015/eecs-hackfest2020) for EECS Hackfest 2020: an Express and SQLite backend that crawled case data and news feeds.
