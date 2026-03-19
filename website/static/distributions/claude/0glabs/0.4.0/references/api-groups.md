# 0G Serving Broker API Groups

### Setup
**Exports**
- createZGComputeNetworkBroker
- ZGComputeNetworkBroker

Create and reuse the top-level broker object bound to a signer.

#### createZGComputeNetworkBroker
**Kind**
function

**Summary**
Create a serving broker bound to an Ethers-compatible signer.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
export declare function createZGComputeNetworkBroker(
  signer: import("ethers").Signer
): Promise<ZGComputeNetworkBroker>;
```

**Guidance**
- Use a signer that can pay gas and broker-funding transactions.
- Create one broker per signer and reuse it rather than rebuilding it on every request.
- Keep provider and ledger state attached to the broker instance.

**Example**
Language: javascript
Description: Create a broker from an ethers wallet.

```js
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
const broker = await createZGComputeNetworkBroker(wallet);
```

#### ZGComputeNetworkBroker
**Kind**
class

**Summary**
Main broker object exposing inference and ledger services.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
declare class ZGComputeNetworkBroker {
  inference: InferenceService;
  ledger: LedgerService;
}
```

**Guidance**
- Treat this as the shared context for service discovery, request auth, and funding state.
- Reuse the same broker for related workflows so the signer and account model stay coherent.
- Keep the signer identity stable across a request lifecycle.

**Example**
Language: javascript
Description: Use the broker’s service objects.

```js
const account = await broker.ledger.getLedger();
```

### Inference
**Exports**
- InferenceService.getServiceMetadata
- InferenceService.getRequestHeaders
- InferenceService.processResponse

Provider discovery, per-request auth, and verification.

#### InferenceService.getServiceMetadata
**Kind**
function

**Summary**
Fetch provider endpoint and model metadata before sending a request.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
getServiceMetadata(provider: string): Promise<{
  endpoint: string;
  model: string;
  verifiability?: string;
}>;
```

**Guidance**
- Use this instead of hard-coding endpoints because provider details can change.
- Keep the provider identifier and later verification context aligned.
- Treat metadata discovery as its own step before request auth generation.

**Example**
Language: javascript
Description: Load provider metadata.

```js
const meta = await broker.inference.getServiceMetadata(provider);
```

#### InferenceService.getRequestHeaders
**Kind**
function

**Summary**
Generate authenticated request headers for a single inference request.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
getRequestHeaders(provider: string, prompt: string, chatID?: string): Promise<Record<string, string>>;
```

**Guidance**
- Generate headers for each request instead of caching them across calls.
- Keep `chatID` stable when the request and later verification are part of the same conversation flow.
- Treat these headers as single-use credentials.

**Example**
Language: javascript
Description: Generate headers for a prompt.

```js
const headers = await broker.inference.getRequestHeaders(provider, "hello");
```

#### InferenceService.processResponse
**Kind**
function

**Summary**
Verify a provider response against the broker’s verification model.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
processResponse(provider: string, content: string, chatID?: string): Promise<boolean>;
```

**Guidance**
- Pass the same provider and optional chat ID used for the original request.
- Do not trust model output until this verification step succeeds when verifiable flows matter.
- Keep verification errors explicit so operators can distinguish bad content from transport failures.

**Example**
Language: javascript
Description: Verify returned content.

```js
const ok = await broker.inference.processResponse(provider, answer);
```

### Ledger
**Exports**
- LedgerService.getLedger
- LedgerService.depositFund

Funding and checking the serving-broker account state.

#### LedgerService.getLedger
**Kind**
function

**Summary**
Read the current broker ledger state for the bound account.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
getLedger(): Promise<AccountStructOutput>;
```

**Guidance**
- Check this before paid inference flows.
- Keep broker ledger balance separate from the signer wallet balance.
- Re-read it after funding instead of assuming the top-up is instantly available.

**Example**
Language: javascript
Description: Inspect ledger state.

```js
const ledger = await broker.ledger.getLedger();
```

#### LedgerService.depositFund
**Kind**
function

**Summary**
Deposit OG funds into the broker ledger for later inference usage.

**Definition**
Language: typescript
Source: agents/0glabs/0.3.0.md coverage audit

```ts
depositFund(amount: string | bigint): Promise<void>;
```

**Guidance**
- Use this as the preferred funding path for new code.
- Treat funding as a prerequisite for paid requests rather than a recovery step mid-request.
- Keep amounts explicit and avoid float conversions.

**Example**
Language: javascript
Description: Deposit broker funds.

```js
await broker.ledger.depositFund("0.05");
```
