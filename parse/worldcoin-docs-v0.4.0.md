# Worldcoin Documentation Pack

## Snapshot
- library name: worldcoin
- version or version range: current-docs + minikit-js^1.11.0 + idkit^4.0.9
- primary language: typescript
- homepage or canonical docs URL: https://developer.worldcoin.org
- short description: World's current developer surface spans Mini Apps inside World App, World ID proof flows, wallet authentication, payment and transaction requests on World Chain, permissions, notifications, and backend verification APIs.
- source set summary: official World docs for Mini Apps, World ID, and Developer Portal APIs, `npm:@worldcoin/minikit-js@1.11.0`, `npm:@worldcoin/idkit@4.0.9`, `npm:@worldcoin/idkit-core@4.0.13`, and the prior AgentHub Worldcoin pack for coverage audit only

## What This Library Is For
World's developer surface is used to build mini apps inside World App, verify
proof-of-human flows, authenticate wallets with SIWE, request payments or
contract transactions on World Chain, request permissions, and notify opted-in
users. The important operational challenge is that these are distinct trust
models. A client-side MiniKit result is not the same thing as a verified proof,
an authenticated wallet session, or a confirmed payment.

## Installation And Setup
- install commands:
  - `npm install @worldcoin/minikit-js`
  - `npm install @worldcoin/idkit`
- backend or lower-level helpers when needed:
  - `npm install @worldcoin/idkit-core`
- environment prerequisites:
  - Mini App flows run inside World App webview
  - backend routes are required for nonce issuance, RP signing, proof
    verification, and payment or transaction reconciliation
  - Developer Portal configuration is required for app IDs, RP IDs, signing
    keys, allowlists, and notifications
- minimum setup example:

```ts
import { MiniKit } from "@worldcoin/minikit-js";

const installResult = MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);

if (!installResult.success) {
  console.error(installResult.errorCode, installResult.errorMessage);
}
```

## Core Concepts

### MiniKit commands and backend truth are different layers
- MiniKit commands run in the client and return user-approved payloads.
- Verification, reconciliation, and session establishment must happen on a
  backend you control.
- Proof, wallet auth, payments, and contract transactions should never be
  treated as interchangeable trust signals.

### Wallet authentication is not World ID verification
- `walletAuth` is a SIWE-style wallet login flow.
- `verify` and IDKit are World ID proof flows.
- A wallet signature proves wallet control. A World ID proof proves a
  credential-backed property such as uniqueness or document-backed access.

### MiniKit and IDKit are complementary, not identical
- MiniKit is the current Mini App integration surface inside World App.
- IDKit is the World ID integration surface for web, React, mobile, and custom
  request flows.
- MiniKit `verify` is a Mini App-specific proof flow; IDKit request flows are
  RP-signed and verified against the current `v4` verify endpoint.

### Payments and transactions settle later
- `pay` and `sendTransaction` return submission identifiers, not mined finality.
- Reconciliation happens through backend checks such as the Get Transaction
  endpoint or explicit on-chain tracking.
- A successful client callback should be treated as a submitted operation that
  still needs confirmation.

## Version Delta Audit
- prior pack target: MiniKit JS plus Developer Portal API v2, centered mostly
  on Mini App command flows
- current target: broader World developer surface with Mini Apps, current World
  ID docs, RP-signed IDKit flows, `v4` proof verification, permissions, and
  reconciliation boundaries made first-class
- stale assumption to avoid: proof generation on the client being enough
  without trusted backend verification
- replacement pattern: forward proof payloads to the correct backend verify path
  and treat verification success as the actual trust boundary
- stale assumption to avoid: using `verify` for login
- replacement pattern: use `walletAuth` for wallet login and reserve World ID
  proof flows for proof-of-human or related credential checks
- stale assumption to avoid: treating `app_id`-only verification as the main
  current path
- replacement pattern: current docs prefer `POST /api/v4/verify/{rp_id}` and
  RP-signed IDKit requests, while legacy or Mini App-specific helpers remain
  compatibility surfaces where relevant

## Ecosystem Boundaries
- Mini App runtime and command surface:
  - `@worldcoin/minikit-js`
  - official Mini Apps docs and command pages
