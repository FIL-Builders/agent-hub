# Node.js Workflows

### CLI File Transform
1. Parse inputs from `process.argv`.
2. Resolve paths with `path.resolve()`.
3. Use `readFile()` / `writeFile()` for small payloads or `pipeline()` for large ones.
4. Set `process.exitCode` on failure.

### Stream A Subprocess
1. Use `spawn()` with explicit stdio strategy.
2. Pipe or consume stdout/stderr as streams.
3. Use `pipeline()` when connecting child output to another sink.
4. Handle `'close'` and `'error'` separately.

### CPU-Bound Work In Process
1. Put heavy compute into a worker module.
2. Start a `Worker`.
3. Exchange structured messages through `postMessage()` / `parentPort`.
4. Tear down or reuse workers deliberately.
