# Monad Documentation Pack

## Target
- Pack: `agents/monad/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current Monad docs at `https://docs.monad.xyz/`

## Source Inventory
- Current Monad docs at `https://docs.monad.xyz/`
- `agents/monad/0.3.0.md` for coverage audit only

## Decision Rules
- Treat Monad as EVM-compatible but operationally distinct around gas, finality, and data access.
- Use batching or Multicall for high-volume reads.
- Manage nonces locally for high-frequency transaction submission.
- Use indexers for historical state requirements.

## Common Confusions
- Developers do not need to rewrite contracts for parallel execution.
- Gas-limit billing is materially different from Ethereum gas-used intuition.
- Historical state availability differs from ordinary EVM full-node assumptions.

## Failure Modes
- Applications rely on `eth_getTransactionCount` for rapid burst submission and reuse nonces.
- Historical reads target old state that a Monad full node no longer serves.
- UIs assume Ethereum-like confirmation timing and misreport state to users.

## Coverage Map

### Network
- `monad.testnet`
- `monad.system-contracts`

### Execution Model
- `monad.parallel-execution`
- `monad.historical-state`
- `monad.finality`

## Must-Not-Regress Insights
- Preserve gas-limit billing guidance.
- Preserve local nonce management guidance.
- Preserve indexer guidance for historical state.
