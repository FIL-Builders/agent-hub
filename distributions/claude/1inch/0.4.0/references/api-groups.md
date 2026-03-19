# 1inch API Groups

### Current Product Surfaces
**Exports**
- BusinessSwapSurface
- ClassicSwapFlow
- FusionOrderFlow
- TransactionGatewaySurface

Current 1inch public docs are product-oriented rather than a flat list of public REST paths, so this group captures the current boundaries an agent must hold before choosing a concrete implementation path.

#### BusinessSwapSurface
**Kind**
object

**Summary**
Current 1inch swap product surface covering intent-based swaps, cross-chain swaps, and classic DEX-aggregator routing.

**Definition**
Language: json
Source: https://business.1inch.com/products/swap

```json
{
  "product": "Swap API",
  "scope": [
    "intent-based swaps",
    "cross-chain swaps",
    "classic DEX-aggregator routing"
  ],
  "supportedChains": 13,
  "integrationModel": "current 1inch Business docs surface",
  "sdkAnchor": "@1inch/fusion-sdk@2.4.6"
}
```

**Guidance**
- Use this as the top-level mental model for current 1inch swap integration, not the old public v5 Aggregation API documentation model.
- Choose a classic executable swap path when the task needs an immediately signable transaction.
- Choose a Fusion path when the task needs an intent order and auction-based settlement rather than a direct swap transaction.
- Keep chain support and product boundaries explicit in generated code and guidance.

**Example**
Language: typescript
Description: Route a task into the right 1inch product boundary before choosing a concrete API shape.

```ts
type OneInchSwapMode = "classic-execution" | "fusion-order";

function chooseOneInchMode(input: {
  needsImmediateTransaction: boolean;
  wantsIntentSettlement: boolean;
}): OneInchSwapMode {
  if (input.wantsIntentSettlement) return "fusion-order";
  return "classic-execution";
}
```

#### ClassicSwapFlow
**Kind**
workflow

**Summary**
Current classic 1inch swap flow for route discovery, approval or permit handling, executable transaction building, and wallet or gateway submission.

**Definition**
Language: json
Source: https://docs.1inch.io/

```json
{
  "flow": [
    "authenticate against the current 1inch docs surface when required",
    "discover a route or quote for the locked chain and token pair",
    "check allowance or attach permit when token spend authorization is required",
    "request an executable swap transaction payload",
    "submit through a wallet, RPC, or a separate transaction-broadcast layer"
  ],
  "boundary": "quote discovery and transaction execution are separate stages"
}
```

**Guidance**
- Do not present quote discovery as if it were directly executable on-chain.
- Keep spender lookup, approval handling, and final transaction submission explicit in the flow.
- Treat current classic swap REST details as portal-defined; re-open the live docs when a task needs exact endpoint shapes or auth requirements.
- Prefer direct wallet or RPC submission unless the system intentionally wants the separate transaction-broadcast product.

**Example**
Language: typescript
Description: Model classic swap integration as an explicit staged workflow.

```ts
type ClassicSwapStage =
  | "route"
  | "authorization"
  | "build-executable-transaction"
  | "broadcast";

const classicSwapFlow: ClassicSwapStage[] = [
  "route",
  "authorization",
  "build-executable-transaction",
  "broadcast",
];
```

#### FusionOrderFlow
**Kind**
workflow

**Summary**
Fusion mode workflow built around quote retrieval, order creation, signed order submission, and later order-status monitoring.

**Definition**
Language: json
Source: npm:@1inch/fusion-sdk@2.4.6:package/README.md

```json
{
  "flow": [
    "instantiate FusionSDK with url, network, and auth",
    "request a quote",
    "create an order from OrderParams",
    "submit the order with quoteId",
    "monitor status or events until filled, expired, or cancelled"
  ],
  "hostedUrl": "https://api.1inch.dev/fusion",
  "hostedWsUrl": "wss://api.1inch.dev/fusion/ws"
}
```

