# Monad Protocol Docs API Groups

### Network Configuration
**Exports**
- monad.testnet
- monad.system-contracts

Network constants and built-in addresses needed for basic integration.

#### monad.testnet
**Kind**
config

**Summary**
The essential public testnet configuration for connecting wallets, RPC clients, and apps.

**Definition**
Language: json
Source: Monad docs and prior pack coverage

```json
{
  "networkName": "Monad Testnet",
  "chainId": 10143,
  "currencySymbol": "MON",
  "blockExplorer": "https://testnet.monadexplorer.com"
}
```

**Guidance**
- Set the correct chain ID in wallets and clients to avoid replay or signing mistakes.
- Keep explorer and RPC configuration explicit in app setup, not hidden in environment folklore.
- Treat the testnet config as a runtime dependency rather than a copied code comment.

**Example**
Language: javascript
Description: Define a client chain configuration.

```js
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet"
};
```

#### monad.system-contracts
**Kind**
object

**Summary**
Documented system or well-known utility contracts such as Multicall3 used frequently in Monad integrations.

**Definition**
Language: json
Source: Monad docs and prior pack coverage

```json
{
  "Multicall3": "0xcA11bde05977b3631167028862bE2a173976CA11"
}
```

**Guidance**
- Use the documented Multicall address for read batching instead of inventing deployment-specific assumptions.
- Keep system-contract addresses in explicit configuration so downstream tools can reuse them.
- Prefer batching on Monad for high-volume read paths.

**Example**
Language: javascript
Description: Prepare a Multicall3 address constant.

```js
const MULTICALL3 = "0xcA11bde05977b3631167028862bE2a173976CA11";
```

### Execution And Data Model
**Exports**
- monad.parallel-execution
- monad.historical-state
- monad.finality

Protocol behavior that changes how agents should reason about reads, writes, and UX.

#### monad.parallel-execution
**Kind**
other

**Summary**
Monad executes transactions optimistically in parallel while preserving serial-equivalent final state.

**Definition**
Language: text
Source: Monad docs and prior pack coverage

```text
Monad computes transactions in parallel, validates read/write dependencies during commit,
and re-executes conflicting transactions as needed so the final state matches serial execution.
```

**Guidance**
- Do not rewrite contracts solely to "opt into" parallelism; the protocol handles that layer.
- Focus optimization effort on client-side batching and state access patterns instead.
- Keep the execution model in mind when explaining performance, not when inventing new Solidity semantics.

**Example**
Language: text
Description: Correct framing for a developer question.

```text
Existing Solidity contracts deploy normally; Monad's execution engine handles the parallel scheduling.
```

#### monad.historical-state
**Kind**
other

**Summary**
Monad full nodes prune historical state aggressively, so old-state queries are not a safe default.

**Definition**
Language: text
Source: Monad docs and prior pack coverage

```text
Historical state queries against old block numbers may fail on full nodes; use indexers or derive historical state off-chain when deep history is required.
```

**Guidance**
- Use full nodes for recent state and transaction submission, not deep-history analytics.
- Reach for indexers when the task needs historical balances, calls, or derived datasets.
- Surface this limitation early when designing APIs or dashboards.

**Example**
Language: text
Description: Correct answer for a historical-read requirement.

```text
If you need older state than the node retains, move that workload to an indexer instead of retrying the same RPC call.
```

#### monad.finality
**Kind**
other

**Summary**
Monad exposes very fast confirmation and finality windows that should shape nonce, UX, and retry design.

**Definition**
Language: text
Source: Monad docs and prior pack coverage

```text
Speculative finality is around 400ms (1 block) and full finality is around 800ms (2 blocks), with deeper execution-confirmation milestones documented separately.
```

**Guidance**
- Design UIs to reflect fast confirmation without overstating immutable finality too early.
- Manage nonces locally when submitting quickly because `eth_getTransactionCount` lags finalized state.
- Keep retry and queueing logic aligned with these short finality windows.

**Example**
Language: text
Description: Correct framing for a wallet or app UX.

```text
Show rapid confirmation feedback, but keep your "fully finalized" label aligned with the protocol's documented finality window.
```
