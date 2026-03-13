# FIL-Frame Documentation Pack

## Target
- Pack: `agents/fil-frame/0.4.0.md`
- Target date: 2026-03-13
- Repo anchor: `FIL-Builders/fil-frame` current `main`
- Package anchors: `fil-frame@0.0.1`, `@fil-frame/hardhat@0.0.1`, `@fil-frame/nextjs@0.1.0`

## Source Inventory
- Official repository README at `github.com/FIL-Builders/fil-frame`.
- Raw repository sources under `packages/hardhat` and `packages/nextjs`.
- Root and workspace package manifests for package and runtime context.
- `agents/fil-frame/0.3.0.md` for coverage audit only.

## Version Delta Audit
- The old pack already captured most of the important repo surfaces: Filecoin deal contracts, Hardhat tasks, deploy scripts, and Next.js helpers.
- The current repo still targets the same starter-template mental model, but the `0.4.0` pack should be organized around real workflow boundaries instead of YAML object structure.
- Main stale-risk areas:
  - flattening contract, deploy, and frontend helper surfaces into one undifferentiated API
  - treating provider-specific upload helpers as if they were the same layer as onchain deal submission
  - missing the current monorepo split between `packages/hardhat` and `packages/nextjs`
  - presenting the legacy upload component as the preferred current app flow without calling out its hard-coded addresses and mixed dependency model

## Ecosystem Boundaries

### Hardhat And Filecoin Contracts
- `DealClient` and `DealInfo` are the Filecoin onchain surfaces.
- Hardhat tasks and deploy scripts are the operational shell around those contracts.

### Next.js Deal Helper Layer
- `makeDealFunction`, `createDealObject`, and `getDefaultDealInputs` exist to bridge frontend form state into the `DealRequest` contract shape.
- These helpers are not themselves storage providers or protocol clients.

### Storage Onramp Providers
- Lighthouse and Pinata helpers prepare upload metadata and CAR or CommP-related data.
- Upload success is not the same thing as a published Filecoin deal.

### Example UI Components
- The repo ships example upload components.
- The Lighthouse path is the clearer current template path.
- The `GetFileDealParams` component is a useful legacy reference, but it mixes hard-coded addresses, Pinata, and an older ethers-oriented flow.

## Decision Rules
- Start with the workflow boundary: upload and derive piece data first, then build the deal object, then submit the onchain proposal.
- Treat `piece_cid` as CommP bytes for the contract call, not as an ordinary display CID string.
- Use generated ABIs and typed frontend helpers after deployment instead of hand-maintaining contract shapes in the UI.
- Use Filfox-specific verification only on Filecoin networks and ordinary Hardhat verification elsewhere.
- Prefer the Lighthouse route and helper flow for current starter-template work unless the task explicitly needs the legacy Pinata example path.

## Common Confusions
- Payload CID, CAR link, CommP piece CID, and label serve different purposes.
- Uploading a file or creating a CAR does not publish a Filecoin deal.
- `DealInfo` is a read helper contract, not the contract that creates deals.
- `makeDealFunction` is only the frontend ABI fragment for `makeDealProposal`; it is not a full contract ABI.
- The Next.js app uses `wagmi` and `viem` helpers in current app code, while some older example code still imports `ethers`.

## Failure Modes
- Passing a multibase CID string directly where the contract expects raw piece bytes.
- Using stale or missing generated ABIs after redeploying contracts.
- Filfox verification failing because the network is wrong or the deployment metadata was not posted from `deployments/solcInputs`.
- Lighthouse polling timing out before piece metadata appears.
- Assuming the example upload component is production-ready despite hard-coded contract or token addresses.

## Coverage Map

### Contracts
- `DealClient`
- `DealInfo`

### Hardhat Automation
- `make-deal-proposal`
- `get-deal-data`
- `verify-contract`
- `generateTsAbis`

### Frontend Deal Helpers
- `makeDealFunction`
- `createDealObject`
- `getDefaultDealInputs`

### Storage And Upload Integrations
- `uploadToLighthouseDataDepot`
- `uploadToIPFS`
- `LighthouseGetFileDealParams`
- `GetFileDealParams`

## Must-Not-Regress Insights
- Preserve the strong distinction between upload prep and onchain proposal submission.
- Preserve the piece-CID encoding guidance and the `DealRequest` field semantics.
- Preserve the ABI-generation step as a first-class requirement after deployment.
- Preserve Filecoin-network verification guidance through the custom Hardhat task.
- Preserve the guidance that provider-side metadata can appear asynchronously and must be polled.
