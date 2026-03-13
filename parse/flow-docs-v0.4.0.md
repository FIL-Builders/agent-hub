# Flow Documentation Pack

## Target
- Pack: `agents/flow/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `@onflow/fcl@1.21.9`
- Supporting anchor: `@onflow/sdk@1.13.7`
- Docs anchor: current Flow docs surface at `developers.flow.com`

## Source Inventory
- Official Flow docs for FCL JS, Flow app quickstart, scripts, transactions, events, accounts, and access-node behavior.
- `npm:@onflow/fcl@1.21.9` TypeScript declarations for app-facing Flow client behavior.
- `npm:@onflow/sdk@1.13.7` TypeScript declarations for lower-level interaction builders and transport.
- `agents/flow/0.3.0.md` for coverage audit only.

## Version Delta Audit
- The old pack was focused on the access-stream websocket API.
- The new pack should teach ordinary Flow application work first:
  - configure FCL
  - authenticate a user in the browser
  - run Cadence scripts
  - submit Cadence transactions
  - observe transaction status and account or block state
  - understand when to drop down to the lower-level SDK
- Main stale-risk areas:
  - overprioritizing stream subscriptions over normal request-response app work
  - importing EVM assumptions into Cadence interaction design
  - treating FCL auth and server-side execution as the same runtime model

## Ecosystem Boundaries

### FCL
- FCL is the primary app-facing library for Flow-connected web applications.
- It handles wallet discovery, user auth, scripts, transactions, tx polling, and common utilities.
- Wallet interactions are primarily browser-oriented.

### Low-Level SDK
- `@onflow/sdk` exposes lower-level interaction builders, transport, and response pipelines.
- Use it when you need more explicit control than FCL’s high-level helpers provide.

### Scripts Versus Transactions
- Scripts are read-only Cadence execution.
- Transactions mutate chain state and require authorization, proposal, payment, and status observation.

### Access-Node Streams
- Streaming still matters for event-heavy or monitoring use cases.
- It is not the primary entrypoint for ordinary app integration compared with FCL plus access-node HTTP.

## Decision Rules
- If the task is a normal Flow web app, start with FCL.
- If the task is read-only, prefer scripts and query helpers over transaction submission.
- If the task writes state, use transaction mutation and then observe status separately.
- If wallet participation is needed, keep the workflow in a browser-capable FCL path.
- If the task needs custom interaction building or transport control, drop down to `@onflow/sdk`.

## Common Confusions
- `fcl.query()` is for scripts, not transactions.
- `fcl.mutate()` submits a transaction and returns a tx ID, not final success.
- `fcl.currentUser` and `fcl.authenticate()` are browser-oriented wallet flows.
- Cadence arguments use Flow’s typed argument model, not EVM ABI conventions.
- Access-node streaming is a specialized tool, not the default integration surface for most apps.

## Failure Modes
- FCL configured with the wrong access-node or discovery endpoints for the network.
- Transaction submitted, but application treats tx ID as final success without polling status.
- Cadence argument types do not match script or transaction parameter types.
- Browser-only auth flow attempted in a server-only environment.
- Lower-level SDK used when FCL would have handled wallet integration safely and more simply.

## Coverage Map

### FCL Setup And Auth
- `config`
- `currentUser`
- `authenticate`

### Read And Write
- `query`
- `mutate`
- `tx`

### Common Reads
- `account`
- `block`
- `getAccount`
- `getBlock`
- `subscribeEvents`

### Low-Level SDK Builders
- `build`
- `send`
- `decode`
- `transaction`
- `script`
- `args`
- `arg`

## Must-Not-Regress Insights
- Preserve the old pack’s best stream guidance as a boundary, especially for event subscription and status feeds.
- Do not regress on explicit network and runtime configuration requirements.
- Keep the difference between submission and observed final status very clear.
- Keep Cadence’s distinct mental model explicit instead of mapping it to Solidity habits.