- World ID request and widget surface:
  - `@worldcoin/idkit`
  - `@worldcoin/idkit-core`
  - official World ID integration docs
- trusted server verification surface:
  - `POST /api/v4/verify/{rp_id}`
  - `verifySiweMessage`
  - backend-issued nonces and RP signatures
- reconciliation and operational API surface:
  - `GET /api/v2/minikit/transaction/{transaction_id}`
  - `POST /api/v2/minikit/send-notification`
- not the same trust boundary:
  - client proof payloads
  - client wallet signatures
  - submitted transactions or payments
  - verified backend outcomes

## Decision Rules
- Use `MiniKit.commandsAsync.walletAuth` for user login inside Mini Apps.
- Use `MiniKit.commandsAsync.verify` only for Mini App proof flows, not wallet
  login.
- Use `useIDKitRequest` or `IDKitRequestWidget` when the product needs a web or
  React World ID flow driven by current IDKit request semantics.
- Generate RP signatures only on the backend and verify World ID results
  through `POST /api/v4/verify/{rp_id}` when using current IDKit flows.
- Use `pay` only for supported WLD or USDC payment flows on World Chain.
- Use `sendTransaction` when the app needs arbitrary contract calls or Permit2
  flows rather than the simplified payment command.
- Always reconcile `transaction_id` values on the backend before treating a
  payment or transaction as final.
- Use `getPermissions` before `requestPermission` to avoid redundant prompts and
  to tailor UX to the user's current grant state.

## Preconditions And Invariants
- `MiniKit.install(...)` and `MiniKit.isInstalled()` gate whether Mini App
  commands can run in the current environment.
- Wallet auth nonces must be issued by the backend and stored somewhere the
  client cannot tamper with.
- RP signing keys must stay server-side only.
- `POST /api/v4/verify/{rp_id}` accepts `rp_id` as the recommended path
  parameter and still accepts `app_id` only for backward compatibility.
- Payment and transaction status may remain `pending` for minutes after the
  client receives a successful submission payload.
- Notification sends only work for users who have opted in and should be gated
  behind permission-aware product logic.

## Public Surface Area

### Mini App runtime and client commands

#### MiniKit.install
**Kind:** function

**Summary:** Initializes MiniKit against the active World App environment and
loads command availability plus app state.

**Definition**
```ts
type MiniKitInstallReturnType =
  | { success: true }
  | {
      success: false;
      errorCode: MiniKitInstallErrorCodes;
      errorMessage: string;
    };

declare class MiniKit {
  static install(appId?: string): MiniKitInstallReturnType;
}
```

**Guidance**
- Install once during app startup in Mini App contexts.
- Treat installation failure as an environment or compatibility signal rather
  than something to ignore.
- If the app is not running inside World App, command flows should stay gated.

**Example**
```ts
import { MiniKit } from "@worldcoin/minikit-js";

const installResult = MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);

if (!installResult.success) {
  console.error(installResult.errorCode, installResult.errorMessage);
}
```

**Source Notes**
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

#### MiniKit.commandsAsync.verify
**Kind:** function

**Summary:** Starts a Mini App World ID verify flow and returns a proof payload
that still needs backend verification.

**Definition**
```ts
type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel | [VerificationLevel, ...VerificationLevel[]];
  skip_proof_compression?: boolean;
};

type MiniAppVerifyActionSuccessPayload = {
  status: "success";
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: VerificationLevel;
  version: number;
};

declare class MiniKit {
  static get commandsAsync(): {
    verify: (
      payload: VerifyCommandInput
    ) => Promise<{
      commandPayload: VerifyCommandInput | null;
      finalPayload: MiniAppVerifyActionPayload;
    }>;
  };
}
```

**Guidance**
- Use this for Mini App proof-of-human gating, not login.
- Send the success payload to a trusted backend before granting access or
  updating business state.
- Keep `action` and optional `signal` stable between the client request and
  backend verification.

**Example**
```ts
const { finalPayload } = await MiniKit.commandsAsync.verify({
  action: "claim-reward-2026",
  signal: userId,
});

if (finalPayload.status === "success") {
  await fetch("/api/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ payload: finalPayload, action: "claim-reward-2026", signal: userId }),
  });
}
```

