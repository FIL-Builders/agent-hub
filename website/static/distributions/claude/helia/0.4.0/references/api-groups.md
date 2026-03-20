# Helia API Groups

### Core Node Setup
**Exports**
- createHelia
- HeliaInit
- Helia
- heliaDefaults
- libp2pDefaults

Core primitives for constructing a Helia node and understanding what that node exposes.

#### createHelia
**Kind**
function

**Summary**
Creates and returns a Helia node, optionally merging caller-supplied init values with the default node configuration.

**Definition**
Language: typescript
Source: npm:helia@6.0.21:package/dist/src/index.d.ts

```ts
export declare function createHelia<T extends Libp2p>(
  init: Partial<HeliaInit<T>>
): Promise<Helia<T>>;
export declare function createHelia(
  init?: Partial<HeliaInit<Libp2p<DefaultLibp2pServices>>>
): Promise<Helia<Libp2p<DefaultLibp2pServices>>>;
```

**Guidance**
- Use this as the first step for any Helia-based workflow.
- Pass only the overrides you actually need; Helia will fill in the rest from its defaults.
- When an app is primarily doing file workflows, create the node and then immediately construct a UnixFS facade with `unixfs(helia)`.

**Example**
Language: typescript
Description: Create a node and hand it to UnixFS for ordinary file work.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);
```

#### HeliaInit
**Kind**
interface

**Summary**
Describes the initialization shape used to create a Helia node, including libp2p configuration and storage-related components.

**Definition**
Language: typescript
Source: npm:helia@6.0.21:package/dist/src/index.d.ts

```ts
export interface HeliaInit<T extends Libp2p = Libp2p> {
  libp2p?: T | Libp2pOptions;
  blockstore?: Blockstore;
  datastore?: Datastore;
  blockBrokers?: BlockBroker[];
  routers?: Routing;
  pins?: Pins;
  codecs?: CodecLoader;
  hashers?: HasherLoader;
  dagWalkers?: DAGWalker[];
}
```

**Guidance**
- Treat this as the customization surface for environment-specific storage, routing, and transport choices.
- Do not assume browser and server runtimes should use the same datastore or blockstore setup.
- If you already have a custom libp2p node, pass it here; otherwise let Helia compose one from defaults.

**Example**
Language: typescript
Description: Supply custom stores while leaving the rest of the node setup on defaults.

```ts
import { createHelia } from "helia";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";

const helia = await createHelia({
  blockstore: new MemoryBlockstore(),
  datastore: new MemoryDatastore(),
});
```

#### Helia
**Kind**
interface

**Summary**
Represents the API exposed by a running Helia node, including libp2p, storage, and pinning capabilities.

**Definition**
Language: typescript
Source: npm:helia@6.0.21:package/dist/src/index.d.ts

```ts
export interface Helia<T extends Libp2p = Libp2p> {
  libp2p: T;
  blockstore: Blocks;
  datastore: Datastore;
  pins: Pins;
  start(): Promise<void>;
  stop(): Promise<void>;
}
```

**Guidance**
- Keep a Helia node alive for the duration of the work that depends on its blockstore, routing state, and libp2p services.
- Reach for UnixFS or other companion modules for higher-level workflows instead of reimplementing them directly against the blockstore.
- Use `stop()` deliberately in scripts, CLIs, and tests so the process can shut down cleanly.

**Example**
Language: typescript
Description: Start work with a node and stop it cleanly when finished.

```ts
import { createHelia } from "helia";

const helia = await createHelia();

try {
  console.log(helia.libp2p.peerId.toString());
} finally {
  await helia.stop();
}
```

#### heliaDefaults
**Kind**
function

**Summary**
Builds the default Helia init object, resolving the final configuration Helia would normally use to create a node.

**Definition**
Language: typescript
Source: npm:helia@6.0.21:package/dist/src/index.d.ts

```ts
export declare function heliaDefaults<T extends Libp2p>(
  init?: Partial<HeliaInit<T>>
): Promise<Omit<HeliaInit<T>, "libp2p"> & { libp2p: T }>;
```

**Guidance**
- Use this when you need to inspect or refine the default node config before instantiating a node.
- Prefer it over duplicating internal defaults by hand.
- Do not teach routine application code to start with defaults inspection unless the task is explicitly about configuration tuning.

**Example**
Language: typescript
Description: Inspect and tweak the computed defaults before node creation.

```ts
import { createHelia, heliaDefaults } from "helia";

