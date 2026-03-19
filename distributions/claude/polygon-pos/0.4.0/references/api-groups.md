# Polygon PoS API Groups

### Setup And Provider Model
**Exports**
- use
- Web3ClientPlugin
- POSClient
- POSClient.init

Core `matic.js` setup and client initialization primitives.

#### use
**Kind**
function

**Summary**
Install a plugin into `matic.js`, such as the ethers integration plugin.

**Definition**
Language: typescript
Source: official Polygon matic.js docs + npm:@maticnetwork/maticjs@3.9.6 default export

```ts
declare const defaultExport: {
  use: (plugin: any, ...payload: any[]) => any;
};
```

**Guidance**
- Install the provider plugin before constructing `POSClient` when you want ethers-backed providers.
- The plugin layer keeps `matic.js` lightweight; do not assume ethers support is built in automatically.
- Match the plugin choice to the provider stack you are already using in the app.

**Example**
Language: javascript
Description: Install the ethers plugin before initializing a PoS client.

```js
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";

use(Web3ClientPlugin);
```

#### Web3ClientPlugin
**Kind**
class

**Summary**
Ethers plugin that injects ethers-backed provider support into `matic.js`.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs-ethers@1.1.0:package/dist/ts/index.d.ts

```ts
export declare class Web3ClientPlugin implements IPlugin {
  setup(matic: any): void;
}
```

**Guidance**
- Use this when the surrounding app stack already depends on ethers providers or wallets.
- Install it exactly once during startup; repeated ad hoc installation usually indicates poor application initialization boundaries.
- Keep plugin setup separate from bridge initialization so startup errors remain easy to debug.

**Example**
Language: javascript
Description: Import the ethers plugin for matic.js.

```js
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";
```

#### POSClient
**Kind**
class

**Summary**
Main matic.js client for interacting with the Polygon PoS bridge.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/index.d.ts

```ts
export declare class POSClient extends BridgeClient<IPOSClientConfig> {
  init(config: IPOSClientConfig): Promise<this>;
  erc20(tokenAddress: any, isParent?: boolean): ERC20;
  depositEther(amount: TYPE_AMOUNT, userAddress: string, option: ITransactionOption): Promise<ITransactionWriteResult>;
}
```

**Guidance**
- Use this as the default programmatic entrypoint for Polygon PoS bridge operations.
- Keep token-handle creation explicit so parent-side and child-side logic do not get mixed.
- Do not collapse it into raw ethers or raw Portal workflows; it sits at a higher bridge-specific abstraction layer.

**Example**
Language: javascript
Description: Create a `POSClient` instance after plugin installation.

```js
import { POSClient } from "@maticnetwork/maticjs";

const posClient = new POSClient();
```

#### POSClient.init
**Kind**
function

**Summary**
Initialize the PoS client with explicit network, version, and parent-child provider configuration.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/index.d.ts + package/dist/ts/interfaces/pos_client_config.d.ts

```ts
init(config: IPOSClientConfig): Promise<this>;

interface IPOSClientConfig extends IBaseClientConfig {
  rootChainManager?: string;
  rootChain?: string;
  rootChainDefaultBlock?: string;
}
```

**Guidance**
- Always set both `parent` and `child` providers explicitly for bridge workflows.
- Keep `network` and `version` aligned with the intended environment, such as testnet and `amoy`.
- Wrong provider pairing is one of the most common causes of broken deposits and exits.

**Example**
Language: javascript
Description: Initialize `POSClient` with ethers wallets for parent and child networks.

```js
import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";
import { providers, Wallet } from "ethers";

use(Web3ClientPlugin);

const parentProvider = new providers.JsonRpcProvider(process.env.PARENT_RPC);
const childProvider = new providers.JsonRpcProvider(process.env.CHILD_RPC);

await posClient.init({
  network: "testnet",
  version: "amoy",
  parent: {
    provider: new Wallet(process.env.PRIVATE_KEY, parentProvider),
    defaultConfig: { from: process.env.FROM_ADDRESS },
  },
  child: {
    provider: new Wallet(process.env.PRIVATE_KEY, childProvider),
    defaultConfig: { from: process.env.FROM_ADDRESS },
  },
});
```

