# Hardhat Overview

## Snapshot

- Spec name: hardhat
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^3.1.12
- Primary language: typescript
- Homepage: https://hardhat.org/docs/
- Source set: npm:hardhat@3.1.12 TypeScript declarations, official Hardhat 3 docs and explanations pages, package README, parse/hardhat.out as a cross-check only, and the prior AgentHub hardhat pack for coverage audit only

**Tags**
- ethereum
- smart-contracts
- build-tool
- cli
- typescript

## Purpose

This pack teaches an agent to use Hardhat 3 core APIs for project configuration, secure config values, network management, task authoring, compilation, and artifact access in modern Ethereum development workflows.

## Guiding Principles

- Treat Hardhat 3 core as config-first and plugin-extensible rather than assuming the old Hardhat 2 runtime shape.
- Use `defineConfig(...)` for project configuration and keep secrets in `configVariable(...)` or the Hardhat keystore.
- Prefer explicit network connections and explicit cleanup in programmatic scripts.
- Source contract and build-state queries through `artifacts` and `solidity` instead of guessing filesystem paths.
- Keep network type, chain type, and remote endpoint configuration explicit to avoid cross-chain mistakes.
- Avoid the deprecated Hardhat 2 plugin API exports in new Hardhat 3 code.
- Respect Hardhat 3's Node.js support floor before debugging higher-level failures.

## Boundary Notes

- Source material: `npm:hardhat@3.1.12` TypeScript declarations as the primary contract source, the Hardhat 3 docs for getting started, configuration, configuration variables, network management, and Node.js support, plus the package README.
- Coverage is intentionally centered on Hardhat 3 core primitives: configuration authoring, runtime and network management, and build or artifact APIs.
- `parse/hardhat.out` was inspected as an initial local input but appears to include older or internal surfaces that are not a clean match for the locked `^3.1.12` target, so it is treated as a cross-check only.
- Coverage was audited against `agents/hardhat/0.2.0.md`, but the earlier pack was not used as the primary contract source.
- Plugin-provided helpers such as ethers or viem integrations are called out as boundaries rather than folded into the core Hardhat pack.

## FAQ

### Where did the old Hardhat 2 plugin-extension helpers go?
Some compatibility exports still exist, but Hardhat 3 treats the old Hardhat 2 plugin API as deprecated and expects new code to use the current config, runtime, and plugin model.

### Should I use `--network` or `network.connect(...)`?
Use `--network` for CLI task selection and `network.connect(...)` when code needs an explicit `NetworkConnection` object with lifecycle control.

### Is ethers part of the Hardhat 3 core pack?
No. Hardhat 3 core exposes Hardhat primitives; ethers or viem ergonomics come from plugins and should be treated as plugin-specific surfaces.

## External Resources

- Getting Started: https://hardhat.org/docs/getting-started
- Configuration Reference: https://hardhat.org/docs/reference/configuration
- Configuration Variables Guide: https://hardhat.org/docs/guides/configuration-variables
- Network Management Explanation: https://hardhat.org/docs/explanations/network-management
- Node.js Support Policy: https://hardhat.org/docs/reference/nodejs-support
