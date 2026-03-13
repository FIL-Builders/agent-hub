# ethers Documentation Pack

## Snapshot
- library name: ethers
- version or version range: ^6.16.0
- primary language: javascript
- homepage or canonical docs URL: https://docs.ethers.org/v6/
- short description: ethers is a JavaScript and TypeScript library for Ethereum providers, wallets, contract interaction, ABI handling, units, and hashing utilities.
- source set summary: npm:ethers@6.16.0 TypeScript declarations, official ethers v6 documentation pages, and the existing AgentHub ethers pack for coverage audit only

## What This Library Is For
ethers is used to connect to Ethereum-compatible networks, wrap injected wallets, sign transactions and messages, deploy and call contracts, encode and decode ABI payloads, and safely convert blockchain-oriented data such as addresses, units, and hashes. This pack focuses on the public surface area an agent most often needs when editing or generating application code, deployment code, or low-level contract interaction logic.

## Installation And Setup
- install commands:
  - `npm install ethers`
- environment prerequisites:
  - Node.js or a browser bundler for frontend usage
  - access to an RPC endpoint or injected EIP-1193 provider for network interaction
- configuration prerequisites:
  - keep secrets such as private keys and API keys out of source control
  - treat on-chain numeric values as `bigint` or `BigNumberish`, not JavaScript `number`
- minimum setup example:

```js
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL);
console.log(await provider.getBlockNumber());
```

## Core Concepts

### Provider and signer separation
- Providers handle reads and network access.
- Signers add authority to sign transactions or messages.
- Contracts behave read-only with a provider and stateful with a signer.

### ABI-first contract interaction
- `Contract` is the high-level runtime surface for deployed contracts.
- `Interface` and `AbiCoder` are the low-level tools for ABI parsing and encoding.
- Use the contract layer unless you specifically need raw calldata or log decoding.

### BigInt and safe unit conversion
- Ethers v6 prefers `bigint` for value conversion helpers.
- Use `parseEther`, `formatEther`, `parseUnits`, and `formatUnits` instead of manual decimal arithmetic.
- Never use floating-point math for token or gas values.

### Address and hashing correctness
- Normalize addresses with `getAddress` when checksum validation matters.
- Use `isAddress` only as a boolean filter, not as normalization.
- Use `keccak256` for byte-like payloads and `id` for UTF-8 strings.

## Decision Rules
- Use `BrowserProvider` for browser wallet flows and `JsonRpcProvider` for backend or script flows.
- Use `Contract` for ordinary contract interaction and `Interface` or `AbiCoder` only when you specifically need raw ABI encoding, decoding, or introspection.
- Use `getAddress` when you need a canonical checksum address; use `isAddress` only when a boolean filter is enough.
- Use `parseUnits(value, decimals)` for token amounts and reserve `parseEther` for ETH-denominated values.
- Use explicit provider classes for production systems and keep `getDefaultProvider` for prototypes or low-ceremony scripts.

## Preconditions And Invariants
- A browser wallet flow requires an injected EIP-1193 provider before `BrowserProvider` can be constructed.
- Stateful contract writes require a signer-capable runner; a provider-only contract is read-only.
- Token amount parsing requires the correct decimal scale for the token being transferred.
- The token contract address must match the active chain; ERC-20 addresses are chain-specific.
- Transaction success is not established at submission time; code that depends on state changes should wait for confirmation.

## Public Surface Area

### Providers and network access

#### JsonRpcProvider
**Kind:** class

**Summary:** HTTP or HTTPS JSON-RPC provider for general-purpose backend reads and writes.

**Definition**
```ts
export declare class JsonRpcProvider extends JsonRpcApiPollingProvider {
    constructor(url?: string | FetchRequest, network?: Networkish, options?: JsonRpcApiProviderOptions);
    send(method: string, params: Array<any> | Record<string, any>): Promise<any>;
}
```

**Guidance**
- Use for server-side scripts, backends, and deterministic RPC access.
- Pass an explicit network when misconfiguration would be costly.

**Example**
```js
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL, "mainnet");
console.log(await provider.getBlockNumber());
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/providers/provider-jsonrpc.d.ts`

#### BrowserProvider
**Kind:** class

**Summary:** Wraps an injected EIP-1193 browser wallet such as MetaMask.

