# Flow API Groups

### FCL Setup And Current User
**Exports**
- config
- currentUser
- authenticate

Core FCL configuration and browser wallet-auth primitives.

#### config
**Kind**
function

**Summary**
Configure FCL with access-node, discovery, and network settings before using wallet or chain helpers.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export {
  config,
  flowMainnet,
  flowTestnet,
  flowEmulator,
} from "@onflow/fcl-core";
```

**Guidance**
- Configure `accessNode.api`, `discovery.wallet`, and the network context explicitly before auth or chain calls.
- Keep emulator, testnet, and mainnet values isolated; wallet discovery and access-node settings must match the target network.
- Broken configuration causes many downstream failures that look like wallet or Cadence issues.

**Example**
Language: javascript
Description: Configure FCL for testnet browser use.

```js
import * as fcl from "@onflow/fcl";

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet",
});
```

#### currentUser
**Kind**
object

**Summary**
Reactive FCL current-user service for session, auth state, and wallet-backed authorization behavior.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export declare const currentUser: CurrentUserService;
```

**Guidance**
- Use this to subscribe to auth-state changes and inspect the current wallet-backed user.
- Treat it as browser-oriented state; do not assume the same behavior in server-only runtimes.
- Use `snapshot()` or `subscribe()` when UI state depends on whether a wallet session exists.

**Example**
Language: javascript
Description: React to auth-state changes.

```js
import * as fcl from "@onflow/fcl";

const unsubscribe = fcl.currentUser.subscribe((user) => {
  console.log("logged in?", user.loggedIn, user.addr);
});
```

#### authenticate
**Kind**
function

**Summary**
Start a wallet-authentication flow through the configured Flow discovery and wallet services.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export declare const authenticate: (opts?: {}) => Promise<CurrentUser>;
```

**Guidance**
- Use this in browser contexts where wallet interaction is expected.
- Authentication is not the same thing as script execution or transaction success; keep auth, signing, and on-chain results separate in the app model.
- Make sure `discovery.wallet` is configured before calling it.

**Example**
Language: javascript
Description: Prompt a user to connect a wallet.

```js
import * as fcl from "@onflow/fcl";

await fcl.authenticate();
```

### Cadence Scripts And Read Helpers
**Exports**
- query
- account
- block

High-level read paths for scripts and common account or block lookups.

#### query
**Kind**
function

**Summary**
Execute a read-only Cadence script and return the decoded result.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export {
  query,
  arg,
  args,
  t,
} from "@onflow/fcl-core";
```

**Guidance**
- Use this for read-only Cadence logic; do not use it for state changes.
- Cadence arguments must be encoded with Flow types rather than generic ABI assumptions.
- Keep scripts small and deterministic when using them in app-facing reads.

**Example**
Language: javascript
Description: Run a simple Cadence script with typed arguments.

```js
import * as fcl from "@onflow/fcl";

const result = await fcl.query({
  cadence: `
    access(all) fun main(a: Int, b: Int): Int {
      return a + b
    }
  `,
  args: (arg, t) => [arg(7, t.Int), arg(6, t.Int)],
});
```

#### account
**Kind**
function

**Summary**
Convenience helper for reading Flow account information.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export { account } from "@onflow/fcl-core";
```

**Guidance**
- Use this when the task is a straightforward account lookup and FCL’s higher-level helper is sufficient.
- Keep address formatting explicit and consistent with Flow address conventions.
- If you need lower-level composition or transport control, switch to the SDK builders instead of overloading this helper.

**Example**
Language: javascript
Description: Read a Flow account through FCL.

```js
import * as fcl from "@onflow/fcl";

const acct = await fcl.account("0x1cf0e2f2f715450");
console.log(acct.address);
```

#### block
**Kind**
function

**Summary**
Convenience helper for reading Flow block information.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export { block } from "@onflow/fcl-core";
```

**Guidance**
- Use this for ordinary block lookups without dropping to low-level builder composition.
- Be explicit about whether the task needs the latest block or a historical anchor.
- Do not confuse ordinary block reads with the old access-stream subscription model.

**Example**
Language: javascript
Description: Read the latest block through FCL.

```js
import * as fcl from "@onflow/fcl";

const latest = await fcl.block({ sealed: true });
console.log(latest.height);
```

### Transactions And Status Observation
**Exports**
- mutate
- tx
- getTransactionStatus

State-changing Cadence submission and post-submission status handling.

#### mutate
**Kind**
function

