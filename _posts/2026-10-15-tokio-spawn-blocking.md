---
layout: post
title: "spawn_blocking, block_on and block_in_place in Tokio"
category: Rust
tags: [Rust, Tokio, Async]
comments: true
description: Three Tokio functions that sound alike and do opposite things. What each one is for, which one panics where, and how to call async code from a sync callback.
---

A while back I saved a note that said `spawn_blocking` "runs asynchronous tasks synchronously" and that it "blocks other Tokio tasks until it completes". Both claims are wrong, and the second one is the opposite of the truth. This post replaces that note.

The confusion comes from three functions with similar names that go in opposite directions:

| You have | You need to | Use |
| --- | --- | --- |
| async code | run blocking or CPU-heavy work | `tokio::task::spawn_blocking` |
| async code, multi-thread runtime | block right here, without moving data to another thread | `tokio::task::block_in_place` |
| sync code, no runtime on this thread | wait for a future | `Runtime::block_on` or `Handle::block_on` |

## spawn_blocking: blocking work, from async code

`spawn_blocking` takes a normal closure, not a future, and runs it on a separate pool of threads reserved for blocking work. It hands back a `JoinHandle` you can `.await`, so the calling task is suspended while it waits, not blocked, and the async workers keep running other tasks.

```rust
use tokio::task;

async fn hash_upload(bytes: Vec<u8>) -> anyhow::Result<String> {
    // SHA-256 over a large buffer is CPU work. Run it off the async workers.
    let digest = task::spawn_blocking(move || {
        use sha2::{Digest, Sha256};
        hex::encode(Sha256::digest(&bytes))
    })
    .await?; // JoinError if the closure panicked

    Ok(digest)
}
```

Use it for file and database calls through synchronous libraries, compression, hashing, image work, anything that would hold a worker thread for more than a few hundred microseconds.

Three things to know:

- Once the closure is running, it can't be cancelled. Calling `abort()` on the handle has no effect once the closure is running. Only a task that hasn't started yet can be stopped.
- Dropping the runtime waits for every started blocking task to finish. Use `shutdown_timeout` if you need to bound that.
- The blocking pool defaults to 512 threads, so it won't push back if you flood it with CPU-bound work. Cap parallel heavy jobs with a `Semaphore`, or hand them to Rayon.

## block_on: async code, from sync code

`block_on` goes the other way. You're on a plain thread, and you need the result of a future:

```rust
fn main() -> anyhow::Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    let body = rt.block_on(async { reqwest::get("https://example.com").await?.text().await })?;
    println!("{} bytes", body.len());
    Ok(())
}
```

The rule: **never call it from a thread that is already running async tasks.** If you do, Tokio panics with this message:

```text
Cannot start a runtime from within a runtime. This happens because a function
(like `block_on`) attempted to block the current thread while the thread is
being used to drive asynchronous tasks.
```

The usual way to hit it: a framework calls your code from a synchronous callback. The callback looks like a normal function but is actually running on a runtime worker, and you need to call an async client from it.

## Calling async code from a sync callback

If the callback runs on a runtime thread, combine the two: move the blocking wait onto the blocking pool, and drive the future from there with a handle to the existing runtime.

```rust
use tokio::runtime::Handle;

fn on_event(handle: Handle, id: u64) -> tokio::task::JoinHandle<anyhow::Result<Record>> {
    tokio::task::spawn_blocking(move || {
        // Allowed: this thread belongs to the blocking pool, not an async worker.
        handle.block_on(fetch_record(id))
    })
}
```

Often the better fix is not to block at all. If the callback can't return a future, spawn the work with `tokio::spawn`, send the result back over a channel, and let the caller react when it arrives.

## block_in_place: the narrow case

`block_in_place` blocks the current worker thread, but first tells the scheduler to move that worker's other queued tasks to another thread. It avoids moving data into a `'static` closure, which is handy when the blocking code needs borrowed values.

Two catches:

- It panics on a `current_thread` runtime, because there is no other worker to hand tasks to. That includes `#[tokio::test]` by default.
- Everything else in the same task pauses too, including sibling futures in a `join!`. When in doubt, use `spawn_blocking`.

## References

- Tokio API docs: [`spawn_blocking`](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html), [`block_in_place`](https://docs.rs/tokio/latest/tokio/task/fn.block_in_place.html), [`Runtime::block_on`](https://docs.rs/tokio/latest/tokio/runtime/struct.Runtime.html#method.block_on), [`Handle::block_on`](https://docs.rs/tokio/latest/tokio/runtime/struct.Handle.html#method.block_on)
