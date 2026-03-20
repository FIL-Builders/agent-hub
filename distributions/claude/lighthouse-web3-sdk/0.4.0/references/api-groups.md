# Lighthouse Web3 SDK API Groups

### Auth And Wallet
**Exports**
- createWallet
- getAuthMessage
- oneTimeAuth

Wallet and auth primitives used before sensitive upload or access-control flows.

#### createWallet
**Kind**
function

**Summary**
Generate a new Lighthouse wallet managed by the SDK.

**Definition**
Language: typescript
Source: agents/lighthouse-web3-sdk/0.3.0.md coverage audit, aligned to current package line

```ts
declare function createWallet(password: string): Promise<createWalletResponse>;
```

**Guidance**
- Use this when Lighthouse-specific wallet management is part of the application model.
- Store secrets outside client-side code paths whenever possible.
- Keep generated wallet material separate from one-time auth tokens and API keys.

**Example**
Language: typescript
Description: Create a Lighthouse wallet.

```ts
const { data } = await lighthouse.createWallet("strong-password");
```

#### getAuthMessage
**Kind**
function

**Summary**
Fetch the message a wallet must sign to authorize later Lighthouse operations.

**Definition**
Language: typescript
Source: current Lighthouse auth docs and prior pack coverage

```ts
declare function getAuthMessage(address: string): Promise<{ data: { message: string } }>;
```

**Guidance**
- Use this before any signed auth flow that expects an address-bound message.
- Keep the address and signer aligned; mismatches will break later verification.
- Treat the returned message as input to signing, not as a reusable access token.

**Example**
Language: typescript
Description: Get the auth message for an address.

```ts
const { data } = await lighthouse.getAuthMessage("0xYourAddress");
```

#### oneTimeAuth
**Kind**
function

**Summary**
Generate a short-lived auth token used for sensitive Lighthouse operations.

**Definition**
Language: typescript
Source: agents/lighthouse-web3-sdk/0.3.0.md coverage audit

```ts
declare function oneTimeAuth(privateKey?: string): Promise<string>;
```

**Guidance**
- Use this as an ephemeral credential for the immediate operation, not as a stored session primitive.
- Regenerate it for each intended call pattern rather than caching it broadly.
- Keep it paired with the correct wallet or signer identity.

**Example**
Language: typescript
Description: Get a one-time auth token.

```ts
const token = await lighthouse.oneTimeAuth("0xPrivateKeyOptional");
```

### Upload And Encryption
**Exports**
- uploadEncrypted

Encrypted upload flow that combines content upload with signed access control.

#### uploadEncrypted
**Kind**
function

**Summary**
Upload content in encrypted form using an API key, public key, and signed auth message.

**Definition**
Language: typescript
Source: agents/lighthouse-web3-sdk/0.3.0.md coverage audit

```ts
declare function uploadEncrypted(
  path: string | any,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  cidVersion?: number,
  uploadProgressCallback?: (data: any) => void
): Promise<{ data: IFileUploadedResponse[] }>;
```

**Guidance**
- Use this instead of a plain upload when the application needs encrypted storage and controlled key access.
- Keep `publicKey` and `signedMessage` generated from the correct signing flow; mismatches will break later retrieval.
- Surface the progress callback in UI or logs for large uploads.

**Example**
Language: typescript
Description: Upload an encrypted file with CIDv1.

```ts
const res = await lighthouse.uploadEncrypted(
  "/path/file.pdf",
  process.env.LIGHTHOUSE_API_KEY!,
  "0xYourPublicKey",
  "0xSignedMessage",
  1
);
```

### Retrieval And Status
**Exports**
- getUploads
- dealStatus

Read-side helpers for listing uploads and checking storage durability.

#### getUploads
**Kind**
function

**Summary**
List uploaded files using an auth token and an optional pagination cursor.

**Definition**
Language: typescript
Source: agents/lighthouse-web3-sdk/0.3.0.md coverage audit

```ts
declare function getUploads(authToken: string, lastKey?: string | null): Promise<uploadsResponseType>;
```

**Guidance**
- Treat `lastKey` as an opaque cursor rather than a numeric page.
- Use this for inventory and management UIs, not as proof of deal activation.
- Keep auth-token scope and lifetime explicit when listing uploads from automated systems.

**Example**
Language: typescript
Description: Fetch the first page of uploads.

```ts
const page = await lighthouse.getUploads(process.env.LIGHTHOUSE_JWT!, null);
```

#### dealStatus
**Kind**
function

**Summary**
Read Filecoin deal status information for a previously uploaded CID.

**Definition**
Language: typescript
Source: agents/lighthouse-web3-sdk/0.3.0.md coverage audit

```ts
declare function dealStatus(cid: string): Promise<dealResponse>;
```

**Guidance**
- Poll this after upload when durability matters; upload completion is not the same thing as active storage deals.
- Use CIDs as the lookup handle, not gateway URLs.
- Keep retry and backoff logic in place because deal activation is not instantaneous.

**Example**
Language: typescript
Description: Check deal status for a CID.

```ts
const status = await lighthouse.dealStatus("bafy...");
```