### Token Handles And Deposits
**Exports**
- POSClient.erc20
- ERC20.approve
- ERC20.deposit
- POSClient.depositEther

Parent-side and child-side token handling plus ordinary deposit flows.

#### POSClient.erc20
**Kind**
function

**Summary**
Create an ERC-20 bridge helper for either the parent or child side of Polygon PoS.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/index.d.ts

```ts
erc20(tokenAddress: any, isParent?: boolean): ERC20;
```

**Guidance**
- Pass `true` for the parent-side handle when you need approval or deposit from Ethereum.
- Use the default child-side handle for balance checks and withdrawal initiation on Polygon PoS.
- Do not reuse one token helper across both sides without making the side explicit.

**Example**
Language: javascript
Description: Create parent and child handles for the same bridged token.

```js
const parentToken = posClient.erc20(process.env.ROOT_TOKEN, true);
const childToken = posClient.erc20(process.env.CHILD_TOKEN);
```

#### ERC20.approve
**Kind**
function

**Summary**
Approve a parent-side spender so an ERC-20 deposit can proceed.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/erc20.d.ts

```ts
approve(
  amount: TYPE_AMOUNT,
  option?: IApproveTransactionOption
): Promise<ITransactionWriteResult>;
```

**Guidance**
- For parent-side ERC-20 deposits, approval usually comes before deposit.
- Keep the spender boundary explicit if you override it in options.
- Failed deposits after skipped approval are an application-logic mistake, not a bridge mystery.

**Example**
Language: javascript
Description: Approve a parent-side ERC-20 before depositing to Polygon PoS.

```js
const approveResult = await parentToken.approve("1000000");
await approveResult.getReceipt();
```

#### ERC20.deposit
**Kind**
function

**Summary**
Deposit a parent-side ERC-20 for a target user onto Polygon PoS.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/erc20.d.ts

```ts
deposit(
  amount: TYPE_AMOUNT,
  userAddress: string,
  option?: ITransactionOption
): Promise<ITransactionWriteResult>;
```

**Guidance**
- Use this on the parent-side token handle after approval when bridging to Polygon PoS.
- Deposit completion is a parent-to-child workflow; do not confuse it with child-to-parent exit handling.
- Keep the recipient address explicit instead of assuming the caller and recipient are always the same.

**Example**
Language: javascript
Description: Deposit an ERC-20 from Ethereum to Polygon PoS.

```js
const depositResult = await parentToken.deposit("1000000", process.env.USER_ADDRESS);
await depositResult.getReceipt();
```

#### POSClient.depositEther
**Kind**
function

**Summary**
Deposit native ether value into the PoS bridge for a target user.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/index.d.ts

```ts
depositEther(
  amount: TYPE_AMOUNT,
  userAddress: string,
  option: ITransactionOption
): Promise<ITransactionWriteResult>;
```

**Guidance**
- Use this when bridging native value rather than ERC-20 tokens.
- Keep gas and signer configuration explicit because native-value workflows are easy to misconfigure silently.
- This is still a parent-to-child deposit path and should not be described using withdrawal language.

**Example**
Language: javascript
Description: Deposit native value through the PoS client.

```js
const result = await posClient.depositEther("100000000000000000", process.env.USER_ADDRESS, {});
await result.getReceipt();
```

### Withdrawals And Exit Finalization
**Exports**
- ERC20.withdrawStart
- ERC20.withdrawExitFaster
- RootChainManager.isExitProcessed
- ExitUtil.isCheckPointed

Burn, checkpoint, and exit-completion primitives for child-to-parent withdrawals.

#### ERC20.withdrawStart
**Kind**
function

**Summary**
Initiate a Polygon PoS ERC-20 withdrawal by burning on the child chain.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/erc20.d.ts