**Definition**
```ts
export declare class BrowserProvider extends JsonRpcApiPollingProvider {
    constructor(ethereum: Eip1193Provider, network?: Networkish, _options?: BrowserProviderOptions);
    hasSigner(address: number | string): Promise<boolean>;
    getSigner(address?: number | string): Promise<JsonRpcSigner>;
    static discover(options?: BrowserDiscoverOptions): Promise<null | BrowserProvider>;
}
```

**Guidance**
- Use in browser apps to talk to injected wallets.
- Request account access before assuming a signer is available.
- Validate or pin the active chain before constructing chain-specific contract instances.
- Reset cached signer or contract state when the wallet account or chain changes.

**Example**
```js
import { BrowserProvider } from "ethers";

const provider = new BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
console.log(await signer.getAddress());
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/providers/provider-browser.d.ts`

#### WebSocketProvider
**Kind:** class

**Summary:** Maintains a live JSON-RPC WebSocket connection for subscriptions and low-latency updates.

**Definition**
```ts
export declare class WebSocketProvider extends SocketProvider {
    constructor(url: string | WebSocketLike | WebSocketCreator, network?: Networkish, options?: JsonRpcApiProviderOptions);
    destroy(): Promise<void>;
}
```

**Guidance**
- Prefer for event-driven apps and long-lived subscriptions.
- Plan for reconnect behavior and cleanup on shutdown.

**Example**
```js
import { WebSocketProvider } from "ethers";

const provider = new WebSocketProvider(process.env.WS_RPC_URL, "mainnet");
provider.on("block", (blockNumber) => {
  console.log("block", blockNumber);
});
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/providers/provider-websocket.d.ts`

#### FallbackProvider
**Kind:** class

**Summary:** Combines multiple backends for resilience, agreement checks, and failover.

**Definition**
```ts
export declare class FallbackProvider extends AbstractProvider {
    readonly quorum: number;
    constructor(providers: Array<AbstractProvider | FallbackProviderConfig>, network?: Networkish, options?: FallbackProviderOptions);
    destroy(): Promise<void>;
}
```

**Guidance**
- Use when availability and backend disagreement matter.
- Tune quorum and provider weights deliberately; defaults are not neutral for every workload.

**Example**
```js
import { FallbackProvider, JsonRpcProvider } from "ethers";

const provider = new FallbackProvider([
  new JsonRpcProvider(process.env.RPC_URL_A),
  new JsonRpcProvider(process.env.RPC_URL_B),
]);

console.log(await provider.getBlockNumber());
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/providers/provider-fallback.d.ts`

#### getDefaultProvider
**Kind:** function

**Summary:** Creates a provider from a network name or endpoint using built-in backend selection.

**Definition**
```ts
export declare function getDefaultProvider(network?: string | Networkish | WebSocketLike, options?: any): AbstractProvider;
```

**Guidance**
- Useful for prototypes and simple scripts.
- For production systems, prefer explicit provider construction so backend choice and API keys are obvious.

**Example**
```js
import { getDefaultProvider } from "ethers";

const provider = getDefaultProvider("mainnet", {
  infura: process.env.INFURA_KEY,
});

console.log(await provider.getNetwork());
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/providers/default-provider.d.ts`

### Wallets and signatures

#### Wallet
**Kind:** class

**Summary:** Manages a single private key and can sign transactions, messages, and typed payloads.

**Definition**
```ts
export declare class Wallet extends BaseWallet {
    constructor(key: string | SigningKey, provider?: null | Provider);
    connect(provider: null | Provider): Wallet;
    static createRandom(provider?: null | Provider): HDNodeWallet;
    static fromPhrase(phrase: string, provider?: Provider): HDNodeWallet;
}
```

**Guidance**
- Never hardcode private keys or mnemonics.
- Connect the wallet to a provider before sending transactions.

**Example**
```js
import { JsonRpcProvider, Wallet, parseEther } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

const tx = await wallet.sendTransaction({
  to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  value: parseEther("0.001"),
});

await tx.wait();
console.log(tx.hash);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/wallet/wallet.d.ts`

#### HDNodeWallet
**Kind:** class

**Summary:** Hierarchical deterministic wallet with derivation-path and mnemonic metadata.

