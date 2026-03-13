# Kadena Pact Lang API Documentation Pack

## Target
- Pack: `agents/kadena/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `pact-lang-api@4.3.6`
- Docs anchor: current Kadena docs at `https://docs.kadena.io/`

## Source Inventory
- Current Kadena docs at `https://docs.kadena.io/`
- `npm:pact-lang-api@4.3.6`
- `agents/kadena/0.3.0.md` for coverage audit only

## Version Delta Audit
- The old pack targeted `^4.2.0`; current npm line is `4.3.6`.
- The public helper model remains fetch, crypto, lang, and wallet oriented.

## Decision Rules
- Use `fetch.local` for simulation and read-only evaluation.
- Use `fetch.send` for state-changing transactions and always follow with `listen` or `poll`.
- Build public metadata with `lang.mkMeta` and capabilities with `lang.mkCap`.
- Prefer wallet signing flows in end-user contexts.

## Common Confusions
- `creationTime` is in seconds, not milliseconds.
- `fetch.local` does not submit a transaction.
- `poll` and `listen` are post-submit observation APIs, not substitutes for send.

## Failure Modes
- Transactions fail because metadata was built with the wrong time units.
- Clients submit writes and never wait for final results.
- Browser code uses raw secret keys instead of wallet signing.

## Coverage Map

### Fetch
- `Pact.fetch.send`
- `Pact.fetch.local`
- `Pact.fetch.poll`
- `Pact.fetch.listen`
- `Pact.fetch.spv`

### Language And Crypto
- `Pact.lang.mkMeta`
- `Pact.lang.mkCap`
- `Pact.crypto.genKeyPair`

### Wallet
- `Pact.wallet.sign`
- `Pact.wallet.sendSigned`

## Must-Not-Regress Insights
- Preserve the send/local/poll/listen distinction.
- Preserve seconds-based `mkMeta` guidance.
- Preserve wallet-signing preference for browser and end-user flows.
