# Pyth Documentation Pack

## Snapshot
- library name: pyth
- version or version range: current-docs + client^2.22.1 + hermes^3.1.0 + pyth-sdk-solidity^4.3.1 + entropy-sdk-solidity^2.2.1 + express-relay-js^0.29.0 + pyth-lazer-sdk^6.0.0
- primary language: typescript
- homepage or canonical docs URL: https://docs.pyth.network
- short description: Pyth is a data platform whose current developer surface spans off-chain price delivery, on-chain price verification and consumption, randomness, searcher auctions, low-latency market data, and lower-level Pythnet account access.
- source set summary: official Pyth docs, `npm:@pythnetwork/client@2.22.1`, `npm:@pythnetwork/hermes-client@3.1.0`, `npm:@pythnetwork/pyth-sdk-solidity@4.3.1`, `npm:@pythnetwork/entropy-sdk-solidity@2.2.1`, `npm:@pythnetwork/express-relay-js@0.29.0`, `npm:@pythnetwork/pyth-lazer-sdk@6.0.0`, and the prior AgentHub Pyth pack for coverage audit only

## What This Library Is For
Pyth is used to deliver market data off-chain, verify and consume those updates on-chain, request secure randomness, participate in auction-style searcher flows, and subscribe to low-latency streaming feeds. The current developer surface is not one single API. It is a platform surface with several distinct products that must stay separated in an agent's mental model.

## Installation And Setup
- install commands:
  - `npm install @pythnetwork/hermes-client`
  - `npm install @pythnetwork/client`
  - `npm install @pythnetwork/express-relay-js`
  - `npm install @pythnetwork/pyth-lazer-sdk`
  - `npm install @pythnetwork/pyth-sdk-solidity`
  - `npm install @pythnetwork/entropy-sdk-solidity`
- environment prerequisites:
  - JavaScript or TypeScript runtime for Hermes, Pythnet, Express Relay, and Lazer integrations
  - EVM toolchain for `@pythnetwork/pyth-sdk-solidity` and `@pythnetwork/entropy-sdk-solidity`
  - RPC access or hosted endpoints appropriate to the product surface
- configuration prerequisites:
  - explicit endpoint selection for Hermes and Lazer
  - correct chain-specific contract addresses for EVM verification or Entropy use
  - authentication or API access where the hosted surface requires it
- minimum setup example:

```ts
import { HermesClient } from "@pythnetwork/hermes-client";

const hermes = new HermesClient("https://hermes.pyth.network", {
  timeout: 10_000,
});
```

## Core Concepts

### Delivery is not the same as verification
- Hermes and Lazer deliver update payloads or streaming data off-chain.
- `IPyth` methods verify or consume update payloads on-chain on supported chains.
- A fetched update payload is not the same thing as an accepted on-chain price read.

### Pyth has multiple product surfaces
- price feeds and Hermes are the ordinary market-data surface
- `@pythnetwork/client` is a lower-level Pythnet/Solana account reader
- Entropy is randomness
- Express Relay is a searcher and auction surface
- Lazer is low-latency data delivery

### Fees and freshness are first-class
- EVM update submission requires `getUpdateFee(...)`.
- Entropy requests require `getFeeV2(...)`.
- Pyth price reads must explicitly guard freshness or publish-time windows.
- Low-latency streams still require application-level trust and verification choices.

## Version Delta Audit
- prior pack target: Entropy, Express Relay, and Lazer only, with an older, narrower Pyth mental model
- current target: broader Pyth platform surface including Hermes price delivery, EVM verification and consumption, lower-level Pythnet account access, refreshed Entropy, refreshed Express Relay, and refreshed Lazer
- stale assumption to avoid: "Pyth" meaning only randomness, MEV, or low-latency verification workflows
- replacement pattern: treat Hermes plus EVM verification as the primary ordinary price-feed path, then model Entropy, Express Relay, and Lazer as separate product surfaces
- stale assumption to avoid: off-chain retrieval and on-chain verification being interchangeable
- replacement pattern: fetched updates are transport artifacts; on-chain verification and freshness checks are separate decisions
- stale assumption to avoid: older Express Relay examples built around `signOpportunityBid` or `submitOpportunityBid`
- replacement pattern: current `@pythnetwork/express-relay-js@0.29.0` surfaces center on `Client`, subscription, quotes, and bid submission methods present in the package types

## Ecosystem Boundaries
- core price-feed delivery:
  - Hermes
  - `@pythnetwork/hermes-client`
  - official feed IDs and price metadata docs
- on-chain consumption:
  - `@pythnetwork/pyth-sdk-solidity`
  - contract addresses and best-practices docs
