# 0G Serving Broker Documentation Pack

## Target
- Pack: `agents/0glabs/0.4.0.md`
- Target date: 2026-03-13
- Docs anchor: current 0G docs at `https://docs.0g.ai/`

## Source Inventory
- Current 0G docs at `https://docs.0g.ai/`
- `agents/0glabs/0.3.0.md` for coverage audit only

## Decision Rules
- Start from `createZGComputeNetworkBroker` and reuse the broker per signer.
- Fund the ledger before inference requests.
- Generate fresh request headers for each inference request.
- Verify responses with `processResponse`.

## Common Confusions
- Ledger balance is not the same thing as the wallet’s OG balance.
- Request headers are single-use credentials.
- Provider metadata discovery and response verification are separate stages.

## Failure Modes
- Requests fail because the broker ledger was not funded.
- Verification fails because `processResponse` used the wrong provider context.
- Integrations reuse stale request headers.

## Coverage Map

### Setup
- `createZGComputeNetworkBroker`
- `ZGComputeNetworkBroker`

### Inference
- `InferenceService.getServiceMetadata`
- `InferenceService.getRequestHeaders`
- `InferenceService.processResponse`

### Ledger
- `LedgerService.getLedger`
- `LedgerService.depositFund`

## Must-Not-Regress Insights
- Preserve fund-before-call guidance.
- Preserve one-request-one-header guidance.
- Preserve explicit response verification.