**Definition**
```ts
export declare class HDNodeWallet extends BaseWallet {
    readonly publicKey: string;
    readonly mnemonic: null | Mnemonic;
    readonly path: null | string;
    connect(provider: null | Provider): HDNodeWallet;
}
```

**Guidance**
- Use when you need deterministic derivation and path-aware account management.
- Keep mnemonic handling and derivation policy explicit in deployment or wallet-management code.

**Example**
```js
import { Wallet } from "ethers";

const wallet = Wallet.fromPhrase(process.env.MNEMONIC);
console.log(wallet.path);
console.log(wallet.address);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/wallet/hdwallet.d.ts`
- Coverage audit only: `agents/ethers/0.2.0.md`

#### verifyMessage
**Kind:** function

**Summary:** Recovers the signing address for an EIP-191 personal message signature.

**Definition**
```ts
export declare function verifyMessage(message: Uint8Array | string, sig: SignatureLike): string;
```

**Guidance**
- Use for off-chain signature verification and wallet-auth style flows.
- Be explicit about whether the upstream system signed raw bytes or a UTF-8 string.

**Example**
```js
import { verifyMessage } from "ethers";

const signerAddress = verifyMessage("hello", signature);
console.log(signerAddress);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/hash/message.d.ts`

### Contracts and ABI

#### Contract
**Kind:** class

**Summary:** High-level runtime wrapper around a deployed contract ABI and target address.

**Definition**
```ts
declare const Contract_base: new (
    target: string | Addressable,
    abi: Interface | InterfaceAbi,
    runner?: ContractRunner | null | undefined
) => BaseContract & Omit<ContractInterface, keyof BaseContract>;

export declare class Contract extends Contract_base {
}
```

**Guidance**
- Use a provider for reads and a signer for state-changing methods.
- Prefer small human-readable ABI fragments when a full artifact is unnecessary.
- Treat the return value of a write such as `transfer(...)` as a transaction response; chain success is established later via confirmation.
- Rebuild or reconnect the contract when the signer or active chain changes in a browser workflow.

**Example**
```js
import { Contract, JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL);
const abi = ["function balanceOf(address) view returns (uint256)"];
const token = new Contract(
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  abi,
  provider
);

console.log(await token.balanceOf("vitalik.eth"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/contract/contract.d.ts`

#### ContractFactory
**Kind:** class

**Summary:** Deploys contracts from ABI and bytecode using a connected runner.

**Definition**
```ts
export declare class ContractFactory<A extends Array<any> = Array<any>, I = BaseContract> {
    constructor(abi: Interface | InterfaceAbi, bytecode: BytesLike | { object: string }, runner?: null | ContractRunner);
    getDeployTransaction(...args: ContractMethodArgs<A>): Promise<ContractDeployTransaction>;
    deploy(...args: ContractMethodArgs<A>): Promise<BaseContract & {
        deploymentTransaction(): ContractTransactionResponse;
    } & Omit<I, keyof BaseContract>>;
    connect(runner: null | ContractRunner): ContractFactory<A, I>;
    static fromSolidity<A extends Array<any> = Array<any>, I = ContractInterface>(output: any, runner?: ContractRunner): ContractFactory<A, I>;
}
```

**Guidance**
- Wait for deployment before using the returned contract for follow-up interactions.
- Keep bytecode and ABI paired from the same build output.

**Example**
```js
import { ContractFactory, JsonRpcProvider, Wallet } from "ethers";
import artifact from "./Greeter.json" assert { type: "json" };

const provider = new JsonRpcProvider(process.env.RPC_URL);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
const contract = await factory.deploy("hello");

await contract.waitForDeployment();
console.log(contract.target);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/contract/factory.d.ts`

#### Interface
**Kind:** class

**Summary:** Parses ABI fragments and provides encoding, decoding, and lookup helpers.

**Definition**
```ts
export declare class Interface {
    readonly fragments: ReadonlyArray<Fragment>;
    readonly deploy: ConstructorFragment;
    readonly fallback: null | FallbackFragment;
    readonly receive: boolean;
    constructor(fragments: InterfaceAbi);
    format(minimal?: boolean): Array<string>;
    formatJson(): string;
    getAbiCoder(): AbiCoder;
    getFunction(key: string, values?: Array<any | Typed>): null | FunctionFragment;
    getEvent(key: string, values?: Array<any | Typed>): null | EventFragment;
}
```