- lower-level Pythnet account reading:
  - `@pythnetwork/client`
  - Solana/Pythnet account parsing and streaming
- separate product surfaces:
  - Entropy
  - Express Relay
  - Lazer
- out of scope as first-class coverage:
  - chain-specific wrappers not anchored in the listed packages
  - generic "oracle" abstractions that flatten Pyth's fee, freshness, and verification behavior

## Decision Rules
- Use `HermesClient` for ordinary off-chain price-feed discovery and update retrieval.
- Use `IPyth` plus Hermes-delivered update payloads when an EVM contract must verify or consume Pyth updates on-chain.
- Use `getPriceNoOlderThan` rather than `getPriceUnsafe` when the application needs freshness guarantees.
- Use `updatePriceFeedsIfNecessary` when the caller already tracks publish times and wants an early rejection path to save gas.
- Use `@pythnetwork/client` only when the integration actually needs direct Pythnet account access or Solana-style streaming; otherwise prefer Hermes.
- Use Entropy only for randomness workflows; do not mix it into price-feed guidance.
- Use Express Relay only for auction, quote, or searcher flows; do not present it as a generic routing or oracle API.
- Use Lazer only when the application truly needs low-latency stream delivery and can handle the operational complexity that comes with it.

## Preconditions And Invariants
- Hermes methods operate on price IDs or metadata queries and return off-chain data; they do not themselves verify anything on-chain.
- EVM contract calls that submit updates must attach the exact update fee and use chain-correct Pyth contract addresses.
- `getPriceUnsafe` may return arbitrarily stale data; freshness checks are the caller's job unless the safer `NoOlderThan` variants are used.
- Entropy request callbacks must be gas-bounded and should store sequence numbers for correlation.
- Express Relay flows are asynchronous and require chain scoping, status handling, and permission-aware bidding logic.
- Lazer subscriptions require authenticated access and should be treated as operational streaming infrastructure, not a fire-and-forget helper.

## Public Surface Area

### Hermes and ordinary price delivery

#### HermesClient
**Kind:** class

**Summary:** Client for Hermes HTTP and SSE endpoints that fetches feed metadata and serialized update payloads.

**Definition**
```ts
export declare class HermesClient {
    constructor(endpoint: string, config?: HermesClientConfig);
    getPriceFeeds({ fetchOptions, ...options }?: {
        query?: string;
        assetType?: AssetType;
        fetchOptions?: RequestInit;
    }): Promise<PriceFeedMetadata[]>;
    getLatestPriceUpdates(ids: HexString[], options?: {
        encoding?: EncodingType;
        parsed?: boolean;
        ignoreInvalidPriceIds?: boolean;
    }, fetchOptions?: RequestInit): Promise<PriceUpdate>;
    getPriceUpdatesAtTimestamp(publishTime: UnixTimestamp, ids: HexString[], options?: {
        encoding?: EncodingType;
        parsed?: boolean;
        ignoreInvalidPriceIds?: boolean;
    }, fetchOptions?: RequestInit): Promise<PriceUpdate>;
    getPriceUpdatesStream(ids: HexString[], options?: {
        encoding?: EncodingType;
        parsed?: boolean;
        allowUnordered?: boolean;
        benchmarksOnly?: boolean;
        ignoreInvalidPriceIds?: boolean;
    }): Promise<EventSource>;
}
```

**Guidance**
- Treat Hermes as the default off-chain delivery surface for current Pyth price updates.
- Prefer private or provider-backed endpoints for reliability-sensitive workloads; the package README explicitly recommends this over the free public endpoint.
- Decide up front whether your flow needs metadata discovery, latest updates, timestamp-scoped updates, or streaming updates.

**Example**
```ts
import { HermesClient } from "@pythnetwork/hermes-client";

const hermes = new HermesClient("https://hermes.pyth.network", {
  timeout: 10_000,
});

const updates = await hermes.getLatestPriceUpdates([
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
], { encoding: "hex" });
```

**Source Notes**
- Source: `npm:@pythnetwork/hermes-client@3.1.0:dist/cjs/hermes-client.d.ts`
- Source: `npm:@pythnetwork/hermes-client@3.1.0:README.md`

#### IPyth
**Kind:** interface

**Summary:** Solidity interface for verifying and consuming Pyth updates on-chain on supported EVM deployments.