**Source Notes**
- Source: `https://docs.world.org/mini-apps/commands/verify`
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

#### MiniKit.commandsAsync.walletAuth
**Kind:** function

**Summary:** Starts SIWE-style wallet authentication inside World App and
returns an ERC-191-compatible signed message payload.

**Definition**
```ts
type WalletAuthInput = {
  nonce: string;
  statement?: string;
  requestId?: string;
  expirationTime?: Date;
  notBefore?: Date;
};

type MiniAppWalletAuthSuccessPayload = {
  status: "success";
  message: string;
  signature: string;
  address: string;
  version: number;
};

declare class MiniKit {
  static get commandsAsync(): {
    walletAuth: (
      payload: WalletAuthInput
    ) => Promise<{
      commandPayload: { siweMessage: string } | null;
      finalPayload: MiniAppWalletAuthPayload;
    }>;
  };
}
```

**Guidance**
- Use wallet auth as the primary login flow for Mini Apps.
- Issue the nonce on the backend and bind it to a tamper-resistant session or
  cookie before calling the command.
- Verify the returned payload on the backend and do not confuse wallet login
  with World ID proof verification.

**Example**
```ts
const { nonce } = await fetch("/api/nonce").then((r) => r.json());

const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
  nonce,
  statement: "Sign in to Example App",
  expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

if (finalPayload.status === "success") {
  await fetch("/api/complete-siwe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ payload: finalPayload, nonce }),
  });
}
```

**Source Notes**
- Source: `https://docs.world.org/mini-apps/commands/wallet-auth`
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

#### MiniKit.commandsAsync.pay
**Kind:** function

**Summary:** Requests a World App payment flow for WLD or USDC on World Chain
and returns a submission payload with a `transaction_id`.

**Definition**
```ts
type TokensPayload = {
  symbol: Tokens;
  token_amount: string;
};

type PayCommandInput = {
  reference: string;
  to: string;
  tokens: TokensPayload[];
  network?: Network;
  description: string;
};

type MiniAppPaymentSuccessPayload = {
  status: "success";
  transaction_status: "submitted";
  transaction_id: string;
  reference: string;
  from: string;
  chain: Network;
  timestamp: string;
  version: number;
};
```

**Guidance**
- Initialize and persist the `reference` on the backend before triggering the
  client command.
- Treat the success payload as submission, not final settlement.
- Enforce supported token and chain assumptions explicitly; current docs center
  the flow on World Chain with WLD and USDC support.

**Example**
```ts
import { MiniKit, Tokens, tokenToDecimals } from "@worldcoin/minikit-js";

const { id } = await fetch("/api/initiate-payment", { method: "POST" }).then((r) => r.json());

const { finalPayload } = await MiniKit.commandsAsync.pay({
  reference: id,
  to: merchantAddress,
  tokens: [{ symbol: Tokens.USDC, token_amount: tokenToDecimals(3, Tokens.USDC).toString() }],
  description: "Premium upgrade",
});

if (finalPayload.status === "success") {
  await fetch("/api/confirm-payment", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(finalPayload),
  });
}
```

**Source Notes**
- Source: `https://docs.world.org/mini-apps/commands/pay`
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

#### MiniKit.commandsAsync.sendTransaction
**Kind:** function

**Summary:** Submits one or more contract calls, optionally with Permit2, as a
World App transaction flow.

**Definition**
```ts
type Transaction = {
  address: string;
  abi: Abi | readonly unknown[];
  functionName: string;
  value?: string;
  args: readonly unknown[];
};

type SendTransactionInput = {
  transaction: Transaction[];
  permit2?: Permit2[];
  formatPayload?: boolean;
};

type MiniAppSendTransactionSuccessPayload = {
  status: "success";
  transaction_status: "submitted";
  transaction_id: string;
  reference: string;
  from: string;
  chain: Network;
  timestamp: string;
  mini_app_id?: string;
  version: number;
};
```

**Guidance**
- Use this when the app needs arbitrary contract interaction rather than the
  simplified payment flow.
- Keep ABIs minimal and configuration allowlists aligned in the Developer
  Portal.
