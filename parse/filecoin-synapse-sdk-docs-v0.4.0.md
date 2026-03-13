# Filecoin Synapse SDK Documentation Pack

## Target
- Pack: `agents/filecoin-synapse-sdk/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `@filoz/synapse-sdk@0.39.0`
- Supporting anchor: `@filoz/synapse-core@0.3.0`
- Docs anchor: current Synapse docs surface at `synapse.filecoin.services`

## Source Inventory
- Official Synapse docs and package README for current platform framing.
- `npm:@filoz/synapse-sdk@0.39.0` TypeScript declarations for top-level services and current public contracts.
- `npm:@filoz/synapse-core@0.3.0` type exports for chains, payments, warm storage, and provider registry context.
- `agents/filecoin-synapse-sdk/0.3.0.md` for coverage audit only.

## Version Delta Audit
- The old pack tracked `0.24.x` and emphasized:
  - async `Synapse.create()`
  - ethers provider language
  - `RPC_URLS`
  - Warm Storage terminology migration
- The current package surface has changed materially:
  - `Synapse.create()` is synchronous
  - the SDK is built around `viem`
  - chain selection is explicit via `@filoz/synapse-core/chains`
  - top-level `Synapse` exposes payments, storage, provider registry, and FilBeam services
- Main stale-risk areas:
  - preserving old async create examples
  - telling users to initialize with legacy RPC URL constants
  - underrepresenting `prepare()`, context-based storage flows, and FilBeam stats

## Ecosystem Boundaries

### Synapse High-Level Entry
- `Synapse` composes the major subsystems and should be the default entrypoint for app code.

### Payments
- Payments manage wallet balances, Synapse account balances, service approvals, rails, funding, and settlement.
- Wallet balances and Synapse balances are different things.

### Storage Manager And Storage Context
- `StorageManager` is the default high-level storage path.
- `StorageContext` is for explicit provider and dataset control.
- Upload, prepare, download, and termination are separate concerns.

### Warm Storage
- Warm Storage exposes service pricing, dataset inspection, and provider-approval helpers.
- It is important, but it is not the only subsystem now.

### FilBeam
- FilBeam stats are analytics and retrieval-domain information.
- They are not a replacement for onchain payment or storage state.

## Decision Rules
- Start with `Synapse` unless a task clearly needs a subservice directly.
- Use `prepare()` or `getUploadCosts()` when the task is cost-sensitive.
- Use `storage.upload()` for default flows and `storage.createContext()` when provider or dataset selection must be explicit.
- Use `payments.approveService()` before storage-heavy flows when service approval is part of the path.
- Use `filbeam.getDataSetStats()` for analytics or quota-style inspection, not for payment truth.

## Common Confusions
- `Synapse.create()` is synchronous now.
- The package is `viem`-oriented even though older docs and packs centered ethers.
- `payments.walletBalance()` and `payments.balance()` answer different questions.
- `withCDN` is not the same thing as payment approval or storage proof state.
- Upload completion and settlement completion are different phases.

## Failure Modes
- Using outdated async/ethers initialization patterns against the current package.
- Upload fails because service approval or funding is insufficient.
- Cost-aware flow skipped `prepare()` and underfunded the deposit.
- Download path confuses provider retrieval with CDN-assisted retrieval.
- FilBeam stats are used as if they were the ledger source of truth.

## Coverage Map

### Core Setup
- `Synapse`
- `Synapse.create`
- `TOKENS`
- `calibration`

### Payments
- `PaymentsService.deposit`
- `PaymentsService.approveService`
- `PaymentsService.getRailsAsPayer`
- `PaymentsService.getSettlementAmounts`

### Storage
- `StorageManager.upload`
- `StorageManager.createContext`
- `StorageManager.prepare`
- `StorageContext.upload`

### Service Inspection
- `WarmStorageService.getServicePrice`
- `SPRegistryService.getAllActiveProviders`
- `FilBeamService.getDataSetStats`

## Must-Not-Regress Insights
- Preserve the old pack’s strong distinction between wallet funds and Synapse escrowed account state.
- Preserve operator approval guidance for storage workflows.
- Preserve cost-awareness and runway planning.
- Do not regress into the older ethers-first or `RPC_URLS`-based mental model.