**Definition**
```solidity
interface IPyth is IPythEvents {
    function getPriceUnsafe(bytes32 id) external view returns (PythStructs.Price memory price);
    function getPriceNoOlderThan(bytes32 id, uint age) external view returns (PythStructs.Price memory price);
    function updatePriceFeeds(bytes[] calldata updateData) external payable;
    function updatePriceFeedsIfNecessary(bytes[] calldata updateData, bytes32[] calldata priceIds, uint64[] calldata publishTimes) external payable;
    function getUpdateFee(bytes[] calldata updateData) external view returns (uint feeAmount);
    function parsePriceFeedUpdates(bytes[] calldata updateData, bytes32[] calldata priceIds, uint64 minPublishTime, uint64 maxPublishTime) external payable returns (PythStructs.PriceFeed[] memory priceFeeds);
}
```

**Guidance**
- Use `IPyth` only after choosing the correct chain deployment and acquiring Hermes-delivered update payloads.
- Keep the retrieval path and the verification/consumption path separate in your code and in your mental model.
- Call `getUpdateFee` with the exact `updateData` you plan to submit.

**Example**
```solidity
uint fee = pyth.getUpdateFee(priceUpdateData);
pyth.updatePriceFeeds{ value: fee }(priceUpdateData);
PythStructs.Price memory price = pyth.getPriceNoOlderThan(priceId, 30);
```

**Source Notes**
- Source: `npm:@pythnetwork/pyth-sdk-solidity@4.3.1:IPyth.sol`
- Source: `npm:@pythnetwork/pyth-sdk-solidity@4.3.1:README.md`

### Lower-level Pythnet account access

#### PythConnection
**Kind:** class

**Summary:** Callback-oriented reader for Pythnet account updates over a Solana web3 connection.

**Definition**
```ts
export declare class PythConnection {
    constructor(connection: Connection, pythProgramKey: PublicKey, commitment?: Commitment, feedIds?: PublicKey[]);
    start(): Promise<void>;
    onPriceChange(callback: PythPriceCallback): void;
    onPriceChangeVerbose(callback: PythVerbosePriceCallback): void;
    stop(): Promise<void>;
}
```

**Guidance**
- Reach for `PythConnection` only when you intentionally want lower-level Pythnet or Solana account access.
- Prefer Hermes for ordinary off-chain price retrieval because the package README explicitly recommends it for most use cases.
- Make callback registration and cleanup explicit; this is a long-lived streaming surface.

**Example**
```ts
import { Connection } from "@solana/web3.js";
import { PythConnection, getPythProgramKeyForCluster } from "@pythnetwork/client";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const pyth = new PythConnection(
  connection,
  getPythProgramKeyForCluster("pythnet"),
);

pyth.onPriceChange((product, price) => {
  console.log(product.symbol, price.price, price.confidence);
});

await pyth.start();
```

**Source Notes**
- Source: `npm:@pythnetwork/client@2.22.1:lib/PythConnection.d.ts`
- Source: `npm:@pythnetwork/client@2.22.1:README.md`

#### PythHttpClient
**Kind:** class

**Summary:** One-shot HTTP-style reader over a Solana connection for fetching current Pythnet account data.

**Definition**
```ts
export declare class PythHttpClient {
    constructor(connection: Connection, pythProgramKey: PublicKey, commitment?: Commitment);
    getData(): Promise<PythHttpClientResult>;
    getAssetPricesFromAccounts(priceAccounts: PublicKey[]): Promise<PriceData[]>;
}
```

**Guidance**
- Use this when your integration truly needs direct account reads from Pythnet rather than Hermes-delivered updates.
- `getData()` is a broad fetch; avoid using it as a default in latency-sensitive or narrowly scoped applications.
- Keep the Pyth program key and cluster alignment explicit.

**Example**
```ts
import { Connection } from "@solana/web3.js";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const client = new PythHttpClient(connection, getPythProgramKeyForCluster("pythnet"));
const result = await client.getData();

console.log(result.symbols.slice(0, 5));
```

**Source Notes**
- Source: `npm:@pythnetwork/client@2.22.1:lib/PythHttpClient.d.ts`

### Entropy randomness

#### IEntropyV2
**Kind:** interface

**Summary:** Solidity interface for requesting randomness, querying fees, and inspecting provider and request state.

**Definition**
```solidity
interface IEntropyV2 is EntropyEventsV2 {
    function requestV2() external payable returns (uint64 assignedSequenceNumber);
    function requestV2(uint32 gasLimit) external payable returns (uint64 assignedSequenceNumber);
    function requestV2(address provider, uint32 gasLimit) external payable returns (uint64 assignedSequenceNumber);
    function requestV2(address provider, bytes32 userRandomNumber, uint32 gasLimit) external payable returns (uint64 assignedSequenceNumber);
    function getProviderInfoV2(address provider) external view returns (EntropyStructsV2.ProviderInfo memory info);
    function getDefaultProvider() external view returns (address provider);
    function getRequestV2(address provider, uint64 sequenceNumber) external view returns (EntropyStructsV2.Request memory req);
    function getFeeV2() external view returns (uint128 feeAmount);
    function getFeeV2(uint32 gasLimit) external view returns (uint128 feeAmount);
    function getFeeV2(address provider, uint32 gasLimit) external view returns (uint128 feeAmount);
}
```

