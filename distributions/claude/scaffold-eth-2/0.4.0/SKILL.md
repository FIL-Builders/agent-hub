---
name: scaffold-eth-2
description: Use for Scaffold-ETH 2 app setup, contract/frontend workflow, deployment, and debugging tasks. Helps with the local dev loop, generated bindings, and app structure decisions.
---

# Scaffold-ETH 2

Use this skill when the task depends on Scaffold-ETH 2 project structure, the contract and frontend workflow, or the built-in developer surfaces.

## Purpose

This pack teaches an agent to use Scaffold-ETH 2 as a current, AI-ready dApp starter kit: run the normal three-terminal local loop, modify contracts and deploy scripts in the Hardhat workspace, rely on generated contract metadata instead of hand-editing addresses and ABIs, use the scaffold-specific frontend hooks and config surface rather than raw library snippets, and follow the repo’s built-in agent guidance and Context7 retrieval setup when working inside the repository.

## When to use this skill

- local three-terminal development workflow
- deploy to frontend metadata and bindings flow
- contract and frontend integration decisions
- Scaffold-ETH-specific debugging and environment setup

## Working style

- Treat the current upstream `main` repo as a Hardhat-flavor Scaffold-ETH 2 workspace unless the cloned repo clearly contains `packages/foundry` instead.
- Use the standard local loop: `yarn chain`, `yarn deploy`, and `yarn start` in separate terminals.
- Do not edit `packages/nextjs/contracts/deployedContracts.ts` manually; it is generated from deployments.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
