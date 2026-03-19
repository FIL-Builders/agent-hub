# ETHSkills Overview

## Snapshot

- Spec name: ethskills
- Spec version: 0.4.0
- Generated: 2026-03-15
- Library version: current-docs + claude-plugin^1.1.0
- Primary language: markdown
- Homepage: https://ethskills.com
- Source set: upstream `README.md`, top-level `SKILL.md`, `ship/SKILL.md`, `.claude-plugin/plugin.json`, `CONTRIBUTING.md`, and `parse/ethskills-docs-v0.4.0.md`

**Tags**
- ethereum
- skills
- ai-agents
- solidity
- scaffold-eth
- foundry

## Purpose

This pack teaches an agent to use ETHSkills as a routing and correction layer
for production Ethereum work: start broad dApp builds from `ship`, fetch only
the topic skills that match the task, preserve current Ethereum reality checks
around gas, tooling, standards, and L2s, and follow the ETHSkills contribution
rule when revising the skill set itself.

## Guiding Principles

- Fetch `ship` first for end-to-end dApp work unless the task is narrowly scoped to one topic.
- Fetch only the relevant skill docs instead of loading the full ETHSkills catalog up front.
- Treat the top-level `SKILL.md` as a router and correction layer, not as the full implementation guide for every task.
- Preserve current Ethereum reality corrections such as cheap mainnet gas, Foundry as the default toolchain, and EIP-7702 being live.
- Use canonical skill names like `l2s` and `building-blocks`; deprecated aliases should not be the preferred fetch path.
- Say `onchain`, not `on-chain`.
- Keep build guidance separate from reviewer guidance: `security` for building safely, `qa` for post-build review, and `audit` for deep contract auditing.
- When revising ETHSkills, keep only lines that either close a verified LLM blind spot or teach something the human operator needs to learn accurately.

## Boundary Notes

- ETHSkills is a Markdown-first skill system, not a code library. The main runtime surface is “which skill doc should I fetch next?” rather than a package API.
- The published root router is the top-level `SKILL.md`, which sends broad dApp work to `ship/SKILL.md` and narrow work to the specific topic skill.
- `ship` is the operational backbone of the system: phase-based planning, contract-count discipline, onchain litmus tests, chain choice, and build-to-production sequencing.
- The plugin manifest is the cleanest source for the current active skill set and current published plugin version.
- Upstream `CONTRIBUTING.md` defines the content bar for ETHSkills itself. That contribution rule is part of the product surface because it governs how the skill set stays high signal.

## FAQ

### Should I always fetch the top-level skill first?
No. Use it when you need routing or reality checks. For broad dApp work, fetching
`ship` first is usually the better move.

### Should I load the whole ETHSkills catalog into context?
No. ETHSkills is designed for selective retrieval. Fetch only the skills needed
for the current task.

### When should I use `security`, `qa`, and `audit`?
Use `security` while building, `qa` after the build as a reviewer checklist, and
`audit` for deeper independent contract review.

### Are deprecated aliases still valid?
They may still resolve in some environments, but they are not the preferred
names. Use canonical names like `l2s`, `addresses`, and `building-blocks`.

## External Resources

- ETHSkills site: https://ethskills.com
- GitHub repo: https://github.com/austintgriffith/ethskills
- Root skill: https://ethskills.com/SKILL.md
- Ship skill: https://ethskills.com/ship/SKILL.md
- Contribution rules: https://github.com/austintgriffith/ethskills/blob/master/CONTRIBUTING.md
