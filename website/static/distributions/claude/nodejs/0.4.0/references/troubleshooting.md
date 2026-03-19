# Node.js Troubleshooting

### ESM / CommonJS boundary error
**Cause**
The package boundary, file extension, or import style does not match the
runtime's module expectations.

**Fix**
- Check `package.json` `"type"`, file extensions, and the import style being used.
- Do not assume `.js` means the same thing in every package scope.
- Use `createRequire()` when ESM must consume CommonJS.

### File IO is too memory-heavy
**Cause**
Whole-file helpers are being used where payload size or throughput calls for
streaming.

**Fix**
- Switch from `readFile()` / `writeFile()` to streaming APIs.
- Use `pipeline()` instead of manual event wiring.

### Stream chain hangs or leaks errors
**Cause**
The stream chain is being wired manually or consumed through incompatible API
styles, so backpressure and error handling are incomplete.

**Fix**
- Prefer `pipeline()` so backpressure and error propagation are handled in one place.
- Avoid mixing flowing mode, async iteration, and manual event consumption on the same stream without a reason.

### Worker does not improve throughput
**Cause**
The workload is not actually CPU-bound, or the overhead and coordination model
do not fit a worker-thread solution.

**Fix**
- Check whether the task is actually CPU-bound.
- Prefer subprocesses when isolation matters more than shared memory or in-process messaging.
