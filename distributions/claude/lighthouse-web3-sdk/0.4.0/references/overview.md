# Lighthouse Web3 SDK Overview

## Snapshot

- Spec name: lighthouse-web3/sdk
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: @lighthouse-web3/sdk^0.4.4
- Primary language: typescript
- Homepage: https://docs.lighthouse.storage/
- Source set: current Lighthouse docs at `https://docs.lighthouse.storage/`; `npm:@lighthouse-web3/sdk@0.4.4`; `parse/lighthouse-web3-sdk-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/lighthouse-web3-sdk/0.3.0.md` for coverage audit only

**Tags**
- storage
- ipfs
- filecoin
- lighthouse
- encryption
- ipns

## Purpose

This pack teaches an agent to use the Lighthouse Web3 SDK at a senior-developer level: create or manage an SDK wallet, produce signed auth messages, obtain short-lived upload auth where needed, upload encrypted content correctly, inspect uploaded files, and separate upload completion from deal durability.

## Guiding Principles

- Start encrypted flows with wallet and auth helpers rather than improvising signatures by hand.
- Treat one-time auth as an ephemeral credential for a specific operation.
- Preserve CIDs as canonical identifiers and treat gateway URLs as interchangeable delivery layers.
- Separate upload completion, access-control state, and Filecoin deal durability in application logic.
- Surface progress, retries, and post-upload polling explicitly for large or critical datasets.

## Boundary Notes

- The old `0.3.0` pack targeted `^0.4.2`; the current package line is `0.4.4`, with the same high-value workflows around auth, encrypted upload, listing, and deal inspection.
- This port keeps the strongest old guidance while restructuring the SDK around auth, upload, and retrieval/status phases.
- Current package and docs anchors are used for versioning and operational framing. The old pack is retained only for coverage audit.

## FAQ

### Should I store gateway URLs?
No. Store the CID. Delivery endpoints can vary, but the CID remains the canonical content identifier.

### Is oneTimeAuth a long-lived credential?
No. Treat it as an ephemeral token for the immediate operation it was created for.

## External Resources

- Lighthouse docs: https://docs.lighthouse.storage/
- Lighthouse npm package: https://www.npmjs.com/package/@lighthouse-web3/sdk
