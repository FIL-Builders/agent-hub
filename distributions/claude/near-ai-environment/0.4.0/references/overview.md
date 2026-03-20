# NEAR AI Environment Overview

## Snapshot

- Spec name: nearai/environment
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs
- Primary language: python
- Homepage: https://near.ai/
- Source set: `parse/near-ai-environment-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/near-ai-environment/0.3.0.md` for contract extraction and coverage audit

**Tags**
- agents
- llm
- tools
- python
- near
- blockchain

## Purpose

This pack teaches an agent to use the NEAR AI Python environment at a senior-developer level: manage chat completions and signed completions, persist thread state through environment helpers, register and expose tools correctly, and configure an async NEAR client for read and write operations.

## Guiding Principles

- Use `Environment.completions` when you need structured control or streaming.
- Use `Environment.completion` only as a convenience wrapper for plain text.
- Pass tool definitions from the registry into tool-running helpers.
- Persist thread context through environment message and file helpers instead of ad hoc state.
- Configure NEAR access through `Environment.set_near` and keep credentials out of code.

## Boundary Notes

- The old `0.3.0` pack already had the right structure: inference, messages, tools, and NEAR helpers. This `0.4.0` port keeps those boundaries and makes the core environment model easier to retrieve from.
- The most important mental model is that the environment is both an inference wrapper and a thread-state orchestrator.
- This pack relies on the previously extracted source contracts and guidance from the earlier pack.

## FAQ

### Should I use completion or completions?
Use `completion` only when you want a plain text convenience wrapper. Use `completions` when streaming, metadata, or richer response handling matters.

### Are view and call interchangeable on NEAR?
No. `NearClient.view` is for read-only access, while `NearClient.call` is for state-changing transactions.