**Summary**
Submit a Cadence transaction through FCL and return the resulting transaction ID.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export declare const mutate: (
  opts?: MutateOptions
) => Promise<string>;
```

**Guidance**
- Use this for state-changing Cadence transactions, typically with wallet-backed authorization.
- The returned value is a tx ID, not final success; always follow it with status observation.
- Keep proposer, payer, authorizers, and compute limit explicit when the transaction is nontrivial.

**Example**
Language: javascript
Description: Submit a Flow transaction and get the tx ID.

```js
import * as fcl from "@onflow/fcl";

const txId = await fcl.mutate({
  cadence: `
    transaction(message: String) {
      prepare(signer: auth(Storage) &Account) {
        log(message)
      }
    }
  `,
  args: (arg, t) => [arg("hello flow", t.String)],
  limit: 50,
});
```

#### tx
**Kind**
function

**Summary**
Create a transaction-observer handle for status polling and lifecycle observation.

**Definition**
Language: typescript
Source: npm:@onflow/fcl@1.21.9:package/types/fcl.d.ts

```ts
export {
  tx,
  getTransactionStatus,
  getTransaction,
} from "@onflow/fcl-core";
```

**Guidance**
- Use `tx(txId)` after `mutate()` to wait for state transitions or final seals.
- Keep submission and observation separate in your application logic so retries and UI state remain sane.
- Treat long-running transactions as asynchronous workflows, not immediate request-response success.

**Example**
Language: javascript
Description: Wait for a submitted transaction to seal.

```js
import * as fcl from "@onflow/fcl";

const onceSealed = await fcl.tx(txId).onceSealed();
console.log(onceSealed.status);
```

#### getTransactionStatus
**Kind**
function

**Summary**
Low-level builder helper for fetching transaction status through the Flow interaction pipeline.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { getTransactionStatus } from "./build/build-get-transaction-status";
```

**Guidance**
- Use this when you need explicit interaction composition instead of FCL’s `tx()` convenience layer.
- It is part of the lower-level SDK model; do not reach for it first in ordinary app code.
- Useful when integrating custom pipelines around `build`, `send`, and `decode`.

**Example**
Language: javascript
Description: Build a lower-level transaction-status request.

```js
import { build, send, decode, getTransactionStatus } from "@onflow/sdk";
import { config } from "@onflow/config";

config().put("accessNode.api", "https://rest-testnet.onflow.org");

const response = await send([getTransactionStatus(txId)]);
const status = await decode(response);
```

### Low-Level SDK Interaction Builders
**Exports**
- build
- send
- decode
- transaction
- script
- args
- arg

Lower-level interaction pipeline for advanced control beyond FCL conveniences.

#### build
**Kind**
function

**Summary**
Compose Flow interactions from explicit builder functions before sending them to an access node.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { build } from "./build/build";
```

**Guidance**
- Use this when you need more explicit composition than FCL’s high-level helpers provide.
- Keep the interaction type explicit; a script interaction and a transaction interaction should not share assumptions.
- For ordinary app work, prefer FCL unless you truly need the lower-level control.

**Example**
Language: javascript
Description: Compose a script interaction by hand.

```js
import { build, script, args, arg, send, decode } from "@onflow/sdk";
import * as t from "@onflow/types";

const ix = await build([
  script`access(all) fun main(x: Int): Int { return x }`,
  args([arg(7, t.Int)]),
]);

const result = await decode(await send(ix));
```

#### send
**Kind**
function

**Summary**
Dispatch a built Flow interaction through the configured transport.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export {
  send,
  subscribe,
  subscribeRaw,
} from "./transport";
```

**Guidance**
- Use this as part of the lower-level SDK pipeline after building an interaction.
- Transport errors and decoding are separate concerns; keep them explicit in error handling.
- This is not a replacement for FCL wallet-auth orchestration.

**Example**
Language: javascript
Description: Send a previously built interaction.

```js
const response = await send(ix);
```

#### decode
**Kind**
function

**Summary**
Decode an access-node response into a usable JavaScript value.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { decode } from "./decode/sdk-decode";
```

**Guidance**
- Use this after `send()` in the low-level pipeline.
- Keep transport, response, and decoded value handling separate so debugging stays straightforward.
- Cadence typing still matters even after decoding; decoded output should be interpreted in the Cadence schema you requested.

**Example**
Language: javascript
Description: Decode a lower-level Flow response.

```js
const decoded = await decode(response);
```

#### transaction
**Kind**
function

**Summary**
Low-level builder for a Cadence transaction interaction.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { transaction } from "./build/build-transaction";
```

