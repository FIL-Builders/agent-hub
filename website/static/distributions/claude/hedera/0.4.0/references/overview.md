# Hedera Overview

## Snapshot

- Spec name: hedera
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + @hashgraph/sdk^2.80.0
- Primary language: javascript
- Homepage: https://docs.hedera.com/hedera/getting-started-sdk-developers/quickstart
- Source set: official Hedera docs for SDK, mirror node REST, tokens, topics, contracts, and local development; `npm:@hashgraph/sdk@2.80.0`; `npm:@hashgraph/hedera-local@2.39.4` for local-network context; `parse/hedera-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/hedera/0.3.0.md` for coverage audit only

**Tags**
- hedera
- hiero
- sdk
- mirror-node
- hbar
- hts
- hcs
- smart-contracts

## Purpose

This pack teaches an agent to use Hedera as a developer platform: configure the JavaScript SDK correctly, submit and confirm account, token, topic, and contract workflows against consensus nodes, use mirror-node REST for indexed reads, and keep Hedera-specific identity, receipt, and mirror-node consistency rules explicit.

## Guiding Principles

- Use the JavaScript SDK as the default path for writes, receipts, and authoritative query semantics.
- Treat mirror-node REST as an indexed read model, not the transaction-submission path.
- Wait for a receipt before treating a submitted write as finalized, then expect mirror-node visibility to lag.
- Keep Hedera account IDs, aliases, and EVM addresses distinct unless a source explicitly allows all three.
- Preserve token-association, receiver-signature, and topic-submit authority checks as first-class workflow constraints.
- Keep consensus-node contract queries and mirror-node contract simulation separate.

## Boundary Notes

- The old `0.3.0` pack was effectively a mirror-node REST pack. It was strong for indexed reads, but too narrow for ordinary Hedera development.
- This pack broadens the model around the current JavaScript SDK while preserving the old pack's strongest mirror-node guidance.
- Current upstream branding increasingly uses `Hiero`, but the practical npm package anchors for this pack remain in the `@hashgraph/*` namespace. The pack keeps that mismatch explicit to prevent bad import advice.
- `Client` remains the ordinary Node.js entrypoint in `@hashgraph/sdk`, and mirror-node functionality appears both as REST endpoints and as SDK helper queries for specific contract-read paths.
- `agents/hedera/0.3.0.md` was used only for coverage audit and valid mirror-node guidance, not as the contract source.

## FAQ

### Should I use mirror-node REST or the SDK for a read?
Use the SDK when you need consensus-node query semantics tied closely to transaction or receipt workflows. Use mirror-node REST when you need indexed, REST-friendly views for UI, reporting, and post-consensus inspection.

### Is `Client` still the right import if the docs mention `Hiero`?
Yes. Current docs increasingly use the `Hiero` brand, but the practical npm package anchor for this pack is still `@hashgraph/sdk`, and `Client` remains the ordinary JavaScript entrypoint there.

### When should I prefer `ContractCallQuery` over mirror-node contract simulation?
Prefer `ContractCallQuery` when the workflow already lives in SDK query semantics. Prefer mirror-node simulation when the product or tooling explicitly depends on mirror-node infrastructure or REST-oriented simulation behavior.

## External Resources

- Hedera Quickstart: https://docs.hedera.com/hedera/getting-started-sdk-developers/quickstart
- Hedera Mirror Node REST Docs: https://docs.hedera.com/hedera/sdks-and-apis/rest-api
- Hedera JavaScript SDK Package: https://www.npmjs.com/package/@hashgraph/sdk
- Hedera Local Package: https://www.npmjs.com/package/@hashgraph/hedera-local
