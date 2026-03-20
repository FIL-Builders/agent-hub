# 0G Serving Broker Overview

## Snapshot

- Spec name: 0glabs/0g-serving-broker
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs
- Primary language: typescript
- Homepage: https://docs.0g.ai/
- Source set: current 0G docs at `https://docs.0g.ai/`; `parse/0glabs-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/0glabs/0.3.0.md` for coverage audit only

**Tags**
- ai
- compute-network
- inference
- sdk
- verification
- ethers

## Purpose

This pack teaches an agent to use the 0G serving broker at a senior-developer level: initialize the broker with a signer, fund the on-network ledger, discover provider metadata, generate per-request auth headers, and verify inference responses correctly.

## Guiding Principles

- Create the broker from a signer and reuse it for related requests.
- Check and fund ledger state before making paid requests.
- Generate fresh request headers for each outbound inference request.
- Resolve provider metadata dynamically instead of hard-coding endpoints.
- Verify returned content with `processResponse` before trusting it.

## Boundary Notes

- The old `0.3.0` pack already captured the practical broker workflow well. This `0.4.0` port keeps that workflow and makes setup, inference, and ledger boundaries easier to retrieve from.
- The main operational model is still signer-bound broker setup, ledger funding, provider discovery, and response verification.
- Current 0G docs are treated as the public source anchor; the prior pack was used only for coverage audit and retained guidance.

## FAQ

### Can I reuse the same request headers for multiple prompts?
No. Treat request headers as single-use credentials and generate them per request.

### Is wallet balance enough to know whether inference will work?
No. The broker ledger balance is the relevant funded state for paid broker requests.

## External Resources

- 0G docs: https://docs.0g.ai/
