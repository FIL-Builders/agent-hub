# Kadena Pact Lang API API Groups

### Fetch Helpers
**Exports**
- Pact.fetch.send
- Pact.fetch.local
- Pact.fetch.poll
- Pact.fetch.listen
- Pact.fetch.spv

Submission, simulation, observation, and proof helpers for Pact commands.

#### Pact.fetch.send
**Kind**
function

**Summary**
Submit one or more execution or continuation commands to a Chainweb host.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.fetch.send([execCmd | contCmd], apiHost) -> { requestKeys: string[] }
```

**Guidance**
- Use this only for state-changing execution flows.
- Capture the returned request keys durably; they are the canonical correlation handles for later observation.
- Simulate first with `Pact.fetch.local` if the flow is risky or user-facing.

**Example**
Language: javascript
Description: Submit an execution command and capture the request key.

```js
const { requestKeys } = await Pact.fetch.send([cmd], API_HOST);
```

#### Pact.fetch.local
**Kind**
function

**Summary**
Evaluate a command locally without submitting a state-changing transaction.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.fetch.local(execCmd, apiHost) -> { result: unknown }
```

**Guidance**
- Use this for reads and for preflight simulation of writes.
- Keep in mind that successful local evaluation does not guarantee on-chain success under later state changes.
- Use realistic metadata and caps so simulation stays close to the eventual send path.

**Example**
Language: javascript
Description: Evaluate a command locally.

```js
const result = await Pact.fetch.local(cmd, API_HOST);
```

#### Pact.fetch.poll
**Kind**
function

**Summary**
Poll a batch of request keys until results are available.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.fetch.poll({ requestKeys: string[] }, apiHost) -> Record<string, unknown>
```

**Guidance**
- Use this for batch observation when multiple request keys are in flight.
- Apply backoff and timeout behavior in production instead of tight loops.
- Keep request keys durable across process restarts if the workflow matters operationally.

**Example**
Language: javascript
Description: Poll a batch of request keys.

```js
const out = await Pact.fetch.poll({ requestKeys }, API_HOST);
```

#### Pact.fetch.listen
**Kind**
function

**Summary**
Wait for a single request key to produce a final result.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.fetch.listen({ listen: string }, apiHost) -> unknown
```

**Guidance**
- Use this when a single submitted transaction is the main thing you care about.
- Prefer this to ad hoc receipt polling loops for one-off submissions.
- Keep the request key that `send` returned unchanged when calling `listen`.

**Example**
Language: javascript
Description: Listen for a single request key.

```js
const result = await Pact.fetch.listen({ listen: reqKey }, API_HOST);
```

#### Pact.fetch.spv
**Kind**
function

**Summary**
Fetch an SPV proof for a request key and target chain.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.fetch.spv({ requestKey, targetChainId }, apiHost) -> string
```

**Guidance**
- Use this only for cross-chain proof workflows, not ordinary same-chain command observation.
- Treat the returned proof as a separate artifact from the original request key and result.
- Keep target-chain choice explicit; proof generation depends on the intended target context.

**Example**
Language: javascript
Description: Fetch an SPV proof.

```js
const proof = await Pact.fetch.spv({ requestKey, targetChainId }, API_HOST);
```

### Language And Crypto Helpers
**Exports**
- Pact.lang.mkMeta
- Pact.lang.mkCap
- Pact.crypto.genKeyPair

Metadata and capability builders plus raw key generation primitives.

#### Pact.lang.mkMeta
**Kind**
function

**Summary**
Build the public transaction metadata required by Pact command construction.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.lang.mkMeta(sender, chainId, gasPrice, gasLimit, creationTime, ttl) -> {
  sender, chainId, gasPrice, gasLimit, creationTime, ttl
}
```

**Guidance**
- `creationTime` must be in seconds, not milliseconds.
- Keep gas inputs explicit and realistic; they are part of the public command contract.
- Build metadata once per submission path rather than mutating it after signing.

**Example**
Language: javascript
Description: Build transaction metadata with a seconds-based timestamp.

```js
const meta = Pact.lang.mkMeta(
  "k:pubkey",
  "1",
  0.0000001,
  600,
  Math.floor(Date.now() / 1000) - 5,
  600
);
```

#### Pact.lang.mkCap
**Kind**
function

**Summary**
Construct a capability descriptor for explicit wallet or signature authorization.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.lang.mkCap(role, description, name, ...args) -> object
```

**Guidance**
- Use capabilities to make signer intent explicit instead of relying on loose account assumptions.
- Keep the capability arguments symmetric with the contract call you intend to authorize.
- Pair these outputs with wallet signing in end-user flows.

**Example**
Language: javascript
Description: Create a coin transfer capability.

```js
const cap = Pact.lang.mkCap(
  "Coin Transfer",
  "Spend from sender to receiver",
  "coin.TRANSFER",
  "sender",
  "receiver",
  1.0
);
```

#### Pact.crypto.genKeyPair
**Kind**
function

**Summary**
Generate a public and secret keypair for low-level signing workflows.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.crypto.genKeyPair() -> { publicKey: string, secretKey: string }
```

**Guidance**
- Use this in controlled environments; avoid shipping raw secret keys into browser applications.
- Treat the secret key as sensitive material with the same operational rigor as any signing credential.
- Prefer wallet-backed flows where a human user is involved.

**Example**
Language: javascript
Description: Generate a raw keypair.

```js
const kp = Pact.crypto.genKeyPair();
```

### Wallet Helpers
**Exports**
- Pact.wallet.sign
- Pact.wallet.sendSigned

Wallet-mediated signing and submission for end-user or browser contexts.

#### Pact.wallet.sign
**Kind**
function

**Summary**
Request a Pact-compatible wallet to sign a prepared command and capability set.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.wallet.sign(signingCmd) -> execCmd
```

**Guidance**
- Prefer this over raw secret-key signing in end-user environments.
- Keep the payload stable after signing; mutating it afterward invalidates the signature.
- Pair `mkMeta` and `mkCap` outputs carefully so the wallet prompt matches user intent.

**Example**
Language: javascript
Description: Request wallet signing for a prepared command.

```js
const signed = await Pact.wallet.sign({
  pactCode,
  caps,
  sender: meta.sender,
  chainId: meta.chainId,
  gasLimit: meta.gasLimit,
  gasPrice: String(meta.gasPrice),
  networkId,
  nonce: String(Date.now())
});
```

#### Pact.wallet.sendSigned
**Kind**
function

**Summary**
Submit a command that has already been signed by a Pact-compatible wallet.

**Definition**
Language: javascript
Source: agents/kadena/0.3.0.md coverage audit aligned to current package line

```js
Pact.wallet.sendSigned(execCmd, apiHost) -> { requestKeys: string[] }
```

**Guidance**
- Use this immediately after `Pact.wallet.sign` or another compatible external signing path.
- Keep the signed payload intact; it must still include its hash, signatures, and command bytes.
- Follow submission with `listen` or `poll` just as you would with `Pact.fetch.send`.

**Example**
Language: javascript
Description: Submit a wallet-signed command.

```js
const { requestKeys } = await Pact.wallet.sendSigned(signed, API_HOST);
```
