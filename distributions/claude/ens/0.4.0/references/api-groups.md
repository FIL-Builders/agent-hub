# ENS API Groups

### ENSjs Client Setup
**Exports**
- createEnsPublicClient
- createEnsWalletClient
- normalise

Core setup and preprocessing primitives for reading ENS data, sending ENS write
transactions, and safely canonicalizing names before low-level processing.

#### createEnsPublicClient
**Kind**
function

**Summary**
Creates an ENS-aware viem public client with ENS public and subgraph actions attached.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/clients/public.d.ts

```ts
export declare const createEnsPublicClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts>(
  config: EnsPublicClientConfig<TTransport, TChain>
) => EnsPublicClient<TTransport, ChainWithEns<TChain>>;
```

**Guidance**
- Use this as the default read client for resolution, pricing, resolver inspection, and other non-mutating ENS operations.
- The returned client exposes ENS read helpers directly as methods, so the public-surface functions can be called through the client instance.
- Keep the selected chain explicit and version-appropriate for the task; ENS resolution starts from Mainnet, but chain-specific address and primary-name semantics still matter.

**Example**
Language: typescript

```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

export const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});
```

#### createEnsWalletClient
**Kind**
function

**Summary**
Creates an ENS-aware viem wallet client with ENS write actions attached.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/clients/wallet.d.ts

```ts
export declare const createEnsWalletClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts, TAccountOrAddress extends Account | Address | undefined = undefined>(
  config: EnsWalletClientConfig<TTransport, TChain, TAccountOrAddress>
) => EnsWalletClient<TTransport, CheckedChainWithEns<TChain>, ParseAccount<TAccountOrAddress>>;
```

**Guidance**
- Use this for registration, renewal, reverse-record changes, resolver-backed record updates, and wrapper operations.
- Ordinary writes should happen through this client instead of hand-writing raw contract calldata unless the task requires a low-level escape hatch.
- Keep the wallet chain aligned with the write target and make chain-specific primary-name behavior explicit in your UX and logic.

**Example**
Language: typescript

```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { mainnet } from "viem/chains";

export const ensWallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
```

#### normalise
**Kind**
function

**Summary**
Canonicalizes a name using the ENSIP-15 normalization algorithm.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/utils/normalise.d.ts

```ts
export declare const normalise: (name: string) => string;
```

**Guidance**
- Normalize names before manual hashing, comparison, or direct resolver and contract interaction.
- Expect invalid or spoof-prone names to fail normalization; that failure is a validation signal, not a nuisance to suppress.
- ENSjs handles normalization internally for many common operations, but the boundary still matters when debugging or mixing in lower-level tools.

**Example**
Language: typescript

```ts
import { normalise } from "@ensdomains/ensjs/utils";

const canonicalName = normalise("RaFFY🚴‍♂️.eTh");
```

### Resolution And Verified Primary Names
**Exports**
- getAddressRecord
- getName
- getResolver
- getSupportedInterfaces

Read-side primitives for forward resolution, reverse resolution, verified
primary-name handling, and safe resolver capability checks.

#### getAddressRecord
**Kind**
function

**Summary**
Resolves a specific address record for a name and coin or chain context.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getAddressRecord.d.ts

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
- Treat all dot-separated strings as potential ENS names; the ENS docs explicitly warn against assuming only `.eth` names matter.
- Forward resolution is the correct first step when the user enters a name for sending, labeling, or account lookup.
- For chain-specific address display or verification, request the appropriate coin or chain-specific record instead of assuming the Ethereum Mainnet address applies everywhere.

**Example**
Language: typescript

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

#### getName
**Kind**
function

**Summary**
Performs reverse lookup for an address and returns primary-name verification metadata.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getName.d.ts

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
- Do not trust reverse resolution alone; the official ENS docs make forward verification mandatory before displaying a primary name.
- Treat the returned `match` flag as the safety-critical field. If it is false, fall back to displaying the raw address.
- Use `coinType` or `chainId` for chain-specific primary-name verification when the task targets L2 or multichain address contexts.

**Example**
Language: typescript

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

const display = primary.match ? primary.name : "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5";
```

#### getResolver
**Kind**
function

**Summary**
Returns the resolver address currently configured for a name.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getResolver.d.ts

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
- Resolver discovery is the prerequisite for safe record troubleshooting and record mutation.
- Do not hardcode public resolver addresses into general ENS logic; the docs explicitly call this out as unsafe.
- A null result means the name does not currently have a resolver on the active path, not that ENS itself failed.

**Example**
Language: typescript

```ts
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const resolverAddress = await client.getResolver({ name: "ens.eth" });
```

#### getSupportedInterfaces
**Kind**
function

**Summary**
Checks which interface IDs a resolver or other ENS-adjacent contract actually supports.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getSupportedInterfaces.d.ts

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
- Run interface checks before attempting record writes such as text, multicoin, or contenthash updates.
- The public resolver is common, but custom resolvers exist, so feature support is not universal.
- Use this as the boundary between convenient ENSjs helpers and protocol reality on arbitrary resolver contracts.

**Example**
Language: typescript

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

### Registration And Renewal
**Exports**
- getAvailable
- getPrice
- commitName
- registerName
- renewNames

Registration-side primitives for `.eth` availability, price discovery,
commit-reveal sequencing, and renewal.

#### getAvailable
**Kind**
function

**Summary**
Checks whether an `.eth` second-level name is available to register.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getAvailable.d.ts

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
- This applies to `.eth` second-level registration, not to arbitrary ENS names or general name existence.
- Availability is a check, not a reservation; re-check close to commit and register steps.
- Use it together with pricing and commit-reveal timing instead of treating it as a full registration workflow.

**Example**
Language: typescript

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

#### getPrice
**Kind**
function

**Summary**
Returns the base and premium pricing components for registering or renewing one or more names.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/public/getPrice.d.ts

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
- Use `base + premium` as the actual pricing input for registration and renewal value calculation.
- Add a buffer rather than sending the exact quote; the ENS docs and ENSjs examples both use pricing headroom.
- Premium behavior matters around expiry and temporary premium periods, so keep renewal and recovery flows explicit about timing.

**Example**
Language: typescript

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

#### commitName
**Kind**
function

**Summary**
Submits the commitment transaction that starts the `.eth` commit-reveal registration flow.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/commitName.d.ts

```ts
export type CommitNameDataParameters = RegistrationParameters;

