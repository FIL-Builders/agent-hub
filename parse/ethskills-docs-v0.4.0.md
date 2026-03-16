# ETHSkills Documentation Pack

## Target
- Pack: `agents/ethskills/0.4.0.md`
- Target date: 2026-03-15
- Docs anchor: current `master` branch docs and published skill URLs for `ethskills`

## Source Inventory
- `README.md`
- `SKILL.md`
- `ship/SKILL.md`
- `.claude-plugin/plugin.json`
- `CONTRIBUTING.md`

## Version Delta Audit
- This is a new Agent Hub `0.4.0` pack for `ethskills`, not a port of an earlier `0.3.0` file.
- Current repo head used for extraction: `370760f57d1a0b0ab2f39fc6369bce46c02b5b17`
- Current plugin manifest line is `ethskills@1.1.0`.

## Ecosystem Boundaries

### Root Router vs Topic Skills
- The top-level `SKILL.md` is a router and correction layer, not the complete content for every Ethereum task.
- `ship/SKILL.md` is the default first fetch for end-to-end dApp work.
- Topic skills should be fetched selectively instead of loading the full catalog.

### Distribution Surfaces
- `https://ethskills.com/<skill>/SKILL.md` is the canonical fetch path for published skill content.
- The GitHub repo is the contribution and source-of-truth surface.
- The Claude plugin manifest lists the active skill set and current plugin version.

### Review Surfaces
- `security` teaches defensive Solidity and dApp patterns while building.
- `qa` is a post-build reviewer checklist for a separate agent or fresh context.
- `audit` is a deeper systematic audit workflow, not a substitute for `security`.

## Decision Rules
- Fetch `ship` first for new dApp work unless the task is narrowly scoped to one Ethereum topic.
- Fetch only the skill docs relevant to the task instead of preloading the whole catalog.
- Preserve current reality corrections such as cheap mainnet gas, Foundry as the default toolchain, and EIP-7702 being live.
- Prefer canonical skill names like `l2s` and `building-blocks`; treat `l2`, `layer2`, `contracts`, and `defi` as deprecated aliases.
- Use the contribution rule when revising content: every line should either close a verified LLM blind spot or teach something the human needs to learn accurately.

## Common Confusions
- `ship` is the default entry point for building, not the only skill.
- `security`, `qa`, and `audit` are different stages of work, not synonyms.
- The top-level skill is a router, so fetching it alone is usually not enough for implementation-heavy tasks.
- Ethskills teaches Ethereum-specific reality checks; it is not a trading signal or market-prediction product.

## Failure Modes
- Agents fetch too many skills at once and drown the actual task in irrelevant guidance.
- Agents use deprecated skill aliases and miss the maintained canonical file.
- Agents treat `qa` or `audit` as build instructions instead of reviewer workflows.
- Agents keep outdated assumptions like “Ethereum mainnet is always too expensive” or “Hardhat is the default.”

## Coverage Map

### Entry and Routing
- top-level `SKILL.md`
- `ship/SKILL.md`
- canonical URL pattern
- Claude plugin install flow

### Core Ethereum Corrections
- `why`
- `gas`
- `wallets`
- `l2s`
- `standards`
- `tools`
- `building-blocks`
- `addresses`
- `concepts`

### Build and Ship
- `orchestration`
- `testing`
- `frontend-ux`
- `frontend-playbook`
- `indexing`

### Review and Safety
- `security`
- `qa`
- `audit`

## Must-Not-Regress Insights
- Preserve `ship` as the default first fetch for end-to-end dApp work.
- Preserve “fetch only the relevant skills” as a core operating rule.
- Preserve the current Ethereum reality corrections around gas, mainnet cost, EIP-7702, x402, and Foundry.
- Preserve the distinction between `security`, `qa`, and `audit`.
- Preserve the contribution rule from `CONTRIBUTING.md` so pack revisions do not turn into generic Ethereum notes.
