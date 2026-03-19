# Node.js Overview

## Snapshot

- Spec name: nodejs
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^25.8.1
- Primary language: javascript
- Homepage: https://nodejs.org/api/documentation.html
- Source set: official Node.js v25.8.1 docs for modules, packages, file system, path, stream, process, child_process, worker_threads, and test runner; plus parse/nodejs-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- nodejs
- javascript
- runtime
- esm
- commonjs
- streams
- filesystem
- workers
- test-runner

## Purpose

This pack teaches an agent to use Node.js 25.8.1 effectively for CLI apps,
servers, filesystem work, streams, subprocesses, workers, the built-in test
runner, and module/runtime behavior without collapsing those concerns into
browser or framework intuition.

## Guiding Principles

- Choose ESM or CommonJS deliberately and keep package boundaries explicit.
- Prefer built-in runtime primitives before reaching for third-party abstractions.
- Treat streams, subprocesses, and workers as resource-management primitives,
  not just convenience helpers.
- Use `node:fs/promises` for simple file IO and stream pipelines when size or
  throughput matters.
- Use `process.exitCode` for error signaling unless forced termination is truly
  required.
- Keep Node.js runtime semantics distinct from browser semantics.
- Respect the stability index and avoid presenting deprecated or legacy APIs as
  preferred defaults.

## Boundary Notes

- Primary sources are Node.js v25.8.1 documentation pages for ESM, packages,
  file system, path, streams, process, child processes, worker threads, and the
  test runner.
- Coverage is centered on the highest-leverage surfaces for ordinary server,
  CLI, and tooling work rather than every Node.js core module.
- The pack is organized by real task shape: module boundaries, file and path
  work, stream composition, subprocesses and workers, and test/runtime control.
- This is a fresh pack, not a port from an older Node.js agent file.
- The strongest boundaries in the pack are Node.js vs browser runtime behavior
  and ESM vs CommonJS vs package-resolution behavior.

## FAQ

### Should new Node.js code default to ESM?
Usually yes when the package boundary is already ESM-aware, but the important
decision is consistency. Mixed module assumptions cause more trouble than either
module system by itself.

### Should I use `process.exit()` for normal failures?
Usually no. Prefer `process.exitCode` so pending cleanup and IO can complete.

### When should I stream instead of using convenience file APIs?
When payload size, throughput, or memory pressure matters, or when data should
move incrementally through transforms or subprocesses.

## External Resources

- Official docs index: https://nodejs.org/api/documentation.html
- ESM docs: https://nodejs.org/api/esm.html
- Package boundary docs: https://nodejs.org/api/packages.html
- File system docs: https://nodejs.org/api/fs.html
- Path docs: https://nodejs.org/api/path.html
- Stream docs: https://nodejs.org/api/stream.html
- Process docs: https://nodejs.org/api/process.html
- Child process docs: https://nodejs.org/api/child_process.html
- Worker threads docs: https://nodejs.org/api/worker_threads.html
- Test runner docs: https://nodejs.org/api/test.html