**Guidance**
- Use for calldata encoding, event log decoding, and ABI introspection without network access.
- Reach for `Interface` before `AbiCoder` when you already have a contract ABI.

**Example**
```js
import { Interface } from "ethers";

const iface = new Interface([
  "function transfer(address to, uint256 value)",
]);

const data = iface.encodeFunctionData("transfer", [
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  1n,
]);

console.log(data);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/abi/interface.d.ts`

#### AbiCoder
**Kind:** class

**Summary:** Low-level encoder and decoder for ABI values outside a specific contract context.

**Definition**
```ts
export declare class AbiCoder {
    getDefaultValue(types: ReadonlyArray<string | ParamType>): Result;
    encode(types: ReadonlyArray<string | ParamType>, values: ReadonlyArray<any>): string;
    decode(types: ReadonlyArray<string | ParamType>, data: BytesLike, loose?: boolean): Result;
    static defaultAbiCoder(): AbiCoder;
}
```

**Guidance**
- Use for standalone ABI encoding and decoding tasks.
- Prefer `Interface` when you want fragment-level semantics such as functions and events.

**Example**
```js
import { AbiCoder } from "ethers";

const coder = AbiCoder.defaultAbiCoder();
const encoded = coder.encode(["uint256", "bool"], [42n, true]);
console.log(encoded);
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/abi/abi-coder.d.ts`

### Addresses, units, and hashing

#### parseEther
**Kind:** function

**Summary:** Converts a decimal ether string into wei as `bigint`.

**Definition**
```ts
export declare function parseEther(ether: string): bigint;
```

**Guidance**
- Use for human-entered ether amounts with 18 decimals.
- Reject or sanitize user input before conversion when values come from forms.

**Example**
```js
import { parseEther } from "ethers";

console.log(parseEther("0.5"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/utils/units.d.ts`

#### formatEther
**Kind:** function

**Summary:** Formats wei-like values into an ether-denominated decimal string.

**Definition**
```ts
export declare function formatEther(wei: BigNumberish): string;
```

**Guidance**
- Use for display-only formatting, not for arithmetic.
- Keep raw on-chain values in integer form until the presentation layer.

**Example**
```js
import { formatEther, parseEther } from "ethers";

console.log(formatEther(parseEther("1.25")));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/utils/units.d.ts`

#### parseUnits
**Kind:** function

**Summary:** Converts a decimal string into an integer using an explicit unit scale.

**Definition**
```ts
export declare function parseUnits(value: string, unit?: string | Numeric): bigint;
```

**Guidance**
- Use for ERC-20 token amounts with non-18 decimals.
- Keep the token's decimals explicit in code paths that touch transfers or approvals.
- Prefer text inputs and explicit validation for user-entered amounts; browser `number` inputs and floating-point parsing create subtle bugs.
- Do not silently round values that exceed the token’s supported decimal precision.

**Example**
```js
import { parseUnits } from "ethers";

console.log(parseUnits("12.5", 6));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/utils/units.d.ts`

#### formatUnits
**Kind:** function

**Summary:** Formats an integer value using a token or unit scale.

**Definition**
```ts
export declare function formatUnits(value: BigNumberish, unit?: string | Numeric): string;
```

**Guidance**
- Use for rendering token balances with known decimals.
- Keep the decimals source trustworthy; formatting with the wrong scale is a silent bug.

**Example**
```js
import { formatUnits } from "ethers";

console.log(formatUnits(12345000n, 6));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/utils/units.d.ts`

#### getAddress
**Kind:** function

**Summary:** Normalizes and checksum-validates an Ethereum address.

**Definition**
```ts
export declare function getAddress(address: string): string;
```

**Guidance**
- Use when you need a canonical checksum address.
- Let it throw on bad mixed-case checksums instead of silently rewriting invalid input.
- Treat a thrown error as an expected validation result for user input.
- Apply additional business rules separately, such as rejecting the zero address in transfer flows.

**Example**
```js
import { getAddress } from "ethers";

console.log(getAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/address/address.d.ts`

#### isAddress
**Kind:** function

