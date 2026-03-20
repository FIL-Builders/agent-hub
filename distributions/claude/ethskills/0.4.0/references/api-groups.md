# ETHSkills API Groups

### Entry Points and Installation
**Exports**
- top-level `SKILL.md`
- ship/SKILL.md
- canonical skill URL pattern
- Claude plugin install

How an agent should enter the ETHSkills system, fetch the right next skill, and
load the published skill set into a supported AI environment.

#### top-level `SKILL.md`
**Kind**
workflow

**Summary**
Root ETHSkills router and reality-correction layer for deciding which skill to
fetch next.

**Definition**
Language: markdown
Source: upstream `SKILL.md`

```md
Start Here

Building a dApp? Fetch ship/SKILL.md first.
Need a specific topic? Fetch only the relevant skill below.
Base URL: https://ethskills.com/<skill>/SKILL.md
```

**Guidance**
- Start here when you need routing help or current Ethereum corrections before implementation.
- Do not treat this as the only document needed for non-trivial build work.
- Use it to decide whether the task should branch into `ship` or a single topic skill.

**Example**
Language: text
Description: Use the root skill as the first router.

```text
Fetch https://ethskills.com/SKILL.md, then follow its routing guidance.
```

#### ship/SKILL.md
**Kind**
workflow

**Summary**
Default first fetch for broad dApp work, routing the agent from architecture
planning through deployment and post-build review.

**Definition**
Language: markdown
Source: upstream `SKILL.md` and `ship/SKILL.md`

```md
Building a dApp? Fetch ship/SKILL.md first.

Phase 0: plan the architecture
Phase 1: build contracts
Phase 2: test
Phase 3: build frontend
Phase 4: ship to production
```

**Guidance**
- Use this first for new dApps, major rewrites, or vague “help me build this on Ethereum” tasks.
- Preserve its contract-count discipline: most dApps need 0-2 contracts, not a sprawling onchain system.
- Treat it as the orchestrator that tells you which topic skills to fetch next.

**Example**
Language: text
Description: First fetch for a new Ethereum product build.

```text
Fetch https://ethskills.com/ship/SKILL.md first, then follow the phase-by-phase routing.
```

#### canonical skill URL pattern
**Kind**
endpoint

**Summary**
Published URL pattern for the maintained ETHSkills documents.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/<skill>/SKILL.md
```

**Guidance**
- Use canonical skill names like `ship`, `l2s`, `building-blocks`, and `frontend-playbook`.
- Prefer the published skill URLs when the agent needs the live skill docs directly.
- Do not prefer deprecated aliases like `l2`, `layer2`, `contracts`, or `defi`.

**Example**
Language: text
Description: Fetch the security skill.

```text
https://ethskills.com/security/SKILL.md
```

#### Claude plugin install
**Kind**
workflow

**Summary**
Install the ETHSkills skill set into a Claude plugin-capable environment.

**Definition**
Language: bash
Source: upstream `README.md` and `.claude-plugin/plugin.json`

```bash
/plugin marketplace add austintgriffith/ethskills
/plugin install ethskills
```

**Guidance**
- Use this when the AI environment supports the Claude plugin workflow.
- Treat the plugin manifest version as the published package line for the skill bundle.
- Installation does not remove the need to fetch only the relevant skill content for the task.

**Example**
Language: text
Description: Install ETHSkills into a supported Claude environment.

```text
/plugin install ethskills
```

### Core Ethereum Topic Skills
**Exports**
- why
- gas
- wallets
- l2s
- standards
- tools
- building-blocks
- addresses
- concepts

Targeted correction layers for Ethereum-specific blind spots and design choices.

#### why
**Kind**
workflow

**Summary**
Current-Ethereum reality checks around protocol upgrades, tradeoffs, and why an
application should use Ethereum at all.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/why/SKILL.md
```

**Guidance**
- Use this when the task questions whether Ethereum is the right platform or relies on stale protocol assumptions.
- Preserve current corrections like Pectra and Fusaka shipping, EIP-7702 being live, and ERC-8004 / x402 existing in production.
- Verify time-sensitive numbers like ETH price separately when they materially affect the answer.

**Example**
Language: text
Description: Fetch the skill that answers “why Ethereum now?”

```text
https://ethskills.com/why/SKILL.md
```

#### gas
**Kind**
workflow

