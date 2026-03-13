# Lighthouse Web3 SDK Documentation Pack

## Target
- Pack: `agents/lighthouse-web3-sdk/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `@lighthouse-web3/sdk@0.4.4`
- Docs anchor: current Lighthouse docs at `https://docs.lighthouse.storage/`

## Source Inventory
- Current Lighthouse docs at `https://docs.lighthouse.storage/`
- `npm:@lighthouse-web3/sdk@0.4.4`
- `agents/lighthouse-web3-sdk/0.3.0.md` for coverage audit only

## Version Delta Audit
- The old pack targeted `^0.4.2`; current package line is `0.4.4`.
- Main risk is not a major API shift but keeping upload, auth, encryption, and retrieval workflow boundaries explicit.

## Decision Rules
- Use wallet and auth helpers before encrypted upload flows.
- Use one-time auth as a short-lived delegated token, not a durable credential.
- Treat upload completion, deal status, and retrieval as separate phases.

## Common Confusions
- Public upload and encrypted upload do not have the same credential requirements.
- Upload success is not the same thing as durable Filecoin deal activation.
- CIDs are durable identifiers; gateways are replaceable delivery layers.

## Failure Modes
- Encrypted upload fails because auth or signed message generation was skipped.
- Clients treat `dealStatus` as immediate and never poll again after upload.
- Large uploads fail because progress and retry logic were not surfaced.

## Coverage Map

### Auth
- `createWallet`
- `getAuthMessage`
- `oneTimeAuth`

### Upload
- `uploadEncrypted`

### Retrieval And Status
- `getUploads`
- `dealStatus`

## Must-Not-Regress Insights
- Preserve one-time auth and signed-message guidance for encrypted flows.
- Preserve the distinction between CID identity and gateway delivery.
- Preserve the distinction between upload completion and deal durability.