**Summary:** Returns whether a value is a syntactically valid address or ICAP address.

**Definition**
```ts
export declare function isAddress(value: any): value is string;
```

**Guidance**
- Use as a quick boolean check.
- Use `getAddress` when you also need normalization and checksum enforcement.

**Example**
```js
import { isAddress } from "ethers";

console.log(isAddress("0x123"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/address/checks.d.ts`

#### keccak256
**Kind:** function

**Summary:** Computes the Keccak-256 hash of byte-like data.

**Definition**
```ts
export declare function keccak256(_data: BytesLike): string;
```

**Guidance**
- Pass bytes or hex data, not plain UTF-8 strings.
- Use `id` when the source value is a string you want hashed as UTF-8 text.

**Example**
```js
import { keccak256 } from "ethers";

console.log(keccak256("0x1337"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/crypto/keccak.d.ts`

#### id
**Kind:** function

**Summary:** Computes a Keccak-256 identifier from a UTF-8 string.

**Definition**
```ts
export declare function id(value: string): string;
```

**Guidance**
- Use for string-based identifiers and topic-like derivations from text.
- Do not substitute it for hashing binary data.

**Example**
```js
import { id } from "ethers";

console.log(id("Transfer(address,address,uint256)"));
```

**Source Notes**
- Source: `npm:ethers@6.16.0:package/lib.commonjs/hash/id.d.ts`

## Common Workflows

### Connect a server-side app to a chain
1. Create a `JsonRpcProvider` with an explicit RPC URL.
2. Optionally pass or verify the expected network.
3. Reuse the provider instead of recreating it per call.

### Connect a browser wallet
1. Wrap `window.ethereum` in `BrowserProvider`.
2. Request accounts explicitly.
3. Use `getSigner()` only after the wallet is connected.

### Submit an ERC-20 transfer from a browser form
1. Wrap the injected provider in `BrowserProvider`.
2. Request accounts and obtain a signer.
3. Verify the active network matches the token address you intend to use.
4. Normalize the recipient with `getAddress`.
5. Parse the user-entered amount with `parseUnits(value, tokenDecimals)`.
6. Instantiate a `Contract` with a minimal ERC-20 ABI and the signer.
7. Call `transfer(recipient, amount)` and wait for confirmation before showing success.
8. Invalidate local signer or contract state on `accountsChanged` and `chainChanged`.

### Call or deploy a contract
1. Build a `Contract` with ABI plus provider for reads.
2. Swap in a signer for writes.
3. Use `ContractFactory` for deployment and wait for deployment before follow-up writes.

## Gotchas

- `getDefaultProvider` is convenient but hides backend composition details.
- Ethers v6 prefers `bigint`; avoid mixing `number` into value math.
- `keccak256("hello")` is wrong for text hashing because it expects bytes-like input; use `id("hello")` instead.
- `isAddress` validates; `getAddress` validates and normalizes.
- Browser wallet code should not assume a signer exists before account access is granted.
- ERC-20 addresses are chain-specific; the same symbol on a different chain is a different contract.
- `parseUnits(..., 6)` is correct for USDC-like flows, but only if the token really uses 6 decimals.
- A submitted contract write has not succeeded yet; success depends on confirmation, not submission.

## Common Confusions

- `getAddress` validates and normalizes; `isAddress` only answers yes or no.
- `parseEther` is for ETH units; `parseUnits` is for token scales such as USDC’s 6 decimals.
- `Contract` handles high-level interaction; `Interface` and `AbiCoder` are lower-level ABI tools.
- A submitted write returns a transaction response; success is established later through confirmation.

## References

- official docs: https://docs.ethers.org/v6/
- providers docs: https://docs.ethers.org/v6/api/providers/
- wallet docs: https://docs.ethers.org/v6/api/wallet/
- contract docs: https://docs.ethers.org/v6/api/contract/
- abi docs: https://docs.ethers.org/v6/api/abi/
- address docs: https://docs.ethers.org/v6/api/address/
- hashing docs: https://docs.ethers.org/v6/api/hashing/
- utils docs: https://docs.ethers.org/v6/api/utils/
- type declarations: `npm:ethers@6.16.0`
- coverage audit only: `agents/ethers/0.2.0.md`