**Guidance**
- Use Fusion when the task calls for intent-based settlement or order lifecycle tracking instead of an immediate direct swap transaction.
- Treat `quoteId` as part of the order-submission path, not a disposable quote-only field.
- Keep `walletAddress`, `network`, and signer configuration aligned; mismatches turn into hard order-placement failures.
- Explain clearly that submitting a Fusion order is not the same thing as broadcasting an EVM transaction to a public mempool.

**Example**
Language: typescript
Description: High-level Fusion lifecycle.

```ts
const fusionFlow = [
  "getQuote",
  "createOrder",
  "submitOrder",
  "getOrderStatus",
];
```

#### TransactionGatewaySurface
**Kind**
object

**Summary**
Current 1inch transaction-broadcast product surface for sending signed transactions, including private-mempool-oriented broadcasting.

**Definition**
Language: json
Source: https://business.1inch.com/products/tx-gateway

```json
{
  "product": "Transaction API",
  "purpose": "broadcast a transaction to the blockchain",
  "notablePositioning": [
    "private mempool broadcasting",
    "front-running protection",
    "separate from route discovery and order creation"
  ],
  "supportedChains": 13
}
```

**Guidance**
- Keep this as a submission layer, not as a quoting or order-construction layer.
- Use it only when the surrounding system intentionally wants 1inch-managed transaction broadcasting behavior.
- Do not confuse a transaction gateway with a swap or Fusion quoting API.
- Make the choice between direct wallet or RPC submission and Transaction API explicit in system design.

**Example**
Language: typescript
Description: Preserve the submission decision as a separate branch.

```ts
type SubmissionMode = "wallet-or-rpc" | "1inch-transaction-api";

function chooseSubmissionMode(useGateway: boolean): SubmissionMode {
  return useGateway ? "1inch-transaction-api" : "wallet-or-rpc";
}
```

### Fusion SDK Core Contracts
**Exports**
- FusionSDK
- FusionSDKConfigParams
- QuoteParams
- OrderParams
- PresetEnum
- OrderStatus
- OrderStatusResponse
- WebSocketApi

This group covers the concrete TypeScript surface exposed by `@1inch/fusion-sdk@2.4.6`.

#### FusionSDK
**Kind**
class

**Summary**
High-level Fusion client for quote retrieval, order creation, order submission, order listing, status polling, and cancel-call-data generation.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/sdk.d.ts

```ts
export declare class FusionSDK {
    readonly api: FusionApi;
    constructor(config: FusionSDKConfigParams);
    getActiveOrders({ page, limit }?: ActiveOrdersRequestParams): Promise<ActiveOrdersResponse>;
    getOrderStatus(orderHash: string): Promise<OrderStatusResponse>;
    getOrdersByMaker({ limit, page, address }: OrdersByMakerParams): Promise<OrdersByMakerResponse>;
    getQuote(params: QuoteParams): Promise<Quote>;
    getQuoteWithCustomPreset(params: QuoteParams, body: QuoteCustomPresetParams): Promise<Quote>;
    createOrder(params: OrderParams): Promise<PreparedOrder>;
    submitOrder(order: FusionOrder, quoteId: string): Promise<OrderInfo>;
    submitNativeOrder(order: FusionOrder, maker: Address, quoteId: string): Promise<OrderInfo>;
    placeOrder(params: OrderParams): Promise<OrderInfo>;
    buildCancelOrderCallData(orderHash: string): Promise<string>;
}
```

**Guidance**
- Use `FusionSDK` as the first-choice TypeScript entry point for Fusion-mode integrations.
- Keep `getQuote`, `createOrder`, and `submitOrder` conceptually separate in code and in explanations.
- Prefer `placeOrder(...)` only when the combined create-and-submit behavior is actually what the task wants; otherwise keep the staged flow explicit for better control and debugging.
- Use `getOrderStatus(...)` or `getOrdersByMaker(...)` for lifecycle monitoring instead of assuming immediate settlement.

**Example**
Language: typescript
Description: Create a Fusion SDK client and fetch a quote.

```ts
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";

const sdk = new FusionSDK({
  url: "https://api.1inch.dev/fusion",
  network: NetworkEnum.ETHEREUM,
  authKey: process.env.ONEINCH_API_KEY,
});

const quote = await sdk.getQuote({
  fromTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  toTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  amount: "1000000000000000000",
});
```

