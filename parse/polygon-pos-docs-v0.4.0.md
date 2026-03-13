# Polygon PoS Documentation Pack

## Target
- Pack: `agents/polygon-pos/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `@maticnetwork/maticjs@3.9.6`
- Supporting anchor: `@maticnetwork/maticjs-ethers@1.1.0`
- Docs anchor: current Polygon PoS and matic.js docs at `docs.polygon.technology`

## Source Inventory
- Official Polygon docs for PoS building, matic.js setup, POS client usage, bridging, and Polygon Portal.
- `npm:@maticnetwork/maticjs@3.9.6` TypeScript declarations for `POSClient`, ERC token helpers, and exit utilities.
- `npm:@maticnetwork/maticjs-ethers@1.1.0` TypeScript declarations for ethers plugin setup.
- `agents/polygon-pos/0.3.0.md` for coverage audit only.

## Version Delta Audit
- The old pack was focused on Heimdall-v2 APIs and node/operator workflows.
- The new pack should teach ordinary Polygon PoS application and bridge work:
  - initialize `matic.js`
  - install the ethers plugin when relevant
  - configure parent and child providers
  - approve and deposit assets
  - burn on PoS to start withdrawal
  - checkpoint and exit on Ethereum
- Main stale-risk areas:
  - overfocusing on Heimdall internals instead of application-facing bridge workflows
  - flattening Ethereum and Polygon PoS into one execution environment
  - flattening burn initiation and final exit completion into one step

## Ecosystem Boundaries

### Parent And Child Networks
- Parent is Ethereum for ordinary PoS bridge flows.
- Child is Polygon PoS.
- Use explicit providers and `from` defaults for each side.

### Deposits Versus Withdrawals
- Deposits lock or escrow on the parent side and mint or release representation on Polygon PoS.
- Withdrawals start on Polygon PoS with a burn, then finalize later on Ethereum after checkpointing.

### Portal Versus matic.js
- Polygon Portal is the official UX layer.
- `matic.js` is the programmatic bridge layer.
- They represent related workflows at different abstraction levels.

### POL Migration Context
- Current docs explicitly mention the network transition from MATIC to POL for Polygon PoS gas and staking context.
- Do not let legacy MATIC naming in packages or examples erase that current docs context.

## Decision Rules
- If the task is app code, start with `matic.js`.
- If the task uses ethers already, install the ethers plugin and initialize `POSClient` with explicit parent and child providers.
- For ERC-20 deposits, approve on the parent side before depositing.
- For withdrawals, treat `withdrawStart` as the beginning of the exit workflow, not the end.
- Before final exit, check checkpoint or exit-readiness state explicitly.

## Common Confusions
- `POSClient.erc20(token, true)` refers to a parent-side token handle; `POSClient.erc20(token)` defaults to the child-side handle.
- Deposit is parent-to-child; withdrawal is child-to-parent.
- `withdrawExitFaster` is still an exit-completion step, not a burn step.
- One wallet or provider object may not be sufficient if parent and child network connectivity differ.
- The official Portal and programmatic matic.js flows solve related problems but are not the same abstraction layer.

## Failure Modes
- Wrong parent or child provider configured during `POSClient.init`.
- Deposit fails because approval was skipped on the parent token.
- Withdrawal appears stuck because checkpointing has not happened yet.
- Exit fails because the burn tx hash or exit proof context is wrong for the requested asset and log.
- Docs or examples use older MATIC naming and cause confusion about current Polygon PoS gas-token context.

## Coverage Map

### Setup
- `use`
- `Web3ClientPlugin`
- `POSClient`
- `POSClient.init`

### Deposits
- `POSClient.erc20`
- `ERC20.approve`
- `ERC20.deposit`
- `POSClient.depositEther`

### Withdrawals And Exit
- `ERC20.withdrawStart`
- `ERC20.withdrawExitFaster`
- `RootChainManager.isExitProcessed`
- `ExitUtil.isCheckPointed`

### Operational Boundary
- `Polygon Portal`

## Must-Not-Regress Insights
- Preserve the old pack’s architecture awareness as background context, but do not let Heimdall internals dominate the pack.
- Keep parent-vs-child and burn-vs-exit boundaries sharp.
- Preserve the current docs emphasis that PoS is an EVM-compatible Polygon chain while still keeping bridge semantics explicit.