**Summary**
Current cost guidance for Ethereum mainnet and major L2s.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/gas/SKILL.md
```

**Guidance**
- Use this whenever the answer depends on cost assumptions, chain choice, or “Ethereum is expensive” claims.
- Preserve the current correction that many training-data-era cost assumptions are outdated.
- Encourage verifying live gas when precise numbers matter.

**Example**
Language: text
Description: Fetch the current gas and cost skill.

```text
https://ethskills.com/gas/SKILL.md
```

#### wallets
**Kind**
workflow

**Summary**
Wallet creation, key safety, multisig, and account-abstraction guidance.

**Definition**
Language: text
Source: upstream `.claude-plugin/plugin.json` and top-level `SKILL.md`

```text
https://ethskills.com/wallets/SKILL.md
```

**Guidance**
- Use this for production key handling, signer architecture, treasury security, and account-abstraction decisions.
- Preserve high-signal operational advice like not committing private keys and using Safe for serious treasury control.
- Use it with `standards` and `tools` when the task is building agent or wallet infrastructure.

**Example**
Language: text
Description: Fetch wallet and signer guidance.

```text
https://ethskills.com/wallets/SKILL.md
```

#### l2s
**Kind**
workflow

**Summary**
Current L2 landscape, bridge realities, and chain-specific deployment tradeoffs.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/l2s/SKILL.md
```

**Guidance**
- Use this for chain selection, L2 protocol fit, and up-to-date L2 caveats.
- Preserve current reality checks like Base being cheap, Arbitrum having deep DeFi liquidity, and Polygon zkEVM being shut down.
- Do not use deprecated aliases like `l2/` or `layer2/` as the preferred skill names.

**Example**
Language: text
Description: Fetch L2-specific guidance.

```text
https://ethskills.com/l2s/SKILL.md
```

#### standards
**Kind**
workflow

**Summary**
Ethereum standards guidance across ERC-20, ERC-721, ERC-8004, EIP-7702, x402,
and adjacent protocol standards.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/standards/SKILL.md
```

**Guidance**
- Use this for token, NFT, identity, payment, and wallet-standard decisions.
- Preserve the current standards landscape rather than outdated assumptions about what exists or is production-ready.
- Pair with `addresses` or `security` when standards usage depends on real protocol addresses or safe implementation patterns.

**Example**
Language: text
Description: Fetch current Ethereum standards guidance.

```text
https://ethskills.com/standards/SKILL.md
```

#### tools
**Kind**
workflow

**Summary**
Tooling guidance around Foundry, Scaffold-ETH 2, Blockscout MCP, and current
Ethereum developer tools.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/tools/SKILL.md
```

**Guidance**
- Use this when the task involves choosing or setting up Ethereum developer tooling.
- Preserve the correction that Foundry is the default for new projects in 2026, not Hardhat.
- Use with `orchestration` for Scaffold-ETH 2 workflows.

**Example**
Language: text
Description: Fetch tooling guidance.

```text
https://ethskills.com/tools/SKILL.md
```

#### building-blocks
**Kind**
workflow

**Summary**
DeFi building blocks and composable protocol patterns.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/building-blocks/SKILL.md
```

**Guidance**
- Use this for AMMs, lending, flash loans, and protocol-composition questions.
- Prefer this canonical skill name over the deprecated `defi` alias.
- Pair with `addresses` and `security` for concrete integration work.

**Example**
Language: text
Description: Fetch DeFi building-block guidance.

```text
https://ethskills.com/building-blocks/SKILL.md
```

#### addresses
**Kind**
workflow

**Summary**
Verified contract addresses for major protocols on mainnet and L2s.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/addresses/SKILL.md
```

**Guidance**
- Use this when an answer depends on concrete onchain addresses.
- Never hallucinate addresses; wrong addresses can lose funds.
- Prefer this canonical skill over the deprecated `contracts` alias.

**Example**
Language: text
Description: Fetch verified address guidance.

```text
https://ethskills.com/addresses/SKILL.md
```

#### concepts
**Kind**
workflow

**Summary**
Mental models for what belongs onchain, who calls each function, and how
Ethereum systems are actually triggered.

**Definition**
Language: text
Source: upstream `SKILL.md` and `ship/SKILL.md`

```text
https://ethskills.com/concepts/SKILL.md
```

**Guidance**
- Use this for architecture planning and “what should be onchain?” questions.
- Preserve the current ETHSkills emphasis that contracts do not execute themselves and every state transition needs a caller and incentive.
- Pair with `ship` early in design work.

**Example**
Language: text
Description: Fetch onchain mental-model guidance.

```text
https://ethskills.com/concepts/SKILL.md
```

### Build, Frontend, and Shipping Skills
**Exports**
- orchestration
- testing
- indexing
- frontend-ux
- frontend-playbook

Operational build-to-production skills for Scaffold-ETH 2 style workflows and
Ethereum application delivery.

#### orchestration
**Kind**
workflow