- Reconcile the returned `transaction_id` after submission instead of assuming
  on-chain success immediately.

**Example**
```ts
const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
  transaction: [
    {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [recipient, amount],
    },
  ],
});

if (finalPayload.status === "success") {
  await fetch("/api/confirm-transaction", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(finalPayload),
  });
}
```

**Source Notes**
- Source: `https://docs.world.org/mini-apps/commands/send-transaction`
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

### Trusted backend verification and reconciliation

#### verifySiweMessage
**Kind:** function

**Summary:** Verifies a MiniKit wallet-auth payload against a backend-issued
nonce and returns SIWE validation results.

**Definition**
```ts
declare const verifySiweMessage: (
  payload: MiniAppWalletAuthSuccessPayload,
  nonce: string,
  statement?: string,
  requestId?: string,
  userProvider?: Client
) => Promise<{
  isValid: boolean;
  siweMessageData: SiweMessage;
}>;
```

**Guidance**
- Verify the exact nonce your backend issued and stored.
- Bind successful verification to your own session model; the helper validates
  the signature, not your application's authorization policy.
- Reject stale, mismatched, or tampered SIWE payloads even if the signature is
  structurally valid.

**Example**
```ts
import { verifySiweMessage } from "@worldcoin/minikit-js";

export async function POST(request: Request) {
  const { payload, nonce } = await request.json();
  const result = await verifySiweMessage(payload, nonce);

  if (!result.isValid) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true, wallet: result.siweMessageData.address });
}
```

**Source Notes**
- Source: `https://docs.world.org/mini-apps/commands/wallet-auth`
- Source: `npm:@worldcoin/minikit-js@1.11.0:build/index.d.ts`

#### POST /api/v4/verify/{rp_id}
**Kind:** endpoint

**Summary:** Verifies World ID 4.0 proofs and legacy 3.0 proofs through the
current Developer Portal verification API.

**Definition**
Language: http
```http
POST https://developer.world.org/api/v4/verify/{rp_id}
Content-Type: application/json

{
  "protocol_version": "3.0" | "4.0",
  "nonce": "<nonce>",
  "action": "<action>",
  "responses": [ ... ],
  "environment": "production" | "staging"
}
```

**Guidance**
- Use `rp_id` when possible; current docs recommend it and accept `app_id` only
  for backward compatibility.
- Forward the IDKit result payload as-is for current IDKit flows instead of
  remapping fields.
- Keep verification on a trusted backend and make nullifier handling part of
  your business logic for one-person-one-action flows.

**Example**
```ts
export async function POST(request: Request) {
  const proof = await request.json();

  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${process.env.WORLD_RP_ID}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(proof),
    }
  );

  return Response.json(await response.json(), { status: response.status });
}
```

**Source Notes**
- Source: `https://docs.world.org/api-reference/developer-portal/verify`
- Source: `https://docs.world.org/world-id/idkit/integrate`

#### GET /api/v2/minikit/transaction/{transaction_id}
**Kind:** endpoint

**Summary:** Returns current payment or transaction status for a submitted
MiniKit operation.

**Definition**
Language: http
```http
GET https://developer.world.org/api/v2/minikit/transaction/{transaction_id}?app_id=<app_id>&type=payment|transaction
```

**Guidance**
- Use this endpoint to reconcile `pay` and `sendTransaction` results from the
  backend.
- Treat `pending`, `mined`, and `failed` as different business states rather
  than just UI decoration.
- Store both your own `reference` and the returned `transaction_id` so retries
  and reconciliation remain deterministic.

**Example**
```ts
const status = await fetch(
  `https://developer.world.org/api/v2/minikit/transaction/${transactionId}?app_id=${appId}&type=payment`
).then((r) => r.json());

if (status.transaction_status === "mined") {
  await markPaymentComplete(status.reference, status.transaction_hash);
}
```

**Source Notes**
- Source: `https://docs.world.org/api-reference/developer-portal/get-transaction`
- Source: `https://docs.world.org/mini-apps/commands/pay`
- Source: `https://docs.world.org/mini-apps/commands/send-transaction`

### IDKit request and React surfaces

#### useIDKitRequest
**Kind:** hook

