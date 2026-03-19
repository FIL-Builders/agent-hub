# Scaffold-ETH 2 Overview

## Snapshot

- Spec name: scaffold-eth-2
- Spec version: 0.4.0
- Generated: 2026-03-16
- Library version: scaffold-eth-2 current-docs + @se-2/hardhat^0.0.1 + @se-2/nextjs^0.1.0
- Primary language: typescript
- Homepage: https://github.com/scaffold-eth/scaffold-eth-2
- Source set: upstream `main` at `d0432d167a376289c975b6ddb282e63c203d93c3`; `README.md`; `AGENTS.md`; `.mcp.json`; `CONTRIBUTING.md`; root `package.json`; `packages/hardhat/package.json`; `packages/hardhat/hardhat.config.ts`; `packages/hardhat/deploy/00_deploy_your_contract.ts`; `packages/hardhat/contracts/YourContract.sol`; `packages/nextjs/package.json`; `packages/nextjs/scaffold.config.ts`; `packages/nextjs/services/web3/wagmiConfig.tsx`; `packages/nextjs/contracts/deployedContracts.ts`; `packages/nextjs/hooks/scaffold-eth/useScaffoldReadContract.ts`; `packages/nextjs/hooks/scaffold-eth/useScaffoldWriteContract.ts`; `packages/nextjs/app/debug/page.tsx`; and `parse/scaffold-eth-2-docs-v0.4.0.md`

**Tags**
- scaffold-eth
- ethereum
- hardhat
- nextjs
- wagmi
- viem
- ai-agents

## Purpose

This pack teaches an agent to use Scaffold-ETH 2 as a current, AI-ready dApp
starter kit: run the normal three-terminal local loop, modify contracts and
deploy scripts in the Hardhat workspace, rely on generated contract metadata
instead of hand-editing addresses and ABIs, use the scaffold-specific frontend
hooks and config surface rather than raw library snippets, and follow the
repo’s built-in agent guidance and Context7 retrieval setup when working inside
the repository.

## Guiding Principles

- Treat the current upstream `main` repo as a Hardhat-flavor Scaffold-ETH 2 workspace unless the cloned repo clearly contains `packages/foundry` instead.
- Use the standard local loop: `yarn chain`, `yarn deploy`, and `yarn start` in separate terminals.
- Do not edit `packages/nextjs/contracts/deployedContracts.ts` manually; it is generated from deployments.
- Prefer `useScaffoldReadContract` and `useScaffoldWriteContract` over old or raw contract hook patterns when working inside the frontend.
- Keep network configuration in `packages/nextjs/scaffold.config.ts` and transport behavior in `packages/nextjs/services/web3/wagmiConfig.tsx`.
- Treat `packages/hardhat/deploy/00_deploy_your_contract.ts` and `packages/hardhat/contracts/YourContract.sol` as starter examples meant to be replaced, not permanent app design.
- Prefer DaisyUI and `@scaffold-ui/components` patterns instead of raw one-off Tailwind utility implementations when the repo already has a scaffolded component path.
- Follow the repo’s own AI guidance first: `AGENTS.md`, `.agents/skills/*`, and the configured Context7 MCP server.
- Remember that the debug surface at `/debug` assumes deployments and generated metadata already exist.
- Use Node `>=20.18.3` and the repo’s Yarn workspace flow; do not silently downgrade the toolchain assumptions.

## Boundary Notes

- The root README frames Scaffold-ETH 2 as an up-to-date dApp toolkit built from Next.js, RainbowKit, Wagmi, Viem, Hardhat or Foundry, and TypeScript.
- The checked-in `main` repo currently contains `packages/hardhat` and `packages/nextjs`; `AGENTS.md` still documents the broader two-flavor model, so flavor detection is a first-class boundary.
- The Hardhat deploy task is extended to run `generateTsAbis` after deploy, which keeps the frontend contract metadata aligned with the latest deployment output.
- The frontend intentionally wraps wagmi and local config in scaffold-specific hooks and utilities. The current guidance explicitly says to use `useScaffoldReadContract` and `useScaffoldWriteContract`, not stale old hook names.
- The repository ships first-party agent guidance in `AGENTS.md`, `.agents/skills/*`, `.claude`, `.cursor`, and `.mcp.json`; that is part of the product surface because it changes how coding agents should work inside the repo.
- `CONTRIBUTING.md` shows that upstream still expects human-reviewed fork-and-pull GitHub workflows even though the repo is AI-ready.

## FAQ

### Is Scaffold-ETH 2 Hardhat or Foundry?
- The broader product supports both flavors.
- The current upstream `main` repo inspected here is Hardhat-flavored because it contains `packages/hardhat`.

### Should I edit `deployedContracts.ts` manually?
- No.
- It is generated output and is meant to be refreshed through `yarn deploy`.

### Should I use raw wagmi hooks directly?
- Not by default inside this repo.
- Scaffold-ETH 2 already wraps the common contract interaction flows in scaffold-specific hooks that load addresses and ABIs for you.

### Is Scaffold-ETH 2 already AI-ready?
- Yes.
- The current repo ships `AGENTS.md`, local skills in `.agents/skills/*`, editor-specific agent directories, and a configured Context7 MCP entry.

## External Resources

- Scaffold-ETH 2 docs: https://docs.scaffoldeth.io
- Scaffold-ETH 2 website: https://scaffoldeth.io
- Scaffold-ETH 2 repository: https://github.com/scaffold-eth/scaffold-eth-2
- Quickstart installer: https://www.npmjs.com/package/create-eth
