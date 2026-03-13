# Node.js Documentation Pack

## Snapshot
- Library: Node.js
- Target version: ^25.8.1
- Primary language: javascript
- Homepage: https://nodejs.org/api/documentation.html
- Source set:
  - https://nodejs.org/api/documentation.html
  - https://nodejs.org/api/esm.html
  - https://nodejs.org/api/modules.html
  - https://nodejs.org/api/packages.html
  - https://nodejs.org/api/fs.html
  - https://nodejs.org/api/path.html
  - https://nodejs.org/api/stream.html
  - https://nodejs.org/api/process.html
  - https://nodejs.org/api/child_process.html
  - https://nodejs.org/api/worker_threads.html
  - https://nodejs.org/api/test.html

## Purpose
Collect the Node.js 25.8.1 runtime knowledge most useful for agent performance
in ordinary server, CLI, and tooling work: modules, filesystem, streams,
process/runtime behavior, workers, subprocesses, and the built-in test runner.

## Ecosystem Boundaries
- Node.js core runtime behavior is not the same thing as browser behavior.
- ESM, CommonJS, and package boundary rules are related but distinct concerns.
- Third-party frameworks should not be treated as Node.js core surface.
- Built-in globals and standard library modules should be preferred over older
  compatibility habits when the current docs support them.

## Source Inventory By Role
- Contract source:
  - Node.js v25.8.1 API documentation pages for `node:fs/promises`,
    `node:path`, `node:stream/promises`, `node:child_process`,
    `node:worker_threads`, `node:test`, `node:module`, and `process`
- Guidance source:
  - Node.js module, package, process, stream, and test-runner docs
- Workflow source:
  - stream, filesystem, child-process, worker, and test-runner examples
- Compatibility source:
  - ESM/CommonJS interoperability pages and stability-index guidance

## Core Runtime Model
- Prefer explicit module boundaries. Decide whether a package is ESM or
  CommonJS instead of mixing them casually.
- Prefer `node:`-prefixed imports for built-in modules in examples and guidance.
- Treat filesystem APIs, streams, subprocesses, and workers as operational APIs
  with error-handling and resource-lifecycle implications.
- Use the built-in test runner when the task does not require a third-party
  testing framework.

## Decision Rules
- Use ESM for new code when the package boundary is already ESM-aware; use
  `createRequire()` only when an ESM module must load CommonJS-compatible
  dependencies.
- Use `node:fs/promises` for straightforward file IO; fall back to streaming
  APIs when payload size or backpressure matters.
- Use `stream.pipeline()` rather than hand-wiring `'data'`, `'end'`, and
  `'error'` unless you genuinely need custom flow control.
- Use `spawn()` for long-running processes and streaming stdout/stderr; use
  exec-style helpers only when you intentionally want buffered command output.
- Use `Worker` for CPU-bound JavaScript that must stay in-process; use child
  processes when isolation or separate executables matter more than shared
  memory.
- Use `node:test` for focused built-in test coverage and mocking where its
  features are sufficient.

## Failure Modes
- ESM/CommonJS boundary confusion around `type`, file extensions, and package
  scope.
- Treating browser `fetch`, streams, or URL intuition as a complete model of
  Node.js runtime behavior.
- Reading or writing large files with convenience helpers when streaming is the
  right tool.
- Ignoring stream backpressure and then debugging memory or throughput problems
  at the wrong layer.
- Spawning subprocesses when `Worker` is the right primitive, or vice versa.
- Treating `process.exit()` as normal control flow instead of using
  `process.exitCode` and allowing cleanup to finish.

## High-Value Workflows

### Workflow: CLI file transform
1. Parse arguments from `process.argv`.
2. Resolve paths with `node:path`.
3. Use `node:fs/promises` for small files or `stream.pipeline()` for large ones.
4. Set `process.exitCode` on failure instead of forcing early termination.

### Workflow: Streamed child process integration
1. Launch with `spawn()`.
2. Consume stdout/stderr as streams.
3. Use `pipeline()` when piping command output into files or other transforms.
4. Treat exit code and `'error'` as separate failure channels.

### Workflow: CPU-bound work in-process
1. Move the expensive work into a worker entry point.
2. Start a `Worker`.
3. Exchange messages with `postMessage()`.
4. Terminate or reuse workers deliberately.

### Workflow: Native test coverage without Jest
1. Define suites with `describe()` / `it()` or plain `test()`.
2. Use subtests when grouping dependent scenarios.
3. Use `mock` helpers only where built-in mocking is enough.
4. Run with `node --test`.

## References
- https://nodejs.org/api/documentation.html
- https://nodejs.org/api/esm.html
- https://nodejs.org/api/modules.html
- https://nodejs.org/api/packages.html
- https://nodejs.org/api/fs.html
- https://nodejs.org/api/path.html
- https://nodejs.org/api/stream.html
- https://nodejs.org/api/process.html
- https://nodejs.org/api/child_process.html
- https://nodejs.org/api/worker_threads.html
- https://nodejs.org/api/test.html
