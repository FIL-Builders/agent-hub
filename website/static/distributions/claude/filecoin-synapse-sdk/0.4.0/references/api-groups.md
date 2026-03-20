# Filecoin Synapse SDK API Groups

### Core Setup And Shared Constants
**Exports**
- Synapse
- Synapse.create
- TOKENS
- calibration

Top-level initialization and the shared chain or token anchors used throughout the SDK.

#### Synapse
**Kind**
class

**Summary**
Main SDK entrypoint that composes payments, storage, provider registry, and FilBeam services.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/synapse.d.ts

```ts
export declare class Synapse {
  static create(options: SynapseOptions): Synapse;
  get client(): Client;
  get chain(): Chain;
  get payments(): PaymentsService;
  get storage(): StorageManager;
  get filbeam(): FilBeamService;
  get providers(): SPRegistryService;
  getProviderInfo(providerAddress: Address | bigint): Promise<PDPProvider>;
}
```

**Guidance**
- Use this as the default app-facing entrypoint rather than instantiating subsystem services separately.
- Reuse one instance per process or request scope where appropriate so chain and account configuration stays coherent.
- Current `Synapse` composition is broader than storage alone; keep payments, providers, and FilBeam available in the mental model.

**Example**
Language: typescript
Description: Create a top-level Synapse instance against Calibration.

```ts
import { Synapse, calibration } from "@filoz/synapse-sdk";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const synapse = Synapse.create({
  chain: calibration,
  account,
  transport: http(),
  source: null,
});
```

#### Synapse.create
**Kind**
function

**Summary**
Construct a configured `Synapse` instance from a current chain, account, transport, and optional session features.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/synapse.d.ts + package/dist/src/types.d.ts

```ts
static create(options: SynapseOptions): Synapse;

interface SynapseOptions {
  transport?: Transport;
  chain?: Chain;
  account: Account | Address;
  sessionKey?: SessionKey<"Secp256k1">;
  withCDN?: boolean;
  source: string | null;
}
```

**Guidance**
- Do not await this method; current package contracts define it as synchronous.
- Provide a real viem account when the workflow needs write operations, not just a plain address.
- Keep `source` explicit because metadata and telemetry-oriented workflows may depend on it downstream.

**Example**
Language: typescript
Description: Build a Synapse instance with CDN-enabled retrieval behavior.

```ts
const synapse = Synapse.create({
  chain: calibration,
  account,
  transport: http(),
  withCDN: true,
  source: "my-app",
});
```

#### TOKENS
**Kind**
constant

**Summary**
Current token identifiers exported by the SDK.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/utils/constants.d.ts

```ts
export declare const TOKENS: {
  readonly USDFC: "USDFC";
  readonly FIL: "FIL";
};
```

**Guidance**
- Use these constants when token selection needs to be explicit in payment flows.
- Keep in mind that not every payment method supports every token equally; read the specific method contract.
- Distinguish FIL wallet-balance reads from USDFC-centric payment and service flows.

**Example**
Language: typescript
Description: Use the exported token identifiers directly.

```ts
import { TOKENS } from "@filoz/synapse-sdk";

const token = TOKENS.USDFC;
```

#### calibration
**Kind**
constant

**Summary**
Calibration chain configuration exported through the Synapse SDK from `synapse-core`.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-core@0.3.0:package/dist/src/chains.d.ts

```ts
export declare const calibration: Chain;
```

**Guidance**
- Use this as the default non-mainnet chain constant for testing and development.
- Prefer chain constants over ad hoc RPC URL assumptions because current contracts are chain-centric.
- Keep chain choice explicit when moving code between Calibration, mainnet, and devnet.

**Example**
Language: typescript
Description: Pass Calibration directly into Synapse setup.

```ts
import { calibration, Synapse } from "@filoz/synapse-sdk";
```

### Payments And Settlement
**Exports**
- PaymentsService.deposit
- PaymentsService.approveService
- PaymentsService.getRailsAsPayer
- PaymentsService.getSettlementAmounts

Funding, service approval, rail inspection, and settlement flows.

#### PaymentsService.deposit
**Kind**
function

**Summary**
Deposit funds into the Synapse payment system, optionally with allowance and progress callbacks.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/payments/service.d.ts

```ts
deposit(options: {
  to?: Address;
  amount: TokenAmount;
  token?: TokenIdentifier;
  onAllowanceCheck?: (current: bigint, required: bigint) => void;
  onApprovalTransaction?: (tx: Hash) => void;
  onApprovalConfirmed?: (receipt: TransactionReceipt) => void;
  onDepositStarting?: () => void;
}): Promise<Hash>;
```

**Guidance**
- Treat this as funding the Synapse payment layer, not just increasing wallet balance.
- Use the allowance and approval callbacks to make UX and telemetry explicit in deposit-heavy flows.
- Zero or unsupported-token deposits should be treated as logic bugs, not recovered silently.