**Guidance**
- Use this only in the lower-level SDK flow when you need explicit control over the interaction.
- Keep it distinct from `script`; transactions change state and require authorization roles.
- Do not import EVM contract-call assumptions into Cadence transaction construction.

**Example**
Language: javascript
Description: Start a low-level transaction interaction.

```js
import { transaction } from "@onflow/sdk";

const txBuilder = transaction`
  transaction {
    prepare(signer: auth(Storage) &Account) {}
  }
`;
```

#### script
**Kind**
function

**Summary**
Low-level builder for a read-only Cadence script interaction.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { script } from "./build/build-script";
```

**Guidance**
- Use this for read-only Cadence execution in the low-level pipeline.
- Keep script and transaction interactions clearly separated because their downstream handling differs.
- Prefer FCL’s `query()` unless the task actually benefits from manual interaction composition.

**Example**
Language: javascript
Description: Start a low-level script interaction.

```js
import { script } from "@onflow/sdk";

const scriptBuilder = script`
  access(all) fun main(): String { return "hello" }
`;
```

#### args
**Kind**
function

**Summary**
Attach an ordered Cadence argument list to an interaction.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { args, arg } from "./build/build-arguments";
```

**Guidance**
- Use `args([...])` with `arg(value, type)` to encode Cadence parameters correctly.
- This is where EVM habits most often break Flow interactions; Flow arguments are typed explicitly.
- Match the argument order and types exactly to the Cadence signature.

**Example**
Language: javascript
Description: Attach typed Cadence arguments in the low-level SDK.

```js
import { args, arg } from "@onflow/sdk";
import * as t from "@onflow/types";

const builtArgs = args([arg("0x1", t.Address), arg(5, t.Int)]);
```

#### arg
**Kind**
function

**Summary**
Create one typed Cadence argument for use in a Flow script or transaction interaction.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { args, arg } from "./build/build-arguments";
```

**Guidance**
- Use this to declare both the value and the Flow type explicitly.
- Incorrect types are a common source of broken Cadence interactions.
- Prefer explicitness over convenience when building reusable interaction helpers.

**Example**
Language: javascript
Description: Create a typed Cadence string argument.

```js
import { arg } from "@onflow/sdk";
import * as t from "@onflow/types";

const messageArg = arg("hello", t.String);
```

### Events And Stream Boundaries
**Exports**
- subscribeEvents
- Stream subscriptions boundary

Event-oriented reads and the boundary to the older access-stream model.

#### subscribeEvents
**Kind**
function

**Summary**
Lower-level helper for subscribing to Flow event streams through the SDK transport layer.

**Definition**
Language: typescript
Source: npm:@onflow/sdk@1.13.7:package/types/sdk.d.ts

```ts
export { subscribeEvents } from "./build/build-subscribe-events";
```

**Guidance**
- Use this when the task genuinely needs event subscription or monitoring behavior.
- It is not the default answer for ordinary account, script, or transaction app work.
- Preserve backoff, resume, and duplicate-handling discipline when building stream consumers.

**Example**
Language: javascript
Description: Build an event-subscription interaction at the SDK layer.

```js
import { subscribeEvents } from "@onflow/sdk";

const eventsIx = subscribeEvents({
  startHeight: 100,
  eventTypes: ["A.0ae53cb6e3f42a79.FlowToken.TokensDeposited"],
});
```

#### Stream subscriptions boundary
**Kind**
other

**Summary**
The older access-stream websocket API remains useful for specialized monitoring, but it is not the main Flow app entrypoint.

**Definition**
Language: markdown
Source: agents/flow/0.3.0.md coverage audit + current Flow docs boundary guidance

```md
Use stream subscriptions when the task is fundamentally event-driven or monitoring-oriented.
Use FCL plus ordinary access-node reads for normal app auth, scripts, and transactions.
```

**Guidance**
- Preserve the old pack’s stream expertise as a boundary rather than letting it dominate the new pack.
- Reach for streaming when the requirement is ongoing observation, not when a single read or tx-status poll would do.
- Keep stream subscriptions and ordinary request-response reads as distinct operational modes.

**Example**
Language: markdown
Description: Decision rule for choosing between streaming and normal app flows.

```md
If the task is "watch events continuously", use stream tooling.
If the task is "authenticate, read, or submit once", use FCL first.
```
