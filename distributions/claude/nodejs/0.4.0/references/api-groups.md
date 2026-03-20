# Node.js API Groups

### Modules And Package Boundaries
**Exports**
- import()
- import.meta.resolve
- createRequire
- package.json "type"

Core primitives and rules for modern Node.js module loading.

#### import()
**Kind**
other

**Summary**
Dynamic ESM import expression that loads a module asynchronously.

**Definition**
Language: javascript
Source: https://nodejs.org/api/esm.html

```js
const moduleNamespace = await import(specifier);
```

**Guidance**
- Use it when the dependency should be resolved lazily or conditionally.
- It works in both CommonJS and ESM contexts, but the surrounding module rules
  still matter.
- Do not use it to hide a broken package boundary decision.

**Example**
Language: javascript
Description: Load a built-in module lazily from a CLI path.

```js
const { readFile } = await import("node:fs/promises");
const text = await readFile("input.txt", "utf8");
```

#### import.meta.resolve
**Kind**
other

**Summary**
Resolve a module specifier relative to the current ESM module.

**Definition**
Language: javascript
Source: https://nodejs.org/api/esm.html

```js
const resolved = import.meta.resolve(specifier);
```

**Guidance**
- Use this in ESM when you need the fully resolved URL-like location of a
  specifier.
- Keep it in ESM code; do not treat it as a generic CommonJS replacement.
- Resolution still depends on package scope, exports, and the active module
  rules.

**Example**
Language: javascript
Description: Resolve a relative asset path from an ESM entry point.

```js
const assetUrl = import.meta.resolve("./fixtures/template.txt");
```

#### createRequire
**Kind**
function

**Summary**
Create a CommonJS `require` function from a specific module location.

**Definition**
Language: javascript
Source: https://nodejs.org/api/module.html

```js
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
```

**Guidance**
- Use this when ESM code must load a CommonJS-only dependency or JSON through a
  CommonJS path.
- Prefer this over ad hoc interop hacks.
- If you need it everywhere, revisit whether the package boundary should be ESM
  or CommonJS in the first place.

**Example**
Language: javascript
Description: Load a CommonJS dependency from an ESM module.

```js
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const kleur = require("kleur");
```

#### package.json "type"
**Kind**
other

**Summary**
Package-level setting that influences whether `.js` files are interpreted as ESM or CommonJS.

**Definition**
Language: json
Source: https://nodejs.org/api/packages.html

```json
{
  "type": "module"
}
```

**Guidance**
- Decide this explicitly for application packages.
- Keep file extensions and examples consistent with the chosen module system.
- Do not mix incompatible ESM and CommonJS guidance in the same package without
  explaining the boundary.

**Example**
Language: json
Description: Mark a package as ESM-first.

```json
{
  "name": "my-cli",
  "type": "module"
}
```

### Filesystem And Paths
**Exports**
- readFile
- writeFile
- watch
- join
- resolve

High-leverage primitives for local file IO and path handling.

#### readFile
**Kind**
function

**Summary**
Read an entire file into memory through the `node:fs/promises` API.

**Definition**
Language: javascript
Source: https://nodejs.org/api/fs.html

```js
const data = await readFile(path, options);
```

**Guidance**
- Use this for straightforward small-to-medium file reads.
- Switch to streaming when file size or memory pressure matters.
- Be explicit about encoding when you want text instead of a `Buffer`.

**Example**
Language: javascript
Description: Read a JSON file as UTF-8 text.

```js
import { readFile } from "node:fs/promises";

const json = await readFile("./config.json", "utf8");
```

#### writeFile
**Kind**
function

**Summary**
Write a complete payload to a file through the `node:fs/promises` API.

**Definition**
Language: javascript
Source: https://nodejs.org/api/fs.html

```js
await writeFile(file, data, options);
```

**Guidance**
- Use this for simple whole-file writes.
- Decide whether truncation, replacement, and encoding behavior are acceptable
  for the task.
- Avoid it for large streaming outputs where backpressure matters.

**Example**
Language: javascript
Description: Write a generated report to disk.

```js
import { writeFile } from "node:fs/promises";

await writeFile("./report.txt", "done\n", "utf8");
```

