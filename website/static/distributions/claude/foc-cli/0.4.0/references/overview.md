# foc-cli Overview

## Snapshot

- Spec name: foc-cli
- Spec version: 0.4.0
- Generated: 2026-03-19
- Library version: foc-cli^0.0.4 + @filoz/synapse-sdk^0.40.0 + @filoz/synapse-core^0.3.1 + incur^0.3.1
- Primary language: typescript
- Homepage: https://github.com/FIL-Builders/foc-cli
- Source set: upstream `main` at `46f80a379e351086758497944205eb7611143592`; `README.md`; CLI source under `cli/src/**`; bundled skills under `skills/`; and `parse/foc-cli-docs-v0.4.0.md` as the intermediate documentation pack

**Tags**
- filecoin
- foc
- filecoin-onchain-cloud
- warm-storage
- pdp
- usdfc
- synapse
- mcp
- cli
- typescript

## Purpose

This pack teaches an agent to use `foc-cli` as the operator-facing interface for Filecoin Onchain Cloud: initialize wallets safely, distinguish wallet balances from payment-account funding, use the recommended high-level upload commands, drop to dataset and piece commands only when explicit PDP control is needed, inspect approved providers, and use the built-in docs and agent surfaces without confusing them with the lower-level Synapse SDK.

## Guiding Principles

- Start with `upload` or `multi-upload` unless the task clearly needs explicit dataset management.
- Treat wallet FIL or USDFC balances, Synapse payment-account funds, and ongoing lockup or runway as separate layers.
- Use explicit `wallet init` flags in non-interactive or agent-driven contexts.
- Keep Calibration testnet (`314159`) vs mainnet (`314`) explicit on every write-sensitive workflow.
- Prefer the CLI’s own structured output, CTA hints, and scanner URLs over reconstructing workflows from raw SDK calls.
- Use `docs --prompt` or the `foc-docs` skill for documentation retrieval, not the operational `foc-cli` skill.

## Boundary Notes

- There is no older `foc-cli` pack in this repo, so this pack is anchored directly to the current repo source and README rather than a prior Agent Hub artifact.
- The repo deliberately ships multiple delivery modes: CLI, agent skills, and an MCP path through `incur`. The pack keeps the CLI as the primary abstraction and treats skills or MCP as secondary surfaces built around the same commands.
- The current implementation uses `viem` clients and Synapse services directly. Do not carry in older ethers-first or ad hoc Filecoin command assumptions.
- The docs command is important because it turns `https://docs.filecoin.cloud/llms.txt` into a search-and-fetch surface with depth filtering and auto-fetch behavior when few matches are found.
- The config path is managed by `conf`, so avoid hard-coding a single OS-specific path even if the README shows a macOS example.

## FAQ

### When should an agent use `upload` instead of `dataset upload`?
Use `upload` for the recommended, high-level path where the CLI should choose storage contexts. Use `dataset upload` when the provider identity and explicit dataset lifecycle are part of the task.

### Is `wallet balance` enough to know whether I can keep storing data?
No. `wallet balance` shows current wallet and payment-account state, but `wallet summary` and `wallet costs` are the better surfaces for runway and deposit planning.

### Is `foc-cli` only for humans at a terminal?
No. The repo intentionally supports agent usage through structured output, schema introspection, bundled skills, and an MCP path.

### When should an agent reach for `foc-docs` instead of `foc-cli`?
Use `foc-docs` or the `docs` command when the task is documentation retrieval or concept lookup. Use `foc-cli` for operational tasks like setup, upload, dataset inspection, funding, or provider management.

## External Resources

- GitHub repo: https://github.com/FIL-Builders/foc-cli
- FOC docs: https://docs.filecoin.cloud
- LLM-friendly docs index: https://docs.filecoin.cloud/llms.txt
- Synapse SDK: https://github.com/FilOzone/synapse-sdk
- PDP overview: https://docs.filecoin.cloud/core-concepts/pdp-overview/
- Filecoin Pay overview: https://docs.filecoin.cloud/core-concepts/filecoin-pay-overview/