```ts
withdrawStart(
  amount: TYPE_AMOUNT,
  option?: ITransactionOption
): Promise<ITransactionWriteResult>;
```

**Guidance**
- This starts the withdrawal on Polygon PoS; it does not finalize the asset back on Ethereum.
- Persist the burn transaction hash because later checkpoint and exit steps depend on it.
- Child-chain burn confirmation and Ethereum-side exit completion are different milestones.

**Example**
Language: javascript
Description: Burn tokens on Polygon PoS to start a withdrawal.

```js
const burnResult = await childToken.withdrawStart("1000000");
const burnTxHash = await burnResult.getTransactionHash();
```

#### ERC20.withdrawExitFaster
**Kind**
function

**Summary**
Complete a withdrawal exit using API-assisted proof generation after checkpoint readiness.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/erc20.d.ts

```ts
withdrawExitFaster(
  burnTransactionHash: string,
  option?: IExitTransactionOption
): any;
```

**Guidance**
- Call this only after the burn transaction is checkpointed and exit-ready.
- Faster proof generation changes proof acquisition mechanics, not the need for correct checkpoint timing.
- Use the burn tx hash from the child-chain withdrawal start step; parent deposit hashes are not interchangeable here.

**Example**
Language: javascript
Description: Finalize a withdrawal after checkpoint readiness.

```js
const exitResult = await childToken.withdrawExitFaster(burnTxHash);
```

#### RootChainManager.isExitProcessed
**Kind**
function

**Summary**
Check whether a particular exit hash has already been processed on the root side.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/root_chain_manager.d.ts

```ts
isExitProcessed(exitHash: string): Promise<boolean>;
```

**Guidance**
- Use this to guard against duplicate or repeated exit submission attempts.
- It answers whether the exit is already processed, not whether checkpointing has occurred yet.
- Pair it with checkpoint-readiness checks when diagnosing stuck or repeated exits.

**Example**
Language: javascript
Description: Check whether an exit hash was already finalized.

```js
const processed = await posClient.rootChainManager.isExitProcessed(exitHash);
console.log(processed);
```

#### ExitUtil.isCheckPointed
**Kind**
function

**Summary**
Check whether the burn transaction has been checkpointed and is eligible for exit proof generation.

**Definition**
Language: typescript
Source: npm:@maticnetwork/maticjs@3.9.6:package/dist/ts/pos/exit_util.d.ts

```ts
isCheckPointed(burnTxHash: string): Promise<boolean>;
```

**Guidance**
- Use this before trying to finalize a withdrawal exit.
- A failed exit attempt before checkpointing is usually a workflow-timing mistake, not a package bug.
- Keep checkpoint readiness and processed-exit state as separate checks.

**Example**
Language: javascript
Description: Check whether a burn transaction is ready for exit.

```js
const exitUtil = childToken.exitUtil;
const ready = await exitUtil.isCheckPointed(burnTxHash);
console.log(ready);
```

### Portal And Operational Boundaries
**Exports**
- Polygon Portal

High-level UX boundary for the official bridge experience.

#### Polygon Portal
**Kind**
workflow

**Summary**
Official Polygon bridge UX for transferring assets between Ethereum and Polygon PoS.

**Definition**
Language: markdown
Source: official Polygon Portal docs

```md
The official bridge allows you to transfer tokens between Ethereum and Polygon PoS.
Deposits lock on Ethereum and mint or represent 1:1 on Polygon PoS.
Withdrawals burn on Polygon PoS and unlock on Ethereum later in the process.
```

**Guidance**
- Use Portal as the user-facing reference workflow when the question is about the official bridge experience rather than code.
- Keep Portal and matic.js separate: same bridge model, different abstraction layer.
- Portal docs are also a good sanity check for deposit-versus-withdraw semantics when reviewing code guidance.

**Example**
Language: markdown
Description: Decision rule for Portal versus matic.js.

```md
If the task is "guide a user through the official bridge UI", use Portal.
If the task is "write app code for deposits or exits", use matic.js.
```