#### FusionSDKConfigParams
**Kind**
type

**Summary**
Configuration contract for the hosted Fusion endpoint, network selection, auth, and optional custom connectors.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts

```ts
export type FusionSDKConfigParams = {
    url: string;
    network: NetworkEnum;
    authKey?: string;
    blockchainProvider?: BlockchainProviderConnector;
    httpProvider?: HttpProviderConnector;
};
```

**Guidance**
- Set `url` and `network` explicitly; do not rely on ambient chain assumptions.
- Provide `authKey` when the hosted API deployment requires developer-portal authentication.
- Add `blockchainProvider` when you need order signing or native-order submission flows.
- Add a custom `httpProvider` only when you need transport control beyond the default client behavior.

**Example**
Language: typescript
Description: Configure Fusion SDK with auth and a pinned network.

```ts
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";

const sdk = new FusionSDK({
  url: "https://api.1inch.dev/fusion",
  network: NetworkEnum.ARBITRUM,
  authKey: process.env.ONEINCH_API_KEY,
});
```

#### QuoteParams
**Kind**
type

**Summary**
Input contract for retrieving a Fusion quote.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts

```ts
export type QuoteParams = {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    walletAddress?: string;
    enableEstimate?: boolean;
    permit?: string;
    integratorFee?: IntegratorFeeParams;
    source?: string;
    isPermit2?: boolean;
    slippage?: number;
};
```

**Guidance**
- Provide token addresses and `amount` in base units, not decimal UI values.
- Add `walletAddress` when the quote must reflect wallet-specific constraints or downstream order creation.
- Keep permit and fee settings explicit; do not imply they are always required.
- Treat the returned quote as input to order creation, not as a transaction you can submit directly.

**Example**
Language: typescript
Description: Request a Fusion quote for a token pair.

```ts
const quote = await sdk.getQuote({
  fromTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  amount: "1000000000000000000",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
});
```

#### OrderParams
**Kind**
type

**Summary**
Input contract for creating a Fusion order from a quote-oriented trade intent.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts

```ts
export type OrderParams = {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    walletAddress: string;
    permit?: string;
    receiver?: string;
    preset?: PresetEnum;
    nonce?: bigint;
    source?: string;
    isPermit2?: boolean;
    customPreset?: CustomPreset;
    orderExpirationDelay?: bigint;
    allowPartialFills?: boolean;
    allowMultipleFills?: boolean;
    integratorFee?: IntegratorFeeParams;
    slippage?: number;
};
```

**Guidance**
- `walletAddress` is mandatory here because an order must have an explicit maker identity.
- Start with a standard `preset` unless the task specifically needs custom auction-shape control.
- Treat `nonce`, expiration, and partial-fill flags as lifecycle and cancellation design choices, not filler options.
- If the task is really about an immediate direct swap transaction, do not force it into `OrderParams`; use the classic swap boundary instead.

**Example**
Language: typescript
Description: Create and submit a Fusion order using a fast preset.

```ts
const prepared = await sdk.createOrder({
  fromTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  amount: "1000000000000000000",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  preset: PresetEnum.fast,
});

const result = await sdk.submitOrder(prepared.order, prepared.quoteId);
console.log(result.orderHash);
```

#### PresetEnum
**Kind**
type

**Summary**
Named Fusion auction-speed presets used to select standard auction behavior.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/api/quoter/types.d.ts

```ts
export declare enum PresetEnum {
    fast = "fast",
    medium = "medium",
    slow = "slow",
    custom = "custom"
}
```

**Guidance**
- Start with `fast`, `medium`, or `slow` before designing a custom preset.
- Reach for `custom` only when the system has a reason to own auction-shape tuning.
- Keep preset choice aligned with execution urgency and monitoring sophistication.

**Example**
Language: typescript
Description: Choose a non-custom preset for a straightforward order.

```ts
import { PresetEnum } from "@1inch/fusion-sdk";

const preset = PresetEnum.medium;
```

#### OrderStatus
**Kind**
type

**Summary**
Enumerates the major lifecycle states and failure reasons for a Fusion order.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/api/orders/types.d.ts