**Guidance**
- Always compute the exact fee for the exact request variant before sending the request transaction.
- Store the returned sequence number and correlate it with callback state in your own storage or events.
- Keep the security tradeoff between in-contract user randomness generation and explicit `userRandomNumber` visible in application design.

**Example**
```solidity
uint32 gasLimit = 120_000;
uint128 fee = entropy.getFeeV2(gasLimit);
uint64 seq = entropy.requestV2{ value: fee }(gasLimit);
```

**Source Notes**
- Source: `npm:@pythnetwork/entropy-sdk-solidity@2.2.1:IEntropyV2.sol`
- Source: `npm:@pythnetwork/entropy-sdk-solidity@2.2.1:README.md`

#### IEntropyConsumer
**Kind:** interface

**Summary:** Consumer-side abstract contract for validating the Entropy caller and handling callback randomness.

**Definition**
```solidity
abstract contract IEntropyConsumer {
    function _entropyCallback(uint64 sequence, address provider, bytes32 randomNumber) external;
    function getEntropy() internal view virtual returns (address);
    function entropyCallback(uint64 sequence, address provider, bytes32 randomNumber) internal virtual;
}
```

**Guidance**
- The external callback entry point is not the place to add custom authorization; it already checks the configured Entropy contract.
- Keep callback work small and deterministic to avoid gas-limit failures.
- Clear any request-tracking state before external effects.

**Example**
```solidity
contract ExampleConsumer is IEntropyConsumer {
    address internal immutable entropyAddress;
    mapping(uint64 => bool) public pending;

    constructor(address entropy_) {
        entropyAddress = entropy_;
    }

    function getEntropy() internal view override returns (address) {
        return entropyAddress;
    }

    function entropyCallback(uint64 sequence, address, bytes32 randomNumber) internal override {
        delete pending[sequence];
        _useRandomness(randomNumber);
    }

    function _useRandomness(bytes32 randomNumber) internal {}
}
```

**Source Notes**
- Source: `npm:@pythnetwork/entropy-sdk-solidity@2.2.1:IEntropyConsumer.sol`

### Express Relay searcher and quote flows

#### Client
**Kind:** class

**Summary:** Main Express Relay JavaScript client for websocket subscriptions, quote requests, and bid submission.

**Definition**
```ts
export declare class Client {
    constructor(
      clientOptions: ClientOptions,
      wsOptions?: WsOptions,
      opportunityCallback?: (opportunity: Opportunity) => Promise<void>,
      bidStatusCallback?: (statusUpdate: BidStatusUpdate) => Promise<void>,
      svmChainUpdateCallback?: (update: SvmChainUpdate) => Promise<void>,
      removeOpportunitiesCallback?: (opportunityDelete: OpportunityDelete) => Promise<void>,
      websocketCloseCallback?: () => Promise<void>
    );
    subscribeChains(chains: string[]): Promise<void>;
    unsubscribeChains(chains: string[]): Promise<void>;
    getOpportunities(chainId?: string, fromTime?: Date, limit?: number): Promise<Opportunity[]>;
    getQuote(quoteRequest: QuoteRequest): Promise<QuoteResponse>;
    submitQuote(submitQuote: SubmitQuote): Promise<VersionedTransaction>;
    submitBid(bid: Bid, subscribeToUpdates?: boolean): Promise<BidId>;
}
```

**Guidance**
- Keep Express Relay scoped to opportunity, quote, and searcher workflows instead of blending it into generic oracle access.
- Model it as an asynchronous system with subscriptions and status updates, not as a one-shot synchronous helper.
- Use the current package types as the contract source; the prior pack's older method names are not current.

**Example**
```ts
import { Client } from "@pythnetwork/express-relay-js";

const client = new Client(
  { baseUrl: process.env.EXPRESS_RELAY_URL },
  undefined,
  async (opportunity) => {
    console.log("opportunity", opportunity.program, opportunity.chainId);
  },
  async (status) => {
    console.log("bid status", status.id, status.type);
  },
);

await client.subscribeChains(["solana"]);
```

**Source Notes**
- Source: `npm:@pythnetwork/express-relay-js@0.29.0:lib/index.d.ts`
- Source: `npm:@pythnetwork/express-relay-js@0.29.0:README.md`

