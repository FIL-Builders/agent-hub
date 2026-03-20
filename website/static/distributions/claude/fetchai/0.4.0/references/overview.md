# FetchAI Agentverse Hosting API Overview

## Snapshot

- Spec name: fetchai/agentverse-hosting-api
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs
- Primary language: http+json
- Homepage: https://agentverse.ai/
- Source set: `parse/fetchai-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/fetchai/0.3.0.md` for contract extraction and coverage audit

**Tags**
- fetchai
- agentverse
- hosting
- agents
- rest
- ai-engine

## Purpose

This pack teaches an agent to use the FetchAI Agentverse Hosting API at a senior-developer level: create and inspect hosted agents, treat agent addresses as stable identifiers, reason about revisions and runtime state correctly, and separate usage reporting from deployment lifecycle actions.

## Guiding Principles

- Treat agent addresses as the stable handle for later reads and usage queries.
- Re-read the agent record after lifecycle actions instead of assuming state transitions succeeded.
- Track revisions and code digests as rollout signals.
- Keep usage endpoints separate from deployment and control endpoints.
- Normalize response types conservatively because some examples mix booleans and stringified numbers.

## Boundary Notes

- The old `0.3.0` pack already grouped the Agentverse Hosting API sensibly into agent and usage surfaces. This `0.4.0` port preserves that and makes the lifecycle-vs-analytics split easier to retrieve from.
- The most important mental model is stable agent identity plus revision-aware lifecycle control.
- This pack relies on the prior extracted endpoint contracts and guidance from the earlier pack.

## FAQ

### Should I key later operations by name or address?
Use the agent address. It is the stable identifier across later reads and usage endpoints.

### Is usage data a replacement for runtime status?
No. Usage endpoints are reporting surfaces, not lifecycle truth.

## External Resources

- Agentverse: https://agentverse.ai/