**Example**
Language: typescript
Description: Deposit USDFC into the Synapse payment system.

```ts
import { parseUnits } from "@filoz/synapse-sdk";

const hash = await synapse.payments.deposit({
  amount: parseUnits("100", 18),
  onDepositStarting: () => console.log("deposit starting"),
});
```

#### PaymentsService.approveService
**Kind**
function

**Summary**
Approve a service operator with explicit rate, lockup, and period constraints.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/payments/service.d.ts

```ts
approveService(options?: {
  service?: Address;
  rateAllowance?: TokenAmount;
  lockupAllowance?: TokenAmount;
  maxLockupPeriod?: TokenAmount;
  token?: TokenIdentifier;
}): Promise<Hash>;
```

**Guidance**
- Use this before storage-heavy workflows when the service contract must be allowed to consume funds under bounded conditions.
- Keep rate allowance, lockup allowance, and lockup period explicit so the app’s spending posture is auditable.
- Service approval is different from ERC-20 wallet allowance and different again from account funding.

**Example**
Language: typescript
Description: Approve the current storage service with bounded operator allowances.

```ts
const hash = await synapse.payments.approveService({
  rateAllowance: 10n * 10n ** 18n,
  lockupAllowance: 1000n * 10n ** 18n,
  maxLockupPeriod: 86400n,
});
```

#### PaymentsService.getRailsAsPayer
**Kind**
function

**Summary**
List payment rails where the current account is the payer.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/payments/service.d.ts

```ts
getRailsAsPayer(options?: {
  token?: TokenIdentifier;
}): Promise<RailInfo[]>;
```

**Guidance**
- Use this to inspect ongoing payment obligations created by storage and service workflows.
- Payment rails are the right abstraction for settlement inspection; they are not the same as datasets or providers.
- Filter by token when the app may hold or settle across more than one token context.

**Example**
Language: typescript
Description: Inspect active payer-side rails.

```ts
const rails = await synapse.payments.getRailsAsPayer();
console.log(rails.length);
```

#### PaymentsService.getSettlementAmounts
**Kind**
function

**Summary**
Preview settlement totals for a payment rail up to a target epoch.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/payments/service.d.ts

```ts
getSettlementAmounts(options: {
  railId: bigint;
  untilEpoch?: bigint;
}): Promise<SettlementResult>;
```

**Guidance**
- Use this before settlement to understand how much will actually move.
- Previewing settlement is especially important in automated or recurring-settlement workflows.
- Settlement preview is not itself settlement; pair it with an explicit `settle()` call when the workflow is ready.

**Example**
Language: typescript
Description: Preview settlement for the first payer rail.

```ts
const [rail] = await synapse.payments.getRailsAsPayer();
const preview = await synapse.payments.getSettlementAmounts({ railId: rail.railId });
console.log(preview.totalSettledAmount);
```

### Storage Manager Default Flows
**Exports**
- StorageManager.upload
- StorageManager.createContext
- StorageManager.prepare
- StorageManager.getUploadCosts

High-level storage operations and cost-aware preparation.

#### StorageManager.upload
**Kind**
function

**Summary**
Upload data through the default storage-manager path and return piece and copy information.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/storage/manager.d.ts

```ts
upload(
  data: UploadPieceStreamingData,
  options?: StorageManagerUploadOptions
): Promise<UploadResult>;
```

**Guidance**
- Use this for the simplest high-level upload path when you do not need explicit provider or dataset control.
- Upload success does not erase the need to reason about payment rails, approvals, and retrieval behavior.
- The returned `copies` and `failures` are operationally meaningful; do not ignore them in production flows.

**Example**
Language: typescript
Description: Upload a small piece through the default manager.

```ts
const data = new TextEncoder().encode("hello synapse");
const result = await synapse.storage.upload(data);
console.log(result.pieceCid.toString());
```

#### StorageManager.createContext
**Kind**
function

**Summary**
Create an explicit storage context for provider-aware or dataset-aware operations.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/storage/manager.d.ts

```ts
createContext(options?: StorageServiceOptions): Promise<StorageContext>;
```

**Guidance**
- Use this when provider selection, dataset reuse, or per-context metadata matters.
- Contexts are the right escape hatch from default uploads; do not overload the default manager when explicit control is required.
- Keep context metadata and provider decisions explicit because they affect later storage and retrieval behavior.

**Example**
Language: typescript
Description: Create a context with CDN enabled.

```ts
const context = await synapse.storage.createContext({
  withCDN: true,
  metadata: { environment: "prod" },
});
```

#### StorageManager.prepare
**Kind**
function

**Summary**
Precompute upload costs and, when needed, build an executable transaction plan for funding or approval.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/storage/manager.d.ts + package/dist/src/types.d.ts