### Lazer low-latency delivery

#### PythLazerClient
**Kind:** class

**Summary:** Authenticated client for Lazer metadata queries, historical or latest price fetches, and live subscription streams.

**Definition**
```ts
export declare class PythLazerClient {
    static create(config: LazerClientConfig): Promise<PythLazerClient>;
    addMessageListener(handler: (event: JsonOrBinaryResponse) => void): void;
    subscribe(request: Request): void;
    unsubscribe(subscriptionId: number): void;
    send(request: Request): void;
    addAllConnectionsDownListener(handler: () => void): void;
    shutdown(): void;
    getSymbols(params?: SymbolsQueryParams): Promise<SymbolResponse[]>;
    getLatestPrice(params: LatestPriceRequest): Promise<JsonUpdate>;
    getPrice(params: PriceRequest): Promise<JsonUpdate>;
}
```

**Guidance**
- Treat Lazer as a distinct low-latency product surface with authenticated transport, subscription lifecycle, and delivery-format choices.
- Decide whether you need JSON, binary, parsed payloads, or chain-specific formats before subscribing.
- Plan operationally for redundant connections, connection-down events, and shutdown behavior.

**Example**
```ts
import { PythLazerClient } from "@pythnetwork/pyth-lazer-sdk";

const lazer = await PythLazerClient.create({
  token: process.env.PYTH_LAZER_TOKEN,
});

lazer.addMessageListener((event) => {
  console.log(event.type);
});

lazer.subscribe({
  type: "subscribe",
  subscriptionId: 1,
  symbols: ["Crypto.BTC/USD"],
  properties: ["price", "confidence"],
  formats: ["evm"],
  channel: "fixed_rate@200ms",
  parsed: true,
});
```

**Source Notes**
- Source: `npm:@pythnetwork/pyth-lazer-sdk@6.0.0:dist/cjs/client.d.ts`
- Source: `npm:@pythnetwork/pyth-lazer-sdk@6.0.0:dist/cjs/protocol.d.ts`
- Source: `npm:@pythnetwork/pyth-lazer-sdk@6.0.0:README.md`

## Deprecated And Compatibility Surface
- The prior AgentHub pack centered Pyth on Entropy, Express Relay, and Lazer only. That is no longer an adequate current mental model.
- `@pythnetwork/client` remains valid but its own README now warns that Hermes is the recommended path for most use cases.
- Older Express Relay method names from the previous pack should not be carried forward as current API contracts.

## Failure Modes And Troubleshooting Anchors
- fetched Hermes updates are treated as "final prices" without running the required on-chain verification or freshness checks
- `getPriceUnsafe` is used where an age-bounded read is required
- `getUpdateFee` or `getFeeV2` is computed for one payload or gas profile and reused for a different one
- Express Relay code assumes a synchronous request-response flow and ignores bid or websocket status handling
- Lazer subscriptions are used without handling connection-down events or subscription invalidation

## Common Confusions
- Hermes vs `@pythnetwork/client`:
  - Hermes is the current ordinary delivery path
  - `@pythnetwork/client` is the lower-level Pythnet reader
- Hermes vs `IPyth`:
  - Hermes returns update payloads
  - `IPyth` verifies or consumes updates on-chain
- price feeds vs Entropy:
  - price feeds deliver market data
  - Entropy delivers randomness
- price feeds vs Express Relay:
  - price feeds are data-delivery and verification workflows
  - Express Relay is an auction and quote workflow
- Hermes vs Lazer:
  - Hermes is the ordinary price-update service
  - Lazer is the low-latency, more operationally specialized stream surface

## Must-Not-Regress Insights
- Keep the delivery-versus-verification split explicit.
- Keep freshness and fee calculation explicit.
- Keep Entropy callback gas and sequence-number handling explicit.
- Keep Express Relay modeled as an async status-driven flow.
- Keep Lazer verification and transport choices explicit instead of reducing it to "just another websocket feed."

## References
- https://docs.pyth.network
- https://www.npmjs.com/package/@pythnetwork/client/v/2.22.1
- https://www.npmjs.com/package/@pythnetwork/hermes-client/v/3.1.0
- https://www.npmjs.com/package/@pythnetwork/pyth-sdk-solidity/v/4.3.1
- https://www.npmjs.com/package/@pythnetwork/entropy-sdk-solidity/v/2.2.1
- https://www.npmjs.com/package/@pythnetwork/express-relay-js/v/0.29.0
- https://www.npmjs.com/package/@pythnetwork/pyth-lazer-sdk/v/6.0.0
