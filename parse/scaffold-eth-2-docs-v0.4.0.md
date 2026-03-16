# Scaffold-ETH 2 Documentation Pack

## Target
- Pack: `agents/scaffold-eth-2/0.4.0.md`
- Target date: 2026-03-16
- Repo anchor: upstream `main` at `d0432d167a376289c975b6ddb282e63c203d93c3`

## Source Inventory
- upstream `main` at `d0432d167a376289c975b6ddb282e63c203d93c3`
- `README.md`
- `AGENTS.md`
- `.mcp.json`
- `CONTRIBUTING.md`
- root `package.json`
- `packages/hardhat/package.json`
- `packages/hardhat/hardhat.config.ts`
- `packages/hardhat/deploy/00_deploy_your_contract.ts`
- `packages/hardhat/contracts/YourContract.sol`
- `packages/nextjs/package.json`
- `packages/nextjs/scaffold.config.ts`
- `packages/nextjs/services/web3/wagmiConfig.tsx`
- `packages/nextjs/contracts/deployedContracts.ts`
- `packages/nextjs/hooks/scaffold-eth/useScaffoldReadContract.ts`
- `packages/nextjs/hooks/scaffold-eth/useScaffoldWriteContract.ts`
- `packages/nextjs/app/debug/page.tsx`
- `.agents/skills/*`
- `.claude/*`
- `.cursor/*`

## Version Delta Audit
- There is no prior `agents/scaffold-eth-2/0.3.0.md` pack.
- The current upstream repo is active and branch-rich, but this pack is anchored to the checked-in `main` repo surface and workspace manifests.
- The checked-in root and workspace versions are still low (`0.0.1` / `0.1.0`), so repo source and docs matter more than package semver alone.
- The current `main` workspace is Hardhat-flavored even though `AGENTS.md` documents a broader two-flavor product model.

## Ecosystem Boundaries

### Scaffold-ETH 2 vs the broader Ethereum toolchain
- This pack is about the Scaffold-ETH 2 starter kit and its repo workflow.
- Hardhat, Next.js, Wagmi, Viem, RainbowKit, DaisyUI, and TypeScript are underlying tools, not the pack’s primary abstraction level.

### Hardhat flavor vs Foundry flavor
- The broader product supports both.
- The current upstream `main` repo inspected here contains `packages/hardhat`, not `packages/foundry`.
- The pack must preserve flavor detection rather than pretending both flavors are simultaneously present in one clone.

### Generated metadata vs hand-maintained frontend config
- `packages/nextjs/contracts/deployedContracts.ts` is generated.
- The pack must keep “edit source, run deploy, regenerate metadata” as the correct rule.

### Repo AI guidance vs generic model memory
- `AGENTS.md`, `.mcp.json`, and `.agents/skills/*` are part of the repo contract.
- The pack should preserve retrieval-led behavior instead of flattening the repo into generic web3 stack advice.

## Decision Rules
- Start with the standard three-terminal loop: `yarn chain`, `yarn deploy`, `yarn start`.
- Treat `yarn deploy` as both deployment and frontend metadata regeneration.
- Prefer scaffold-specific hooks over raw wagmi hooks for ordinary contract interaction inside this repo.
- Keep network intent in `packages/nextjs/scaffold.config.ts`.
- Use `AGENTS.md` first when acting as an AI agent in the repo.
- Use Context7 through `.mcp.json` for current third-party docs after grounding on the repo’s own guidance.

## Common Confusions
- The product supports Foundry too, but the current upstream repo clone may not.
- `deployedContracts.ts` looks editable, but it is generated output.
- `/debug` is a scaffolded operator surface, not the final app UX.
- Old hook names from prior Scaffold-ETH examples do not match the current repo.
- The repo is AI-ready, but upstream contributing still expects human-reviewed GitHub PRs.

## Failure Modes
- An agent edits `deployedContracts.ts` manually instead of regenerating it through deploy.
- A developer changes a contract but forgets to re-run `yarn deploy`.
- Frontend writes fail because the wallet is on the wrong network.
- Generic wagmi examples are used instead of current scaffold hooks.
- Foundry instructions are applied to a Hardhat-flavor clone.
- AI agents ignore `AGENTS.md` and miss current repo-specific rules.

## Coverage Map

### Workspace Commands
- `yarn chain`
- `yarn deploy`
- `yarn start`
- `yarn verify`
- `yarn generate`

### Deployment and Metadata
- deploy task extension
- `packages/hardhat/deploy/00_deploy_your_contract.ts`
- `packages/nextjs/contracts/deployedContracts.ts`

### Frontend Surface
- `packages/nextjs/scaffold.config.ts`
- `packages/nextjs/services/web3/wagmiConfig.tsx`
- `useScaffoldReadContract`
- `useScaffoldWriteContract`
- `/debug`

### AI Agent Surface
- `AGENTS.md`
- `.mcp.json`
- `.agents/skills/*`
- editor agent directories

## Must-Not-Regress Insights
- Preserve flavor detection: current upstream `main` is Hardhat-flavored.
- Preserve that deploy regenerates frontend metadata.
- Preserve the current scaffold hook names and the warning against stale old names.
- Preserve the repo’s own AI guidance and Context7 MCP setup as first-class surfaces.
- Preserve the standard three-terminal local workflow as the default operator loop.