const defaults = await heliaDefaults();
defaults.routers = [];

const helia = await createHelia(defaults);
```

#### libp2pDefaults
**Kind**
function

**Summary**
Returns the default libp2p configuration Helia uses for its out-of-the-box node setup.

**Definition**
Language: typescript
Source: npm:helia@6.0.21:package/dist/src/index.d.ts

```ts
export declare function libp2pDefaults(
  options?: Libp2pDefaultsOptions
): Libp2pOptions<DefaultLibp2pServices> &
  Required<Pick<Libp2pOptions<DefaultLibp2pServices>, "services">>;
```

**Guidance**
- Use this when embedding Helia into an existing libp2p customization flow.
- Be careful when removing services or routers; retrieval failures can become routing failures rather than file-operation failures.
- If you are not explicitly tuning the libp2p layer, let `createHelia()` own it.

**Example**
Language: typescript
Description: Create a custom libp2p config starting from the Helia defaults.

```ts
import { libp2pDefaults } from "helia";

const config = libp2pDefaults();
config.services.ping = config.services.ping;
```

### UnixFS Content Workflows
**Exports**
- unixfs
- addBytes
- addAll
- cat
- stat

The ordinary file and directory surface for Helia applications that need content-addressed add and retrieval behavior.

#### unixfs
**Kind**
function

**Summary**
Creates a UnixFS facade over a Helia-compatible blockstore so file and directory DAG operations can be performed.

**Definition**
Language: typescript
Source: npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts

```ts
export declare function unixfs(helia: {
  blockstore: Pick<Blockstore, "get" | "put" | "has">;
}): UnixFS;
```

**Guidance**
- Construct this immediately after creating the Helia node when your workload is file-oriented.
- Treat the returned `UnixFS` instance as an application-level helper over Helia storage and retrieval, not as a replacement for the underlying node.
- Keep lower-level routing and storage debugging separate from UnixFS API usage.

**Example**
Language: typescript
Description: Build a UnixFS instance from an existing node.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);
```

#### addBytes
**Kind**
function

**Summary**
Adds one in-memory byte array to UnixFS and returns a CID that resolves directly to that content.

**Definition**
Language: typescript
Source: npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts

```ts
addBytes(bytes: Uint8Array, options?: Partial<AddFileOptions>): Promise<CID>;
```

**Guidance**
- Use this for simple file content when filename and metadata do not matter.
- Prefer `addFile` or `addAll` when you need paths, directories, or file metadata preserved.
- The returned CID identifies content, not a filesystem path; retrieval still depends on local or routable blocks.

**Example**
Language: typescript
Description: Add a byte array and print the resulting CID.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);

const cid = await fs.addBytes(new TextEncoder().encode("hello helia"));
console.log(cid.toString());
```

#### addAll
**Kind**
function

**Summary**
Adds a stream of files or directories to UnixFS and yields import results as entries are created.

**Definition**
Language: typescript
Source: npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts

```ts
addAll(
  source: ImportCandidateStream,
  options?: Partial<AddOptions>
): AsyncIterable<ImportResult>;
```

**Guidance**
- Use this for directory trees, path-preserving imports, or batch adds.
- Consume the async iterable; import progress and the final root entry arrive through iteration.
- In browser or Node source-integration flows, use environment-appropriate input sources instead of assuming the same file APIs exist everywhere.

**Example**
Language: typescript
Description: Add two named files and inspect the resulting entries.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);

for await (const entry of fs.addAll([
  { path: "hello.txt", content: new TextEncoder().encode("hello") },
  { path: "nested/goodbye.txt", content: new TextEncoder().encode("goodbye") },
])) {
  console.log(entry.path, entry.cid.toString());
}
```

#### cat
**Kind**
function

**Summary**
Streams file bytes from a UnixFS DAG rooted at the provided CID, optionally constrained by path, offset, length, or offline retrieval mode.

**Definition**
Language: typescript
Source: npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts

```ts
cat(cid: CID, options?: Partial<CatOptions>): AsyncIterable<Uint8Array>;
```

**Guidance**
- Treat this as a streaming retrieval API; consume the async iterable incrementally for large files.
- `offline: true` forbids network retrieval and will fail if blocks are not already local.
- When a CID points at a directory DAG, use `path` to target a file entry inside that DAG.

**Example**
Language: typescript
Description: Retrieve previously added bytes with a timeout.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);
const cid = await fs.addBytes(new TextEncoder().encode("hello"));

