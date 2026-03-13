# ENS Documentation Pack

## Snapshot
- library name: ENS
- version or version range: current-docs + ensjs^4.2.2
- primary language: typescript
- homepage or canonical docs URL: https://docs.ens.domains
- short description: ENS is a decentralized naming system for addresses, records, registration, reverse records, and wrapped-name management, with ENSjs as the current JavaScript integration layer.
- source set summary: https://docs.ens.domains/web, https://docs.ens.domains/web/resolution, https://docs.ens.domains/web/reverse, https://docs.ens.domains/resolvers/interacting, https://docs.ens.domains/resolvers/public, https://docs.ens.domains/resolution/names, https://docs.ens.domains/registry/eth, https://docs.ens.domains/wrapper/overview, npm:@ensdomains/ensjs@4.2.2

## What This Library Is For
ENS is used to resolve human-readable names to blockchain addresses and records, verify and display primary names safely, register and renew `.eth` names, manage resolver-backed records, and perform advanced wrapped-name operations. This pack is centered on the current ENS docs surface plus ENSjs `^4.2.2` as the ordinary TypeScript integration layer for dapps and tooling.

## Installation And Setup
- install commands:
  - `npm install @ensdomains/ensjs viem`
- environment prerequisites:
  - an RPC endpoint for the chain you are targeting
  - a wallet provider when you need writes such as registration, renewal, or record updates
- configuration prerequisites:
  - use a chain supported by ENS and ENSjs
  - normalize names before hashing, comparing, or storing them yourself
  - treat official docs as the authority for protocol behavior and `ensjs@4.2.2` type declarations as the authority for ENSjs contracts
- minimum setup example:

```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

export const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});
```

## Core Concepts

### Forward resolution, reverse resolution, and primary names are different
- Forward resolution is `name -> address`.
- Reverse resolution is `address -> name`.
- A primary name is only trustworthy when reverse resolution is verified by a matching forward resolution on the relevant chain.

### Normalize names before low-level processing
- ENS names are normalized with the ENSIP-15 algorithm.
- Normalization must happen before hashing, label processing, direct resolver interaction, or manual contract calls.
- ENSjs handles much of this for you, but the requirement still matters for boundaries and debugging.

### Resolver capability checks are mandatory for writes
- Custom resolvers exist, so you cannot assume that a resolver supports text, multicoin, contenthash, or other record interfaces.
- The current ENS docs explicitly recommend `supportsInterface()` checks before attempting writes.
- Do not hardcode public resolver behavior onto arbitrary resolver addresses.

### ENSjs is the default TypeScript integration path
- ENSjs exposes public and wallet clients for most dapp workflows.
- Low-level contract interaction is still useful for custom resolvers, specialized wrappers, or unsupported features, but it should be treated as the lower-level escape hatch.
- Resolver addresses and registrar contracts should come from supported chains and current deployments, not fixed assumptions.

### Registration and wrapper operations have extra sequencing rules
- `.eth` registration uses a commit-reveal flow with timing and value-buffer constraints.
- Renewal still needs a correctly priced `value`.
- Wrapping changes the ownership and permission model through the Name Wrapper and fuses, so it should be presented as an explicit operational choice.

## Version Delta Audit
- prior pack target: ENS core on-chain contracts, especially registrar, resolver, reverse registrar, registry, and wrapper contracts
- current target: ENS as a developer platform with ENSjs `^4.2.2` as the ordinary integration anchor plus the current official docs surface
- stale mental model to avoid:
  - ENS is only direct contract interaction
  - reverse records alone are safe to display
  - every resolver supports every write
  - `.eth` names are the only relevant ENS names
- replacement model:
  - start from ENSjs for app integration
  - treat verified primary names as a two-way invariant
  - gate record writes behind resolver capability checks
  - treat low-level contracts and wrapper flows as explicit boundaries

## Ecosystem Boundaries
- first-class coverage:
  - ENSjs public and wallet client setup
  - forward resolution
  - reverse resolution and primary-name verification
  - resolver inspection and record writes
  - registration and renewal
  - name wrapping and unwrapping
