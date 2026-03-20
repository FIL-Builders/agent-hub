# Helia Overview

## Snapshot

- Spec name: helia
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: helia^6.0.21 + @helia/unixfs^7.0.4
- Primary language: typescript
- Homepage: https://github.com/ipfs/helia
- Source set: npm:helia@6.0.21 declarations, npm:@helia/unixfs@7.0.4 declarations, npm:@helia/interface@5.4.0 declarations, official Helia TypeDoc pages, parse/helia.out for cross-checking, parse/helia-docs-v0.4.0.md as the intermediate documentation pack, and agents/helia/0.2.0.md for coverage audit only

**Tags**
- helia
- ipfs
- unixfs
- libp2p
- content-addressing
- typescript

## Purpose

This pack teaches an agent to use Helia 6 and `@helia/unixfs` 7 for node creation, UnixFS add and retrieval flows, routing-aware CID access, and environment-sensitive persistence decisions while keeping core Helia, UnixFS, and lower-level retrieval behavior distinct.

## Guiding Principles

- Treat `createHelia()` plus `unixfs(helia)` as the ordinary application path for file workflows.
- Keep core node construction separate from UnixFS file operations and separate both from lower-level routing behavior.
- Treat browser nodes as ephemeral by default unless a deliberate persistence strategy is configured.
- Use `offline: true` only when retrieval must be local-only; it changes semantics, not just performance.
- Use provider hints only when you already know peers that can serve the target DAG.
- Customize defaults through `heliaDefaults` or `libp2pDefaults` when needed, but do not overfocus on defaults inspection as the main workflow.

## Boundary Notes

- Contract definitions come from `npm:helia@6.0.21:package/dist/src/index.d.ts`, `npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts`, and `npm:@helia/interface@5.4.0:package/dist/src/{blocks,errors}.d.ts`.
- Guidance is grounded in official Helia TypeDoc pages, especially the `createHelia` function docs and the Helia module index.
- `agents/helia/0.2.0.md` was used only to preserve still-valid high-value guidance around `createHelia`, defaults, and provider failure troubleshooting; it was not used as a contract source.
- Coverage is intentionally centered on ordinary content-addressed app work: create a node, use UnixFS, retrieve by CID, and debug routing or runtime-boundary failures.
- This pack keeps the strongest runtime boundary explicit: UnixFS operations can trigger network retrieval and routing behavior, but those failures should not be misdiagnosed as generic file-API misuse.

## FAQ

### When should I use `addBytes` instead of `addAll`?
Use `addBytes` when you only care about raw content bytes and want a single content CID. Use `addAll` when you need to preserve paths, import multiple entries, or build directory DAGs.

### Does a valid CID mean `cat` will always work?
No. The CID may be valid while the corresponding blocks are unavailable locally and not retrievable from current providers or routers.

### Can I treat UnixFS helpers as a full explanation of Helia behavior?
No. UnixFS covers application-level file and directory operations, but persistence, routing, block availability, and libp2p configuration still live at lower layers.

## External Resources

- Helia module docs: https://ipfs.github.io/helia/modules/helia.html
- `createHelia` API docs: https://ipfs.github.io/helia/functions/helia.createHelia.html
- `@helia/unixfs` API docs: https://ipfs.github.io/helia/modules/_helia_unixfs.html
- Helia examples: https://github.com/ipfs-examples/helia-101