**Summary:** React hook that drives an IDKit request lifecycle and exposes open,
polling, and result state.

**Definition**
```ts
type IDKitRequestHookConfig = IDKitRequestConfig & {
  preset: Preset;
  polling?: {
    interval?: number;
    timeout?: number;
  };
};

type UseIDKitRequestHookResult = {
  open: () => void;
  reset: () => void;
  isAwaitingUserConnection: boolean;
  isAwaitingUserConfirmation: boolean;
  isSuccess: boolean;
  isError: boolean;
  connectorURI: string | null;
  result: IDKitResult | null;
  errorCode: IDKitErrorCodes | null;
  isOpen: boolean;
};

declare function useIDKitRequest(
  config: IDKitRequestHookConfig
): UseIDKitRequestHookResult;
```

**Guidance**
- Use this when you need custom React UI around the proof lifecycle instead of
  the prebuilt widget.
- Treat `rp_context` as server-issued data and fetch it just before opening the
  request.
- Keep the action, environment, and backend verification route aligned with the
  request configuration.

**Example**
```tsx
const request = useIDKitRequest({
  app_id: "app_xxxxx",
  action: "verify-account-2026",
  rp_context: rpContext,
  allow_legacy_proofs: true,
  environment: "production",
  preset: orbLegacy({ signal: userId }),
});

return <button onClick={request.open}>Verify with World ID</button>;
```

**Source Notes**
- Source: `npm:@worldcoin/idkit@4.0.9:dist/index.d.ts`

#### IDKitRequestWidget
**Kind:** component

**Summary:** Prebuilt React component for collecting a World ID request result
and routing success or error handling through callbacks.

**Definition**
```tsx
type IDKitRequestWidgetProps = IDKitRequestHookConfig & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleVerify?: (result: IDKitResult) => Promise<void> | void;
  onSuccess: (result: IDKitResult) => Promise<void> | void;
  onError?: (errorCode: IDKitErrorCodes) => Promise<void> | void;
  autoClose?: boolean;
  language?: "en" | "es" | "th";
};

declare function IDKitRequestWidget(
  props: IDKitRequestWidgetProps
): ReactElement | null;
```

**Guidance**
- Use this when the default widget is sufficient and you want the shortest path
  to an integrated React proof flow.
- Put backend verification in `handleVerify` or an equivalent server-backed path
  before unlocking privileged features in `onSuccess`.
- Keep `open` and `onOpenChange` controlled from your app state.

**Example**
```tsx
<IDKitRequestWidget
  open={open}
  onOpenChange={setOpen}
  app_id="app_xxxxx"
  action="verify-account-2026"
  rp_context={rpContext}
  allow_legacy_proofs={true}
  preset={orbLegacy({ signal: userId })}
  handleVerify={verifyOnBackend}
  onSuccess={unlockFeature}
/>
```

**Source Notes**
- Source: `https://docs.world.org/world-id/overview`
- Source: `npm:@worldcoin/idkit@4.0.9:dist/index.d.ts`

## Common Failure Modes
- verifying a proof or payment only on the client and granting access too early
- using `verify` for wallet login instead of `walletAuth`
- generating wallet-auth nonces or RP signatures on the client
- forgetting to persist `reference` and `transaction_id` values for payment or
  transaction reconciliation
- assuming permissions can be re-prompted indefinitely even after a user has
  already rejected or disabled them
- conflating MiniKit proof flows with current RP-signed IDKit request flows

## Must-Not-Regress Insights
- Client-side results are never the final source of truth for proof,
  authentication, or payment settlement.
- `walletAuth` and World ID verification solve different product problems and
  should remain separate in both implementation and explanation.
- RP signing keys stay server-side only.
- `pay` and `sendTransaction` are submission flows with later reconciliation.
- Permissions are contextual and should not be requested speculatively.

## Needs Verification
- The current localized-notification request shape beyond the documented
  `title` + `message` fallback is not elevated into a first-class symbol in the
  final pack.
- `MiniKit.getUserInfo` appears in package declarations, but the docs emphasize
  `getUserByAddress` and `getUserByUsername`; the final pack keeps focus on the
  better-documented helpers and workflows.
