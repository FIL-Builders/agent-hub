# Helia Documentation Pack

## Snapshot
- Spec name: helia-docs
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: helia^6.0.21 + @helia/unixfs^7.0.4
- Primary language: typescript
- Homepage: https://github.com/ipfs/helia
- Source set: npm:helia@6.0.21 declarations, npm:@helia/unixfs@7.0.4 declarations, npm:@helia/interface@5.4.0 declarations, official Helia TypeDoc pages, parse/helia.out, and agents/helia/0.2.0.md for coverage audit only

**Tags**
- helia
- ipfs
- unixfs
- content-addressing
- libp2p
- typescript

## Purpose
This documentation pack extracts the current Helia and `@helia/unixfs` surfaces needed to generate an agent pack that can initialize nodes, add and retrieve UnixFS content, reason about routing failures, and keep runtime and persistence boundaries explicit.

## Source Inventory By Role
- Contract source for core node creation: `npm:helia@6.0.21:package/dist/src/index.d.ts`
- Contract source for UnixFS workflows: `npm:@helia/unixfs@7.0.4:package/dist/src/index.d.ts`
- Contract source for provider and retrieval errors: `npm:@helia/interface@5.4.0:package/dist/src/blocks.d.ts` and `npm:@helia/interface@5.4.0:package/dist/src/errors.d.ts`
- Guidance source for ordinary usage: `https://ipfs.github.io/helia/functions/helia.createHelia.html`
- Guidance source for broad surface discovery: `https://ipfs.github.io/helia/modules/helia.html`
- Coverage audit only: `agents/helia/0.2.0.md`

## Version Delta Audit
- Prior pack target: Helia `^5.5.0`
- Current target: `helia^6.0.21 + @helia/unixfs^7.0.4`
- Delta type: major-version generation refresh plus broader workflow coverage
- Older mental model at risk: Helia as a narrow `createHelia` plus defaults/constants reference
- Current replacement: Helia as a node-construction surface paired with UnixFS for normal content workflows and explicit routing/error boundaries
- Compatibility note: constants and low-level routing details still exist, but they are no longer the most important first-pass teaching surface for ordinary application work

## Ecosystem Boundary Audit
- Core package surface:
  - `createHelia`
  - `Helia`
  - `HeliaInit`
  - `heliaDefaults`
  - `libp2pDefaults`
- First-party companion surface:
  - `@helia/unixfs`
  - `unixfs`
  - UnixFS methods such as `addBytes`, `addAll`, `cat`, `stat`
- Lower-level retrieval and routing support:
  - `ProviderOptions`
  - provider session behavior
  - routing-related errors from `@helia/interface`
- Out of scope for first-class coverage:
  - exhaustive libp2p service tuning
  - every codec/hash error type
  - generic IPFS gateway usage as a substitute for Helia node semantics

## Decision Rules
- Use `createHelia()` to create the node, then hand that node to `unixfs(helia)` for ordinary file and directory workflows.
- Use `addBytes` for raw file content when path and metadata do not matter; use `addAll` or `addDirectory` when preserving paths or building directory DAGs matters.
- Treat `cat`, `ls`, and `stat` as UnixFS DAG operations that may consult the network unless `offline: true` is set.
- Use `ProviderOptions.providers` only when you already know peers that can serve the root DAG; otherwise let routing discover providers.
- Inspect `heliaDefaults` and `libp2pDefaults` when you need to customize a node, but do not teach defaults inspection as the primary daily workflow.

## Workflow Preconditions
- A Helia node must exist before UnixFS helpers can be created.
- Retrieval from a CID only succeeds if the required blocks are available locally or retrievable from the network.
- Browser and server runtimes need different persistence assumptions; a default browser node should be treated as ephemeral unless a deliberate storage strategy is supplied.
- `offline: true` is a hard retrieval constraint, not a performance hint.

## Common Confusions
- Core Helia node creation is not the same API surface as UnixFS file operations.
- A CID being valid does not imply the data is locally available.
- Routing/provider failures are not the same thing as malformed UnixFS usage.
- Generic IPFS intuition about gateways or pinning does not replace Helia-specific node, datastore, and blockstore behavior.

## Failure Modes
- `NoRoutersAvailableError` indicates a routing stack problem, usually from custom libp2p configuration that removed usable routers.
- `InsufficientProvidersError` indicates provider discovery or availability failure during retrieval, not necessarily a bad CID.
- `offline: true` can turn a partial local-data situation into a deterministic retrieval failure.
- Browser reloads can make previously added content unreachable when the node used ephemeral stores.

## Must-Not-Regress Insights
- Prefer `createHelia -> unixfs` for ordinary file operations.
- Keep browser nodes ephemeral by default and make persistence a deliberate environment-specific choice.
- Preserve the distinction between defaults inspection and real application workflows.
- Preserve routing/provider troubleshooting guidance because retrieval failures are a common source of bad agent answers.

## Draft Coverage Plan
- Core Node Setup:
  - `createHelia`
  - `HeliaInit`
  - `Helia`
  - `heliaDefaults`
  - `libp2pDefaults`
- UnixFS Content Workflows:
  - `unixfs`
  - `addBytes`
  - `addAll`
  - `cat`
  - `stat`
- Routing And Retrieval Boundaries:
  - `ProviderOptions`
  - `InsufficientProvidersError`
  - `NoRoutersAvailableError`

## References
- Helia module docs: https://ipfs.github.io/helia/modules/helia.html
- `createHelia` docs: https://ipfs.github.io/helia/functions/helia.createHelia.html
- `heliaDefaults` docs: https://ipfs.github.io/helia/functions/helia.heliaDefaults.html
- `libp2pDefaults` docs: https://ipfs.github.io/helia/functions/helia.libp2pDefaults.html
- `@helia/unixfs` API docs: https://ipfs.github.io/helia/modules/_helia_unixfs.html
