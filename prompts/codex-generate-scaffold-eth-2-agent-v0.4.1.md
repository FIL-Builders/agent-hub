==============================================================
AGENTHUB - SCAFFOLD-ETH-2 0.4.1 GENERATION BRIEF
Goal: Generate `agents/scaffold-eth-2/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/scaffold-eth-2/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/scaffold-eth-2-docs-v0.4.0.md`

Additional authoritative sources:

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

### 4 - Invariants To Preserve

- `Spec name: scaffold-eth-2`
- `Spec version: 0.4.0`
- `Library version: scaffold-eth-2 current-docs + @se-2/hardhat^0.0.1 + @se-2/nextjs^0.1.0`
- `Primary language: typescript`
- `Homepage: https://github.com/scaffold-eth/scaffold-eth-2`

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- there is no prior `agents/scaffold-eth-2/0.3.0.md` pack
- the pack is repo-anchored, not npm-package-anchored
- the current upstream `main` workspace is Hardhat-flavored even though repo guidance documents a broader two-flavor model

You must avoid stale assumptions, including:

- that the current repo clone contains Foundry by default
- that `deployedContracts.ts` should be edited manually
- that old hook names like `useScaffoldContractRead` or `useScaffoldContractWrite` are current
- that raw generic wagmi snippets are the preferred frontend integration surface inside this repo
- that the repo’s AI guidance is optional or out-of-band

### 6 - Ecosystem Boundary Rules

Keep these boundaries explicit:

- Scaffold-ETH 2 starter-kit workflow vs generic Hardhat/Next/Wagmi usage
- Hardhat flavor vs Foundry flavor
- generated deployment metadata vs hand-maintained frontend source
- repo-specific AI guidance vs generic model memory

Specific rules:

- do not flatten the whole pack into “Ethereum stack overview” content
- do not imply that Foundry instructions are valid for the current upstream `main` clone unless `packages/foundry` is actually present
- do not hide the deploy-to-generated-metadata relationship
- do not miss the AI-ready repo surfaces: `AGENTS.md`, `.mcp.json`, and `.agents/skills/*`

### 7 - Coverage Expectations

- `yarn chain`
- `yarn deploy`
- `yarn start`
- `yarn verify`
- `yarn generate`
- deploy task extension in `packages/hardhat/hardhat.config.ts`
- `packages/hardhat/deploy/00_deploy_your_contract.ts`
- `packages/nextjs/contracts/deployedContracts.ts`
- `packages/nextjs/scaffold.config.ts`
- `packages/nextjs/services/web3/wagmiConfig.tsx`
- `useScaffoldReadContract`
- `useScaffoldWriteContract`
- `/debug`
- `AGENTS.md`
- `.mcp.json`
- `.agents/skills/*`

### 8 - Definition Quality

For each documented symbol or feature:

- prefer checked-in repo code and docs over generic ecosystem lore
- preserve current hook names and command names exactly
- if a point depends on flavor detection, state that boundary explicitly
- if a detail is branch- or flavor-sensitive, mark it `Needs verification`

### 9 - Required Scaffold-ETH 2 Guidance

Make sure the final pack teaches these behaviors clearly:

- use the standard three-terminal dev loop
- treat `yarn deploy` as deployment plus frontend metadata refresh
- never hand-edit generated deployment metadata
- use scaffold hooks for frontend contract interaction
- configure networks in `scaffold.config.ts`
- read `AGENTS.md` first when acting as an AI agent in the repo

### 10 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/scaffold-eth-2/0.4.0.md`
3. stop only when the validator passes