- boundary coverage:
  - custom resolvers
  - direct registry, registrar, and wrapper contract calls
  - subgraph-driven enumeration
  - DNS import and CCIP-read resolver authoring
- excluded from first-class symbol coverage in this pack:
  - ENS subgraph query helpers
  - custom resolver implementation APIs
  - raw Name Wrapper fuse-encoding utilities

## Public Surface Area

### Client Setup

#### createEnsPublicClient
**Kind:** function

**Summary:** Creates an ENS-aware viem public client with ENS public and subgraph actions attached.

**Definition**
```ts
export declare const createEnsPublicClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts>(
  config: EnsPublicClientConfig<TTransport, TChain>
) => EnsPublicClient<TTransport, ChainWithEns<TChain>>;
```

**Guidance**
- Use this as the default read client for resolution, pricing, and resolver inspection.
- The created client exposes ENS public actions directly as methods.
- Pair it with `http()` for ordinary server or browser reads.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/clients/public.d.ts`
- Docs: `https://docs.ens.domains/web/quickstart`

#### createEnsWalletClient
**Kind:** function

**Summary:** Creates an ENS-aware viem wallet client with ENS write actions attached.

**Definition**
```ts
export declare const createEnsWalletClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts, TAccountOrAddress extends Account | Address | undefined = undefined>(
  config: EnsWalletClientConfig<TTransport, TChain, TAccountOrAddress>
) => EnsWalletClient<TTransport, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>;
```

**Guidance**
- Use this for registration, renewal, record writes, resolver changes, and wrapper operations.
- The client must have a supported chain and wallet transport.
- Keep write flows chain-aware because primary-name and resolver semantics are chain-sensitive.

**Example**
```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/clients/wallet.d.ts`

#### normalise
**Kind:** function

**Summary:** Canonicalizes an ENS name using the ENSIP-15 normalization rules.

**Definition**
```ts
export declare const normalise: (name: string) => string;
```

**Guidance**
- Normalize any user-provided name before manual hashing, comparison, or direct protocol interaction.
- Expect normalization to throw on invalid or spoof-prone names.
- ENSjs handles this internally for many flows, but manual boundaries still need it.

**Example**
```ts
import { normalise } from "@ensdomains/ensjs/utils";

const name = normalise("RaFFY🚴‍♂️.eTh");
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/utils/normalise.d.ts`
- Docs: `https://docs.ens.domains/resolution/names`

### Resolution And Verification

#### getAddressRecord
**Kind:** function

**Summary:** Resolves a specific coin or chain address record for a name.

**Definition**
```ts
export type GetAddressRecordParameters = Prettify<InternalGetAddrParameters & {
  gatewayUrls?: string[];
}>;

declare const getAddressRecord: (
  client: ClientWithEns,
  params: GetAddressRecordParameters
) => Promise<GetAddressRecordReturnType>;
```

