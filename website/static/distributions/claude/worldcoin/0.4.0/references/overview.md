# Worldcoin Overview

## Snapshot

- Spec name: worldcoin
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + minikit-js^1.11.0 + idkit^4.0.9
- Primary language: typescript
- Homepage: https://developer.worldcoin.org
- Source set: https://docs.world.org/mini-apps, https://docs.world.org/mini-apps/commands/verify, https://docs.world.org/mini-apps/commands/wallet-auth, https://docs.world.org/mini-apps/commands/pay, https://docs.world.org/mini-apps/commands/send-transaction, https://docs.world.org/mini-apps/commands/request-permission, https://docs.world.org/mini-apps/commands/get-permissions, https://docs.world.org/api-reference/developer-portal/verify, https://docs.world.org/api-reference/developer-portal/get-transaction, https://docs.world.org/api-reference/developer-portal/send-notification, https://docs.world.org/world-id/overview, https://docs.world.org/world-id/idkit/integrate, npm:@worldcoin/minikit-js@1.11.0, npm:@worldcoin/idkit@4.0.9, npm:@worldcoin/idkit-core@4.0.13

**Tags**
- worldcoin
- world-id
- mini-apps
- minikit
- wallet-auth
- payments
- notifications
- typescript

## Purpose

This pack teaches an agent to build and reason about World Mini Apps, World ID
proof workflows, wallet-auth flows, payment and transaction requests, and
backend verification or reconciliation paths without collapsing those distinct
trust models into one undifferentiated client flow.

## Guiding Principles

- Treat MiniKit command success as client-side submission only; trusted backend verification or reconciliation is the actual source of truth.
- Use `walletAuth` for Mini App login and session establishment; do not use proof verification flows as a substitute for login.
- Keep World ID proof flows separate from wallet-auth flows and separate both from payment or transaction flows.
- Keep RP signing keys, wallet-auth nonce issuance, and proof verification on the backend.
- Use `pay` only for the simplified WLD or USDC World Chain payment path; use `sendTransaction` for arbitrary contract calls or Permit2 flows.
- Persist correlation identifiers such as nonce, `reference`, `transaction_id`, and returned proof payloads so retries and reconciliation remain deterministic.
- Ask for permissions contextually and check current grant state before prompting again.
- Use the current `v4` verify endpoint with `rp_id` when building current IDKit-based World ID flows, and treat older app-id-only paths as compatibility surfaces.

## Boundary Notes

- Source material: current World docs for Mini Apps, command pages, Developer Portal API reference, World ID overview, and current IDKit integration docs, plus version-matched declarations from `@worldcoin/minikit-js@1.11.0`, `@worldcoin/idkit@4.0.9`, and `@worldcoin/idkit-core@4.0.13`.
- `agents/worldcoin/0.3.0.md` was used only for coverage audit and to preserve still-valid guidance around backend verification, payment reconciliation, allowlists, and safe message-signing boundaries.
- The pack is organized around the current trust boundaries: MiniKit runtime, MiniKit command flows, backend verification and reconciliation, then IDKit React request flows.
- The current World docs expose both newer RP-based `v4` verification and Mini App-specific flows that still surface app-oriented helpers. This pack keeps those flows separate instead of flattening them into one model.
- Wallet-auth flows, World ID proof flows, payment flows, and notification flows all remain first-class but distinct.
- Needs verification: the send-notification endpoint documents both legacy `title` plus `message` payloads and localized payloads. This pack documents the baseline endpoint contract and leaves deeper localized-shape modeling out of first-class symbol coverage.

## FAQ

### When should an agent choose `walletAuth` over `verify`?
Choose `walletAuth` for login or session establishment. Choose `verify` or
IDKit flows when the product requirement is proof-of-human or credential-backed
verification rather than wallet control.

### When should an agent choose MiniKit verify over IDKit?
Choose MiniKit verify for Mini App-native proof flows inside World App. Choose
IDKit when the product needs the current World ID request model across web or
React integrations with explicit RP signing and `v4` backend verification.

### Can the app trust MiniKit command success payloads directly?
No. They are client-side submission results. Trusted backend verification or
reconciliation is still required before changing durable business state.

### Should an agent still use typed-data signing as a first choice?
No. Current `@worldcoin/minikit-js@1.11.0` declarations explicitly mark
`signTypedData` as deprecated and recommend `signMessage` or
`sendTransaction` instead.

## External Resources

- Mini Apps docs: https://docs.world.org/mini-apps
- World ID overview: https://docs.world.org/world-id/overview
- IDKit integration guide: https://docs.world.org/world-id/idkit/integrate
- Verify endpoint reference: https://docs.world.org/api-reference/developer-portal/verify
- Get Transaction endpoint reference: https://docs.world.org/api-reference/developer-portal/get-transaction
- Send Notification endpoint reference: https://docs.world.org/api-reference/developer-portal/send-notification
