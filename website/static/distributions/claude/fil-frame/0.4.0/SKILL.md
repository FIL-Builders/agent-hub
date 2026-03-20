---
name: fil-frame
description: Use for FIL-Frame tasks. Helps with fIL-Frame at a senior-developer level: deploy and verify the Filecoin deal contracts, prepare upload metadata and CommP-derived deal parameters correctly, bridge Next.js form state into the onchain `DealRequest` shape, and keep storage-onramp behavior separate from actual Filecoin deal publication.
---

# FIL-Frame

Use this skill when the task depends on FIL-Frame-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use FIL-Frame at a senior-developer level: deploy and verify the Filecoin deal contracts, prepare upload metadata and CommP-derived deal parameters correctly, bridge Next.js form state into the onchain `DealRequest` shape, and keep storage-onramp behavior separate from actual Filecoin deal publication.

## When to use this skill

- FIL-Frame setup and implementation work
- FIL-Frame API usage and configuration decisions
- FIL-Frame-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat FIL-Frame as a starter-template monorepo with two main layers: Hardhat/Filecoin contract automation and Next.js/frontend helper flows.
- Upload and derive piece metadata before building and submitting the onchain deal request.
- Keep `piece_cid`, payload CID, CAR link, and label semantics separate; only `piece_cid` bytes belong in the contract request field.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