const chunks: Uint8Array[] = [];
for await (const chunk of fs.cat(cid, { signal: AbortSignal.timeout(5_000) })) {
  chunks.push(chunk);
}
```

#### stat
**Kind**
function

**Summary**
Returns UnixFS metadata and size information for a file or directory DAG, with an extended mode that can traverse the whole DAG.

**Definition**
Language: typescript
Source: npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts

```ts
stat(cid: CID, options?: StatOptions): Promise<FileStats | DirectoryStats | RawStats>;
stat(
  cid: CID,
  options?: ExtendedStatOptions
): Promise<ExtendedFileStats | ExtendedDirectoryStats | ExtendedRawStats>;
```

**Guidance**
- Use plain `stat` for quick metadata and size checks.
- Use `extended: true` only when you truly need DAG-wide measurements, because it may require extra disk and network work.
- For directory roots, remember that simple `size` does not represent full recursive DAG size.

**Example**
Language: typescript
Description: Inspect a file CID after adding it.

```ts
import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
const fs = unixfs(helia);
const cid = await fs.addBytes(new TextEncoder().encode("stats"));

const info = await fs.stat(cid);
console.log(info.type, info.size);
```

### Routing And Retrieval Boundaries
**Exports**
- ProviderOptions
- InsufficientProvidersError
- NoRoutersAvailableError

Lower-level retrieval and routing primitives that explain why some CID operations fail even when the UnixFS call site is otherwise correct.

#### ProviderOptions
**Kind**
interface

**Summary**
Supplies an optional list of peers known to host the root block of a DAG so retrieval can start from concrete providers before doing routing discovery.

**Definition**
Language: typescript
Source: npm:@helia/interface@5.4.0:package/dist/src/blocks.d.ts

```ts
export interface ProviderOptions {
  providers?: Array<PeerId | Multiaddr | Multiaddr[]>;
}
```

**Guidance**
- Use provider hints only when you already know peers that can serve the content.
- If the supplied peers cannot provide the root or child blocks, Helia may still fall back to routing queries unless the operation is offline.
- Do not confuse provider hints with persistence; they influence retrieval path selection, not whether the data exists locally.

**Example**
Language: typescript
Description: Supply a known provider when reading a CID.

```ts
for await (const chunk of fs.cat(cid, {
  providers: [knownPeerId],
})) {
  console.log(chunk);
}
```

#### InsufficientProvidersError
**Kind**
class

**Summary**
Signals that Helia could not discover or maintain enough providers for the requested retrieval flow.

**Definition**
Language: typescript
Source: npm:@helia/interface@5.4.0:package/dist/src/errors.d.ts

```ts
export declare class InsufficientProvidersError extends Error {
  static name: string;
  constructor(message?: string);
}
```

**Guidance**
- Treat this as a routing or provider-availability failure, not as proof that the CID is malformed.
- Verify that routers are configured, peers are reachable, and the content is actually announced by providers.
- For deterministic offline or local-only workflows, fail earlier by checking that required blocks are present locally instead of assuming network retrieval will succeed.

**Example**
Language: typescript
Description: Handle provider-discovery failure separately from ordinary API misuse.

```ts
try {
  for await (const chunk of fs.cat(cid)) {
    console.log(chunk);
  }
} catch (err) {
  if (err instanceof InsufficientProvidersError) {
    console.error("Not enough providers were found for this CID");
  } else {
    throw err;
  }
}
```

#### NoRoutersAvailableError
**Kind**
class

**Summary**
Signals that the node has no active routing layer available for operations that require router participation.

**Definition**
Language: typescript
Source: npm:@helia/interface@5.4.0:package/dist/src/errors.d.ts

```ts
export declare class NoRoutersAvailableError extends Error {
  static name: string;
  constructor(message?: string);
}
```

**Guidance**
- Expect this after aggressive libp2p or router customization that removed the routing surface Helia depends on.
- Fix the routing configuration rather than rewriting UnixFS code that was otherwise correct.
- Keep this separate from offline mode; offline mode is a deliberate retrieval constraint, while this error points to missing router capability.

**Example**
Language: typescript
Description: Surface a routing-stack misconfiguration clearly.

```ts
try {
  await createHelia({
    routers: [],
  });
} catch (err) {
  if (err instanceof NoRoutersAvailableError) {
    console.error("The node has no routers configured");
  } else {
    throw err;
  }
}
```
