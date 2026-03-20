# Filecoin Synapse SDK Overview

## Snapshot

- Spec name: filecoin-synapse-sdk
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + @filoz/synapse-sdk^0.39.0 + @filoz/synapse-core^0.3.0
- Primary language: typescript
- Homepage: https://synapse.filecoin.services/
- Source set: official Synapse docs and package README; `npm:@filoz/synapse-sdk@0.39.0`; `npm:@filoz/synapse-core@0.3.0`; `parse/filecoin-synapse-sdk-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/filecoin-synapse-sdk/0.3.0.md` for coverage audit only

**Tags**
- filecoin
- synapse
- storage
- payments
- warm-storage
- filbeam
- viem
- typescript

## Purpose

This pack teaches an agent to use the current Filecoin Synapse SDK at a senior-developer level: initialize the top-level `Synapse` object with the current viem-based model, manage payment balances and service approvals correctly, use storage-manager and storage-context workflows appropriately, inspect provider and warm-storage state, and avoid carrying forward outdated `0.24.x` assumptions.

## Guiding Principles

- Start with the high-level `Synapse` entrypoint and only drop to subservices when the task clearly requires it.
- Treat wallet balances, Synapse account balances, and settlement state as separate layers.
- Use `prepare()` or upload-cost inspection when the workflow is cost-sensitive.
- Keep default storage-manager flows separate from explicit storage-context control.
- Treat FilBeam analytics and retrieval information as supporting data, not the source of truth for onchain payment or storage state.
- Keep the current viem-based setup explicit and avoid preserving the older async ethers-first model.

## Boundary Notes

- The old `0.3.0` pack reflected `0.24.x` Synapse SDK behavior. It had good storage and payment instincts, but too much of the surface is now different to preserve its contracts directly.
- Current `@filoz/synapse-sdk@0.39.0` is built around viem clients, not ethers-first setup, and `Synapse.create()` is synchronous.
- The current high-value surface is broader than Warm Storage alone: payments, storage manager, explicit storage contexts, provider registry, and FilBeam analytics are all first-class.
- The package still preserves older terminology context in migration notes, but the practical contract surface now centers service objects and types exported from `@filoz/synapse-core`.
- `agents/filecoin-synapse-sdk/0.3.0.md` was used only for coverage audit and retained guidance, not as the contract source.

## FAQ

### Is `Synapse.create()` async?
Not in the current `0.39.0` package contracts. Older packs and examples may still suggest an async flow, but the current type surface defines it as synchronous.

### Should I use the default storage manager or an explicit storage context?
Use the default manager for ordinary uploads. Use an explicit context when provider, dataset, or metadata selection must be controlled directly.

### Are FilBeam stats the same as payment or storage truth?
No. They are useful analytics and retrieval-related metrics, but they do not replace onchain payment, approval, or storage state.

## External Resources

- Synapse Docs: https://synapse.filecoin.services/
- Synapse SDK Package: https://www.npmjs.com/package/@filoz/synapse-sdk
- Synapse SDK Repository: https://github.com/FilOzone/synapse-sdk
- FilBeam Docs: https://docs.filbeam.com/