**Guidance**
- Treat all dot-separated strings as potential ENS names; do not limit user input to `.eth`.
- Use the correct coin or chain-specific address record when a task is chain-bound.
- Forward resolution is only half of verified primary-name handling; reverse lookups still need matching.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const record = await client.getAddressRecord({
  name: "ens.eth",
  coin: "ETH",
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getAddressRecord.d.ts`
- Docs: `https://docs.ens.domains/web/resolution`

#### getName
**Kind:** function

**Summary:** Performs reverse lookup for an address and returns primary-name verification metadata.

**Definition**
```ts
export type GetNameParameters = {
  address: Address;
  coinType?: number;
  chainId?: number;
  allowMismatch?: boolean;
  strict?: boolean;
  gatewayUrls?: string[];
};

export type GetNameReturnType = {
  name: string;
  match: boolean;
  reverseResolverAddress: Address;
  resolverAddress: Address;
};

declare const getName: (
  client: ClientWithEns,
  params: GetNameParameters
) => Promise<GetNameReturnType>;
```

**Guidance**
- Do not trust reverse resolution alone. The `match` signal is the safety-critical part of primary-name handling.
- Use `coinType` or `chainId` when you need chain-specific primary-name verification on supported chains.
- If the name does not forward-resolve back to the original address, display the address instead of the reverse name.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const primary = await client.getName({
  address: "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
});

if (!primary.match) {
  console.log("Display the address instead");
}
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getName.d.ts`
- Docs: `https://docs.ens.domains/web/reverse`

#### getResolver
**Kind:** function

**Summary:** Returns the resolver contract address currently configured for a name.

**Definition**
```ts
export type GetResolverParameters = {
  name: string;
};

declare const getResolver: (
  client: ClientWithEns,
  params: GetResolverParameters
) => Promise<Address | null>;
```

**Guidance**
- Resolver lookup is a prerequisite for safe record mutation and resolver troubleshooting.
- Resolver addresses are configuration, not stable constants. Avoid hardcoding them.
- A null resolver means there is no resolver configured for that name on the current resolution path.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const resolver = await client.getResolver({ name: "ens.eth" });
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getResolver.d.ts`
- Docs: `https://docs.ens.domains/resolvers/interacting`

#### getSupportedInterfaces
**Kind:** function

**Summary:** Checks whether a resolver or other contract supports a set of interface IDs.

**Definition**
```ts
export type GetSupportedInterfacesParameters<TInterfaces extends readonly Hex[]> = {
  address: Address;
  interfaces: TInterfaces;
};

declare const getSupportedInterfaces: <const TInterfaces extends readonly Hex[]>(
  client: ClientWithEns,
  params: GetSupportedInterfacesParameters<TInterfaces>
) => Promise<GetSupportedInterfacesReturnType<TInterfaces>>;
```

**Guidance**
- Run interface checks before attempting resolver writes such as text, multicoin, or contenthash updates.
- Use the returned booleans as capability signals, not assumptions.
- This is the safe bridge between ENSjs convenience flows and resolver-specific feature detection.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const [supportsAddr, supportsText] = await client.getSupportedInterfaces({
  address: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
  interfaces: ["0xf1cb7e06", "0x59d1d43c"],
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getSupportedInterfaces.d.ts`
- Docs: `https://docs.ens.domains/resolvers/interacting`

### Registration And Renewal

#### getAvailable
**Kind:** function

**Summary:** Checks whether an `.eth` second-level name is available to register.

**Definition**
```ts
export type GetAvailableParameters = {
  name: string;
};

declare const getAvailable: (
  client: ClientWithEns,
  params: GetAvailableParameters
) => Promise<boolean>;
```

**Guidance**
- This is only for `.eth` second-level registration availability, not arbitrary ENS name existence.
- Query availability immediately before commit or register steps to reduce stale assumptions.
- Combine it with pricing and commitment timing, not as a standalone registration guarantee.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const available = await client.getAvailable({ name: "example.eth" });
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getAvailable.d.ts`
- Docs: `https://docs.ens.domains/registry/eth`

#### getPrice
**Kind:** function

**Summary:** Returns the base and premium pricing for one or more names over a given duration.

**Definition**
```ts
export type GetPriceParameters = {
  nameOrNames: string | string[];
  duration: bigint | number;
};

export type GetPriceReturnType = {
  base: bigint;
  premium: bigint;
};

declare const getPrice: (
  client: ClientWithEns,
  params: GetPriceParameters
) => Promise<GetPriceReturnType>;
```

**Guidance**
- Registration and renewal flows should budget for `base + premium` and then add a small buffer before sending value.
- Premium pricing matters around expiry and temporary premium auctions.
- Avoid exact-value writes when the docs or examples show a pricing headroom buffer.

**Example**
```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const { base, premium } = await client.getPrice({
  nameOrNames: "example.eth",
  duration: 31_536_000,
});

const value = ((base + premium) * 110n) / 100n;
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getPrice.d.ts`
- Docs: `https://docs.ens.domains/registry/eth`

#### registerName
**Kind:** function

**Summary:** Registers a `.eth` name after the commit-reveal prerequisites are satisfied.

**Definition**
```ts
export type RegisterNameDataParameters = RegistrationParameters & {
  value: bigint;
};

declare function registerName(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: RegisterNameParameters<ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- Registration requires the full commit-reveal flow, not just the final `registerName` write.
- Compute price first, then add a buffer to the sent `value`.
- Keep resolver setup, record seeding, reverse record creation, and fuse decisions explicit at registration time.

**Example**
```ts
import { createEnsPublicClient, createEnsWalletClient } from "@ensdomains/ensjs";
import { commitName, randomSecret } from "@ensdomains/ensjs/utils";
import { custom, http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

const params = {
  name: "example.eth",
  owner: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
  duration: 31_536_000,
  secret: randomSecret(),
};

await wallet.commitName(params);
const { base, premium } = await client.getPrice({
  nameOrNames: params.name,
  duration: params.duration,
});
const value = ((base + premium) * 110n) / 100n;

await wallet.registerName({ ...params, value });
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/registerName.d.ts`
- Docs: `https://docs.ens.domains/registry/eth`

#### renewNames
**Kind:** function

**Summary:** Renews one or more `.eth` names for a specified duration.

**Definition**
```ts
export type RenewNamesDataParameters = {
  nameOrNames: string | string[];
  duration: bigint | number;
  referrer?: Hex;
  value: bigint;
};

declare function renewNames(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: RenewNamesParameters<ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- Renewal still needs a computed `value`, not just a duration.
- You can batch multiple names through `nameOrNames`.
- Use the current pricing result near the write so your sent value stays aligned with premium conditions.

**Example**
```ts
import { createEnsPublicClient, createEnsWalletClient } from "@ensdomains/ensjs";
import { custom, http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

const duration = 31_536_000;
const { base, premium } = await client.getPrice({
  nameOrNames: "example.eth",
  duration,
});

await wallet.renewNames({
  nameOrNames: "example.eth",
  duration,
  value: ((base + premium) * 110n) / 100n,
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/renewNames.d.ts`
- Docs: `https://docs.ens.domains/registry/eth`

### Record Writes And Primary Names

#### setPrimaryName
**Kind:** function

**Summary:** Sets the reverse record side of a primary-name mapping for the active account or a specific address.

**Definition**
```ts
export type SetPrimaryNameDataParameters = {
  name: string;
  address?: Address;
  resolverAddress?: Address;
};

declare function setPrimaryName(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: SetPrimaryNameParameters<ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- This is only one side of a valid primary name. The name must also forward-resolve to the same address on the relevant chain.
- Use default reverse plus default EVM address for broad fallback behavior when appropriate.
- Be explicit about chain semantics for L2 primary names.

**Example**
```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

await wallet.setPrimaryName({
  name: "example.eth",
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/setPrimaryName.d.ts`
- Docs: `https://docs.ens.domains/web/reverse`

#### setRecords
**Kind:** function

**Summary:** Sets multiple resolver records for a name in a single ENSjs wallet action.

**Definition**
```ts
export type SetRecordsDataParameters = {
  name: string;
  resolverAddress: Address;
} & RecordOptions;

declare function setRecords(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: SetRecordsParameters<ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- Resolve the current resolver first, then confirm it supports the interfaces you need before writing.
- Only the effective manager can update resolver-backed records.
- `setRecords` is the high-level ENSjs path for batched updates to text, coin, contenthash, and ABI-style data.

**Example**
```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

await wallet.setRecords({
  name: "example.eth",
  resolverAddress: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
  texts: [{ key: "com.twitter", value: "@ensdomains" }],
  coins: [{ coin: "ETH", value: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7" }],
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/setRecords.d.ts`
- Docs: `https://docs.ens.domains/resolvers/interacting`

### Name Wrapper Operations

#### wrapName
**Kind:** function

**Summary:** Wraps a name into the ENS Name Wrapper and optionally burns fuses during the operation.

**Definition**
```ts
export type WrapNameDataParameters<TName extends string> = {
  name: TName;
  newOwnerAddress: Address;
  fuses?: EncodeChildFusesInputObject;
  resolverAddress?: Address;
};

declare function wrapName(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: WrapNameParameters<string, ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- Wrapping changes the ownership and permission model. Do not treat it as a cosmetic step.
- Fuses are intentionally restrictive and often irreversible once burned.
- Decide up front whether you want plain-name management or wrapped-name guarantees and restrictions.

**Example**
```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

await wallet.wrapName({
  name: "example.eth",
  newOwnerAddress: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/wrapName.d.ts`
- Docs: `https://docs.ens.domains/wrapper/overview`

#### unwrapName
**Kind:** function

**Summary:** Removes a name from the Name Wrapper and returns direct name ownership back to the specified recipient(s).

**Definition**
```ts
export type UnwrapNameDataParameters<TName extends string> = {
  name: TName;
  newOwnerAddress: Address;
  newRegistrantAddress?: Address;
};

declare function unwrapName(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: UnwrapNameParameters<string, ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- `.eth` second-level unwrap flows can require a registrant recipient in addition to the owner recipient.
- Unwrap only when the wrapped-name model is no longer the right fit for the task.
- Be careful not to lose the guarantees or permissions encoded by the wrapped state.

**Example**
```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

await wallet.unwrapName({
  name: "example.eth",
  newOwnerAddress: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
  newRegistrantAddress: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
});
```

**Source Notes**
- Source: `npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/unwrapName.d.ts`
- Docs: `https://docs.ens.domains/wrapper/overview`

## Decision Rules
- Use ENSjs clients first for standard app integration; drop to low-level contracts only when the task genuinely escapes ENSjs coverage.
- Treat reverse lookup results as display candidates, not trusted primary names, until forward verification succeeds.
- Resolve or inspect the resolver before record writes, then capability-check the interfaces you intend to use.
- Normalize names before manual hashing, comparison, or low-level protocol calls.
- Add a pricing buffer for registration and renewal writes instead of sending the exact current quote.
- Treat wrapping as a real authority-model decision, not a default step.

## Common Confusions
- `.eth` is not the whole ENS namespace. User input should not be filtered to `.eth` only.
- Reverse records are not equivalent to verified primary names.
- The public resolver is the common default, not a universal guarantee across all names.
- ENS resolution starts on Ethereum Mainnet even when chain-specific records are involved later.
- Wrapped-name ownership semantics differ from unwrapped registry-manager semantics.

## Failure Modes
- reverse lookup returns a name but `match` is false:
  - cause: the reverse record exists, but the name does not forward-resolve back to the same address on the relevant chain
  - response: display the address or fix the forward record before treating it as a primary name
- record update fails on a custom resolver:
  - cause: resolver interface is unsupported or the connected account is not the effective manager
  - response: inspect the resolver, check interface support, and confirm ownership/manager state
- registration or renewal write underpays:
  - cause: stale price quote or no buffer added to `base + premium`
  - response: refresh price close to the write and add headroom
- wrap or unwrap changes authority unexpectedly:
  - cause: the task ignored Name Wrapper state and fuse implications
  - response: inspect wrapped state and permissions before changing wrapper state

## References
- ENS dapp docs: https://docs.ens.domains/web
- Address lookup: https://docs.ens.domains/web/resolution
- Primary names: https://docs.ens.domains/web/reverse
- Resolver interaction: https://docs.ens.domains/resolvers/interacting
- Public resolver: https://docs.ens.domains/resolvers/public
- Name processing: https://docs.ens.domains/resolution/names
- ETH registrar: https://docs.ens.domains/registry/eth
- Name wrapper overview: https://docs.ens.domains/wrapper/overview
- ENSjs package: npm:@ensdomains/ensjs@4.2.2