```ts
prepare(options: {
  context?: StorageContext | StorageContext[];
  dataSize: bigint;
  extraRunwayEpochs?: bigint;
  bufferEpochs?: bigint;
  costs?: UploadCosts;
}): Promise<PrepareResult>;
```

**Guidance**
- Use this for cost-aware flows where funding and approval need to be planned before uploading.
- `prepare()` is the right place to separate “can I afford this?” from “perform the upload now”.
- Keep precomputed `costs` reuse explicit if you are optimizing repeated calculations.

**Example**
Language: typescript
Description: Prepare a storage funding plan before upload.

```ts
const plan = await synapse.storage.prepare({
  dataSize: 1024n * 1024n,
  extraRunwayEpochs: 100n,
});

if (plan.transaction) {
  await plan.transaction.execute();
}
```

#### StorageManager.getUploadCosts
**Kind**
function

**Summary**
Compute expected upload costs for a planned storage operation.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/storage/manager.d.ts

```ts
getUploadCosts(
  options: Omit<GetUploadCostsOptions, "clientAddress">
): Promise<UploadCosts>;
```

**Guidance**
- Use this when you need cost visibility without yet constructing a full `prepare()` transaction plan.
- Cost estimation and upload are different phases; keep them separate in product and CLI flows.
- Cost results are contextual to size, runway, and storage configuration, so do not cache them blindly across workflows.

**Example**
Language: typescript
Description: Estimate upload costs for a planned piece.

```ts
const costs = await synapse.storage.getUploadCosts({
  dataSize: 5n * 1024n * 1024n,
});

console.log(costs.total);
```

### Explicit Storage Contexts And Warm Storage
**Exports**
- StorageContext.upload
- WarmStorageService.getServicePrice
- SPRegistryService.getAllActiveProviders

Provider-aware storage operations and inspection helpers.

#### StorageContext.upload
**Kind**
function

**Summary**
Upload data through an explicit storage context with provider and dataset control.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/storage/context.d.ts

```ts
upload(
  data: UploadPieceStreamingData,
  options?: UploadOptions
): Promise<UploadResult>;
```

**Guidance**
- Use context uploads when provider choice, dataset targeting, or context metadata is part of the requirement.
- This is the precise path for workflows that cannot rely on default provider selection.
- Keep `withCDN`, metadata, and selected provider assumptions visible because they affect later retrieval and billing behavior.

**Example**
Language: typescript
Description: Upload through an explicit storage context.

```ts
const context = await synapse.storage.createContext({ withCDN: true });
const upload = await context.upload(new TextEncoder().encode("file payload"));
console.log(upload.copies[0].providerId);
```

#### WarmStorageService.getServicePrice
**Kind**
function

**Summary**
Read current Warm Storage pricing information.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/warm-storage/service.d.ts

```ts
getServicePrice(): Promise<getServicePrice.OutputType>;
```

**Guidance**
- Use this for direct pricing inspection when you need service-level visibility.
- Pricing inspection complements, but does not replace, full upload-cost or prepare flows.
- Keep Warm Storage price reads separate from account-balance or settlement checks.

**Example**
Language: typescript
Description: Inspect the current service price.

```ts
const price = await synapse.storage.getStorageInfo();
console.log(price.pricing.tokenSymbol);
```

#### SPRegistryService.getAllActiveProviders
**Kind**
function

**Summary**
List all active registered providers in the Synapse provider registry.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/sp-registry/service.d.ts

```ts
getAllActiveProviders(): Promise<SP.PDPProvider[]>;
```

**Guidance**
- Use this when provider discovery or selection must be explicit.
- Provider registry state is a discovery layer, not proof that a given provider is right for the current upload.
- Pair registry reads with pricing, capability, and context requirements before hard-selecting a provider.

**Example**
Language: typescript
Description: Enumerate active providers.

```ts
const providers = await synapse.providers.getAllActiveProviders();
console.log(providers.length);
```

### FilBeam And Analytics
**Exports**
- FilBeamService.getDataSetStats

Analytics and retrieval-domain information exposed through FilBeam.

#### FilBeamService.getDataSetStats
**Kind**
function

**Summary**
Fetch dataset quota or egress-style statistics from FilBeam.

**Definition**
Language: typescript
Source: npm:@filoz/synapse-sdk@0.39.0:package/dist/src/filbeam/service.d.ts

```ts
getDataSetStats(dataSetId: string | number): Promise<{
  cdnEgressQuota: bigint;
  cacheMissEgressQuota: bigint;
}>;
```

**Guidance**
- Use this for stats and retrieval-oriented observability, not for onchain payment truth.
- FilBeam analytics are useful for product dashboards and quota checks.
- Keep FilBeam outputs separate from dataset existence, proof, or settlement state.

**Example**
Language: typescript
Description: Read FilBeam stats for a dataset.

```ts
const stats = await synapse.filbeam.getDataSetStats(12345);
console.log(stats.cdnEgressQuota);
```
