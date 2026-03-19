# FIL-Frame Overview

## Snapshot

- Spec name: fil-frame
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: fil-frame^0.0.1 + @fil-frame/nextjs^0.1.0
- Primary language: typescript
- Homepage: https://github.com/FIL-Builders/fil-frame
- Source set: FIL-Frame repository README and raw sources on `main`; root and workspace package manifests; `parse/fil-frame-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/fil-frame/0.3.0.md` for coverage audit only

**Tags**
- filecoin
- fvm
- hardhat
- nextjs
- viem
- wagmi
- lighthouse
- pinata
- commp

## Purpose

This pack teaches an agent to use FIL-Frame at a senior-developer level: deploy and verify the Filecoin deal contracts, prepare upload metadata and CommP-derived deal parameters correctly, bridge Next.js form state into the onchain `DealRequest` shape, and keep storage-onramp behavior separate from actual Filecoin deal publication.

## Guiding Principles

- Treat FIL-Frame as a starter-template monorepo with two main layers: Hardhat/Filecoin contract automation and Next.js/frontend helper flows.
- Upload and derive piece metadata before building and submitting the onchain deal request.
- Keep `piece_cid`, payload CID, CAR link, and label semantics separate; only `piece_cid` bytes belong in the contract request field.
- Regenerate typed ABIs after deploys and use those generated artifacts in UI code instead of hand-maintaining stale contract shapes.
- Use the Filfox-specific verification task on Filecoin networks and ordinary Hardhat verification elsewhere.
- Treat provider upload helpers as asynchronous external systems; poll or retry where the code and docs indicate delayed metadata availability.
- Prefer the current Lighthouse helper path for ordinary template work, and treat the older Pinata plus hard-coded-address component as a legacy/example path.

## Boundary Notes

- This pack keeps the strong repo-specific guidance from the older `0.3.0` pack, but reorganizes it around the current monorepo boundaries and the v0.4 symbol structure.
- The highest-value contract surfaces still come from `packages/hardhat/contracts`, `tasks`, and `deploy`; those are the authoritative sources for the deal request and verification workflows.
- The frontend contract bridge lives in `packages/nextjs/app/dealClient/utils.ts`, which provides the compact ABI fragment and helper functions used to build the `DealRequest` tuple.
- The current repository README still frames FIL-Frame as a Filecoin quickstart with multiple storage onramp options, but the checked-in app code is clearest for Lighthouse, Pinata, and example upload flows.
- `agents/fil-frame/0.3.0.md` was used only to preserve still-valid operational insights; definitions here are anchored to the current repository sources.

## FAQ

### Is uploading to Lighthouse or Pinata enough to create a Filecoin deal?
No. Upload flows prepare the file, CAR, and piece metadata. A Filecoin deal exists only after the onchain proposal and later market lifecycle succeed.

### Which upload path should a new integration prefer?
Prefer the Lighthouse hook and route flow for ordinary template usage. Use the older Pinata-oriented component only when the task specifically needs that example path and you are willing to modernize it.

## External Resources

- Repository: https://github.com/FIL-Builders/fil-frame
- README: https://raw.githubusercontent.com/FIL-Builders/fil-frame/main/README.md
- DealClient contract: https://raw.githubusercontent.com/FIL-Builders/fil-frame/main/packages/hardhat/contracts/DealClient.sol
- DealInfo contract: https://raw.githubusercontent.com/FIL-Builders/fil-frame/main/packages/hardhat/contracts/DealInfo.sol