declare function commitName(
  wallet: ClientWithAccount<Transport, ChainWithEns, Account | undefined>,
  params: CommitNameParameters<ChainWithEns, Account | undefined, ChainWithEns | undefined>
): Promise<Hash>;
```

**Guidance**
- Registration is not complete after `commitName`; the task must still wait for the reveal window and then call `registerName`.
- Generate a fresh secret per registration flow and keep it paired with the eventual register call.
- This is the correct first write in the ENSjs registration sequence for `.eth` second-level names.

**Example**
Language: typescript

```ts
import { createEnsWalletClient } from "@ensdomains/ensjs";
import { randomSecret } from "@ensdomains/ensjs/utils";
import { custom } from "viem";
import { mainnet } from "viem/chains";

const wallet = createEnsWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

const secret = randomSecret();

await wallet.commitName({
  name: "example.eth",
  owner: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
  duration: 31_536_000,
  secret,
});
```

#### registerName
**Kind**
function

**Summary**
Finalizes a `.eth` registration after a valid commitment and sufficient payment.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/registerName.d.ts

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
- `registerName` is the reveal and finalization step; calling it without the valid commitment flow is incorrect.
- Compute the current price, add a buffer, and pass that buffered amount as `value`.
- Keep resolver choice, seeded records, reverse record behavior, and any wrapping intent explicit at registration time.

**Example**
Language: typescript

```ts
import { createEnsPublicClient, createEnsWalletClient } from "@ensdomains/ensjs";
import { randomSecret } from "@ensdomains/ensjs/utils";
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

const secret = randomSecret();
const params = {
  name: "example.eth",
  owner: "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
  duration: 31_536_000,
  secret,
};

await wallet.commitName(params);
const { base, premium } = await client.getPrice({
  nameOrNames: params.name,
  duration: params.duration,
});

await wallet.registerName({
  ...params,
  value: ((base + premium) * 110n) / 100n,
});
```

#### renewNames
**Kind**
function

**Summary**
Renews one or more `.eth` names for a specified duration using a value-backed write.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/renewNames.d.ts

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
- Renewal still depends on current pricing; always recalculate `value` close to the write.
- Use array input when the task is batch renewal rather than looping name-by-name without reason.
- Renewal and registration both sit on the registrar side of ENS, so they do not replace record or resolver management.

**Example**
Language: typescript

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

### Records And Primary-Name Writes
**Exports**
- setPrimaryName
- setRecords

Write-side helpers for maintaining the reverse-record side of primary names and
updating resolver-backed records through ENSjs.

#### setPrimaryName
**Kind**
function

**Summary**
Sets the reverse-record side of a primary name for the active account or a specified address.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/setPrimaryName.d.ts

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
- Setting a reverse record does not by itself create a valid primary name; forward resolution must still match on the relevant chain.
- Keep chain-specific primary-name semantics explicit, especially when the task involves Base, OP Mainnet, Arbitrum One, Scroll, or Linea.
- Prefer safe, user-consented flows because changing a displayed primary name is user-visible identity state.

**Example**
Language: typescript

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

#### setRecords
**Kind**
function

**Summary**
Sets multiple resolver records for a name in one ENSjs wallet action.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/setRecords.d.ts

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
- Resolve the current resolver first and capability-check it before assuming the write will succeed.
- Only the effective manager can update records; wrapper state can change who that is.
- Use this for batched updates to text, multicoin, contenthash, and related resolver-backed records instead of hand-encoding record writes when the task stays within ENSjs coverage.

**Example**
Language: typescript

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

### Name Wrapper Operations
**Exports**
- wrapName
- unwrapName

Explicit wrapper-state operations for switching between plain-name management
and Name Wrapper ownership plus fuse semantics.

#### wrapName
**Kind**
function

**Summary**
Wraps a name into the ENS Name Wrapper and optionally applies fuse settings during the transition.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/wrapName.d.ts

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
- Wrapping changes the authority model and introduces fuse semantics, so it should be a deliberate product and protocol decision.
- Do not present wrapping as the default for ordinary read or record-update flows.
- For `.eth` second-level names and subnames, think through who should control future permissions before burning fuses.

**Example**
Language: typescript

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

#### unwrapName
**Kind**
function

**Summary**
Unwraps a wrapped name and returns direct ownership or registrant control to the specified recipients.

**Definition**
Language: typescript
Source: npm:@ensdomains/ensjs@4.2.2/dist/functions/wallet/unwrapName.d.ts

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
- Unwrapping is the inverse authority change to wrapping; it should not be treated as a harmless formatting step.
- `.eth` second-level names can need both owner and registrant recipients on unwrap.
- Unwrap only when the task actually wants to leave the wrapped-name permission model behind.

**Example**
Language: typescript

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