```ts
export declare enum OrderStatus {
    Pending = "pending",
    Filled = "filled",
    FalsePredicate = "false-predicate",
    NotEnoughBalanceOrAllowance = "not-enough-balance-or-allowance",
    Expired = "expired",
    PartiallyFilled = "partially-filled",
    WrongPermit = "wrong-permit",
    Cancelled = "cancelled",
    InvalidSignature = "invalid-signature"
}
```

**Guidance**
- Surface these statuses directly in user-visible monitoring and logs; they are operationally meaningful.
- Pay special attention to `not-enough-balance-or-allowance`, `wrong-permit`, and `invalid-signature`, because they usually indicate a bad integration assumption rather than market behavior.
- Treat `pending` as an expected lifecycle state, not as proof of success.

**Example**
Language: typescript
Description: React to terminal and failure-oriented order states.

```ts
import { OrderStatus } from "@1inch/fusion-sdk";

function isTerminal(status: OrderStatus) {
  return [
    OrderStatus.Filled,
    OrderStatus.Expired,
    OrderStatus.Cancelled,
    OrderStatus.InvalidSignature,
  ].includes(status);
}
```

#### OrderStatusResponse
**Kind**
type

**Summary**
Status-polling payload for a Fusion order, including fills, timing, and price-context fields.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/api/orders/types.d.ts

```ts
export type OrderStatusResponse = {
    status: OrderStatus;
    order: LimitOrderV4Struct;
    extension: string;
    points: AuctionPoint[] | null;
    cancelTx: string | null;
    fills: Fill[];
    createdAt: string;
    auctionStartDate: number;
    auctionDuration: number;
    initialRateBump: number;
    isNativeCurrency: boolean;
    fromTokenToUsdPrice: string;
    toTokenToUsdPrice: string;
};
```

**Guidance**
- Use this for real monitoring and debugging, not just the top-level enum status.
- Read `fills`, timing fields, and `cancelTx` when debugging incomplete or partially filled orders.
- Treat this as a status-report contract; it does not replace the original order-construction parameters in your application state.

**Example**
Language: typescript
Description: Poll for a Fusion order and inspect its status.

```ts
const status = await sdk.getOrderStatus(orderHash);
console.log(status.status, status.fills.length);
```

#### WebSocketApi
**Kind**
class

**Summary**
Websocket client for active-order subscriptions and Fusion order event monitoring.

**Definition**
Language: typescript
Source: npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/ws-api/ws-api.d.ts

```ts
export declare class WebSocketApi {
    readonly rpc: RpcWebsocketApi;
    readonly order: ActiveOrdersWebSocketApi;
    readonly provider: WsProviderConnector;
    constructor(configOrProvider: WsApiConfigWithNetwork | WsProviderConnector);
    static new(configOrProvider: WsApiConfigWithNetwork | WsProviderConnector): WebSocketApi;
    init(): void;
    on(event: string, cb: AnyFunctionWithThis): void;
    off(event: string, cb: AnyFunctionWithThis): void;
    onOpen(cb: AnyFunctionWithThis): void;
    send<T>(message: T): void;
    close(): void;
    onMessage(cb: OnMessageCb): void;
    onClose(cb: AnyFunction): void;
    onError(cb: AnyFunction): void;
}
```

**Guidance**
- Use `WebSocketApi` when order-event latency matters more than simple polling.
- Keep websocket lifecycle management explicit; reconnect and cleanup are part of the integration.
- Prefer websocket monitoring for live order status UX, but keep polling as a fallback for reliability.
- Use the official websocket URL shape from current SDK examples rather than inventing your own path.

**Example**
Language: typescript
Description: Subscribe to Fusion order events over websocket.

```ts
import { NetworkEnum, WebSocketApi } from "@1inch/fusion-sdk";

const ws = new WebSocketApi({
  url: "wss://api.1inch.dev/fusion/ws",
  network: NetworkEnum.ETHEREUM,
  authKey: process.env.ONEINCH_API_KEY,
});

ws.order.onOrder((event) => {
  console.log(event.event);
});
```