**Summary**
Three-phase build system and Scaffold-ETH 2 orchestration guidance.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/orchestration/SKILL.md
```

**Guidance**
- Use this for phase-based dApp builds, contract/UI coordination, and SE2 workflows.
- Preserve the ETHSkills rule to use Scaffold hooks instead of raw wagmi for ordinary Scaffold-ETH 2 app work.
- Pair with `frontend-ux` and `frontend-playbook` during shipping.

**Example**
Language: text
Description: Fetch the orchestration skill for SE2 workflows.

```text
https://ethskills.com/orchestration/SKILL.md
```

#### testing
**Kind**
workflow

**Summary**
Foundry testing guidance across unit, fuzz, fork, and invariant testing.

**Definition**
Language: text
Source: upstream `SKILL.md` and `ship/SKILL.md`

```text
https://ethskills.com/testing/SKILL.md
```

**Guidance**
- Use this whenever contracts are being written, changed, or validated.
- Preserve ETHSkills’ emphasis on edge cases, fuzzing, fork tests, and not wasting effort on trivial getter tests.
- Combine with `security` for pre-deploy safety and `audit` for deeper independent review.

**Example**
Language: text
Description: Fetch the testing skill.

```text
https://ethskills.com/testing/SKILL.md
```

#### indexing
**Kind**
workflow

**Summary**
Indexing guidance for events, The Graph, Dune, and historical onchain reads.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/indexing/SKILL.md
```

**Guidance**
- Use this when the app needs history, analytics, monitoring, or efficient multi-contract reads.
- Preserve the rule that events are the primary historical read surface and that cheap RPC cannot replace a proper indexer for all use cases.
- Pair with `frontend-playbook` or `orchestration` when read models shape application UX.

**Example**
Language: text
Description: Fetch indexing guidance.

```text
https://ethskills.com/indexing/SKILL.md
```

#### frontend-ux
**Kind**
workflow

**Summary**
Ethereum-specific frontend interaction patterns and UI safety checks.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/frontend-ux/SKILL.md
```

**Guidance**
- Use this when the problem is wallet flow UX, button state management, approvals, or address handling.
- Preserve the three-button flow and per-action loading-state discipline.
- Pair with `orchestration` for Scaffold-ETH 2 based UI work.

**Example**
Language: text
Description: Fetch Ethereum frontend UX guidance.

```text
https://ethskills.com/frontend-ux/SKILL.md
```

#### frontend-playbook
**Kind**
workflow

**Summary**
Frontend build-to-production pipeline guidance, especially around deployment and
IPFS pitfalls.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/frontend-playbook/SKILL.md
```

**Guidance**
- Use this for deployment, IPFS hosting, route correctness, and production frontend operations.
- Preserve practical footguns like `trailingSlash: true` for IPFS deployments and clean builds before deployment.
- Use it alongside `wallets` and `gas` during production rollout.

**Example**
Language: text
Description: Fetch production frontend deployment guidance.

```text
https://ethskills.com/frontend-playbook/SKILL.md
```

### Safety, QA, and Audit Skills
**Exports**
- security
- qa
- audit

Build-time safety guidance and post-build reviewer workflows.

#### security
**Kind**
workflow

**Summary**
Build-time Solidity and dApp safety guidance for developers implementing or
revising contracts.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/security/SKILL.md
```

**Guidance**
- Use this while designing and implementing contracts, token handling, oracle usage, and proxy patterns.
- Preserve high-value corrections like USDC having 6 decimals, SafeERC20 for broken token return values, and not using DEX spot prices as oracles.
- Treat this as build-time defensive guidance, not as the independent reviewer pass.

**Example**
Language: text
Description: Fetch the security skill while building.

```text
https://ethskills.com/security/SKILL.md
```

#### qa
**Kind**
workflow

**Summary**
Post-build QA checklist for a separate reviewer agent or fresh context.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/qa/SKILL.md
```

**Guidance**
- Use this after the build is complete, not as the primary build instruction set.
- Give it to a separate agent or fresh context when possible.
- Expect PASS/FAIL style review coverage rather than code generation.

**Example**
Language: text
Description: Run a post-build review pass.

```text
https://ethskills.com/qa/SKILL.md
```

#### audit
**Kind**
workflow

**Summary**
Systematic deep smart-contract audit workflow for contracts the reviewer did not
author.

**Definition**
Language: text
Source: upstream `SKILL.md`

```text
https://ethskills.com/audit/SKILL.md
```

**Guidance**
- Use this for deep audit work beyond normal build-time security checks.
- Treat it as distinct from `security`: `security` teaches safe implementation, `audit` is an independent review method.
- Use a separate reviewer context when possible, especially for higher-value or production-bound contracts.

**Example**
Language: text
Description: Fetch the audit skill for a deeper independent review.

```text
https://ethskills.com/audit/SKILL.md
```