#### watch
**Kind**
function

**Summary**
Watch a file or directory for changes through filesystem notifications.

**Definition**
Language: javascript
Source: https://nodejs.org/api/fs.html

```js
const watcher = watch(filename, options, listener);
```

**Guidance**
- Use it when you need local file change notifications.
- Treat watcher behavior as platform-sensitive; event timing and granularity can
  differ across operating systems.
- Do not build correctness-critical synchronization logic on watcher events
  alone.

**Example**
Language: javascript
Description: Watch a config file and log changes.

```js
import { watch } from "node:fs";

watch("./config.json", (eventType, filename) => {
  console.log(eventType, filename);
});
```

#### join
**Kind**
function

**Summary**
Join path segments using the current platform's path separator rules.

**Definition**
Language: javascript
Source: https://nodejs.org/api/path.html

```js
const fullPath = path.join(...segments);
```

**Guidance**
- Use this for path assembly, not URL assembly.
- Prefer `path.resolve()` when you need an absolute path from a base context.
- Keep path logic separate from URL logic and module specifier logic.

**Example**
Language: javascript
Description: Build a project-local file path.

```js
import path from "node:path";

const file = path.join(process.cwd(), "logs", "app.log");
```

#### resolve
**Kind**
function

**Summary**
Resolve a sequence of path segments into an absolute path.

**Definition**
Language: javascript
Source: https://nodejs.org/api/path.html

```js
const absolutePath = path.resolve(...segments);
```

**Guidance**
- Use this when downstream code expects an absolute path.
- Remember it resolves from right to left until an absolute segment is found.
- Do not confuse it with module resolution or URL resolution.

**Example**
Language: javascript
Description: Resolve an input path against the current working directory.

```js
import path from "node:path";

const input = path.resolve(process.cwd(), process.argv[2]);
```

### Streams And Subprocesses
**Exports**
- pipeline
- Readable.from
- spawn

Core primitives for throughput-oriented IO and process integration.

#### pipeline
**Kind**
function

**Summary**
Compose streams with correct backpressure and error propagation.

**Definition**
Language: javascript
Source: https://nodejs.org/api/stream.html

```js
await pipeline(source, ...transforms, destination);
```

**Guidance**
- Prefer this over manual `'data'` / `'end'` / `'error'` wiring for ordinary
  stream chains.
- Use the promises API when you want `await`-friendly composition.
- Reach for it early when moving file, network, or process data through a
  pipeline.

**Example**
Language: javascript
Description: Copy a file through a transform pipeline.

```js
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("./input.txt"),
  createWriteStream("./output.txt"),
);
```

#### Readable.from
**Kind**
function

**Summary**
Create a readable stream from an iterable or async iterable.

**Definition**
Language: javascript
Source: https://nodejs.org/api/stream.html

```js
const stream = Readable.from(iterable, options);
```

**Guidance**
- Use this to bridge iterables and stream-based APIs.
- Remember that object mode defaults differ from plain byte streams.
- Keep error behavior in mind when the iterable yields promises.

**Example**
Language: javascript
Description: Turn an async generator into a readable stream.

```js
import { Readable } from "node:stream";

async function* lines() {
  yield "a\n";
  yield "b\n";
}

const stream = Readable.from(lines());
```

#### spawn
**Kind**
function

**Summary**
Launch a subprocess with streaming stdin, stdout, and stderr.

**Definition**
Language: javascript
Source: https://nodejs.org/api/child_process.html

```js
const child = spawn(command, args, options);
```

**Guidance**
- Prefer this when command output should stream or when the child may run for a
  while.
- Treat exit code and `'error'` as separate failure channels.
- Avoid buffering huge command output when stream consumption is the right model.

**Example**
Language: javascript
Description: Run a git command and stream output.

```js
import { spawn } from "node:child_process";

const child = spawn("git", ["status"], { stdio: "inherit" });
child.on("close", (code) => {
  console.log("exit", code);
});
```

### Process And Runtime Control
**Exports**
- process.argv
- process.env
- process.exitCode

Runtime state and control primitives for CLIs and servers.

#### process.argv
**Kind**
other

**Summary**
Array of command-line arguments passed to the current Node.js process.

**Definition**
Language: javascript
Source: https://nodejs.org/api/process.html

```js
const args = process.argv;
```

**Guidance**
- Use it for simple CLI parsing or as the raw input to a dedicated parser.
- Remember the first entries are the Node executable and script path.
- Normalize and validate arguments before they flow into file or process APIs.

**Example**
Language: javascript
Description: Read the first user-supplied file argument.

```js
const inputPath = process.argv[2];
```

#### process.env
**Kind**
other

**Summary**
Environment variable map for the current process.

**Definition**
Language: javascript
Source: https://nodejs.org/api/process.html

```js
const env = process.env;
```

**Guidance**
- Treat all values as strings unless you parse them explicitly.
- Validate required environment variables near startup.
- Avoid spreading environment reads across the codebase without a config boundary.

**Example**
Language: javascript
Description: Fail fast when a required variable is missing.

```js
const token = process.env.API_TOKEN;
if (!token) process.exitCode = 1;
```

#### process.exitCode
**Kind**
other

**Summary**
Exit status the process should use when it ends naturally.

**Definition**
Language: javascript
Source: https://nodejs.org/api/process.html

```js
process.exitCode = 1;
```

**Guidance**
- Prefer setting this over calling `process.exit()` in ordinary error paths.
- This allows pending writes, cleanup, and promise chains to finish naturally.
- Reserve forced exit for cases where immediate termination is truly required.

**Example**
Language: javascript
Description: Signal failure without forcing abrupt termination.

```js
try {
  throw new Error("bad input");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
```

### Workers And Testing
**Exports**
- Worker
- parentPort
- test
- describe

Core concurrency and built-in test-runner primitives.

#### Worker
**Kind**
class

**Summary**
Run JavaScript in a separate thread within the same Node.js process.

**Definition**
Language: javascript
Source: https://nodejs.org/api/worker_threads.html

```js
const worker = new Worker(filename, options);
```

**Guidance**
- Use workers for CPU-bound JavaScript that should not block the main event loop.
- Do not confuse workers with child processes; process isolation and resource
  boundaries are different.
- Plan message passing and lifecycle management explicitly.

**Example**
Language: javascript
Description: Start a worker from the main thread.

```js
import { Worker } from "node:worker_threads";

const worker = new Worker(new URL("./worker.js", import.meta.url));
worker.on("message", (value) => console.log(value));
```

#### parentPort
**Kind**
other

**Summary**
MessagePort-like handle for communication between a worker thread and its parent.

**Definition**
Language: javascript
Source: https://nodejs.org/api/worker_threads.html

```js
parentPort?.postMessage(value);
```

**Guidance**
- Use it inside a worker to send structured messages back to the parent.
- Treat message protocol design as part of the worker contract.
- Guard for null when the code might run outside a worker context.

**Example**
Language: javascript
Description: Send a result from a worker back to the parent.

```js
import { parentPort } from "node:worker_threads";

parentPort?.postMessage({ ok: true });
```

#### test
**Kind**
function

**Summary**
Define a top-level test case in the built-in Node.js test runner.

**Definition**
Language: javascript
Source: https://nodejs.org/api/test.html

```js
test(name, options, fn);
```

**Guidance**
- Use this for focused built-in test coverage without reaching for an external
  framework first.
- Support async tests directly with async functions.
- Keep subtests and concurrency choices deliberate so failures remain readable.

**Example**
Language: javascript
Description: Define a simple async unit test.

```js
import test from "node:test";
import assert from "node:assert/strict";

test("adds numbers", () => {
  assert.equal(1 + 1, 2);
});
```

#### describe
**Kind**
function

**Summary**
Group related tests with a suite-like structure in the built-in test runner.

**Definition**
Language: javascript
Source: https://nodejs.org/api/test.html

```js
describe(name, options, fn);
```

**Guidance**
- Use it when grouped test structure improves readability.
- Remember it is an alias-style helper within the same built-in runner model,
  not a Jest compatibility layer.
- Keep suite nesting reasonable so output stays readable.

**Example**
Language: javascript
Description: Group related tests under one suite.

```js
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("math", () => {
  it("adds", () => {
    assert.equal(2 + 2, 4);
  });
});
```
