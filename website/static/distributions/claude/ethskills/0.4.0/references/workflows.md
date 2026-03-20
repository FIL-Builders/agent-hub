# ETHSkills Workflows

### Start a New Ethereum dApp Task
1. Fetch the top-level `SKILL.md` only if you need routing or current-Ethereum corrections first.
2. Fetch `ship/SKILL.md` as the default first skill for broad dApp work.
3. From `ship`, fetch only the next skills the task actually needs, such as `l2s`, `standards`, `security`, `testing`, or `frontend-ux`.
4. Keep the contract count, onchain-litmus-test, and chain-choice discipline from `ship` visible throughout the task.

### Handle a Narrow Ethereum Topic
1. Skip `ship` when the task is already narrowly bounded, such as “choose a wallet architecture” or “what does x402 require?”
2. Fetch only the matching topic skill, such as `wallets`, `standards`, `gas`, or `addresses`.
3. Pull an adjacent skill only when the first one clearly routes you there.

### Review or Audit a Finished Build
1. Use `security` while building or revising code.
2. Use `qa` after the build is complete with a separate reviewer agent or fresh context.
3. Use `audit` for deeper smart-contract review when the stakes are higher or the contract surface is larger.

### Revise ETHSkills Itself
1. Start from the contribution rule in upstream `CONTRIBUTING.md`.
2. Test the proposed content against a fresh stock LLM, not an already tooled agent.
3. Keep lines that close verified blind spots or teach the human something the agent must teach accurately.
4. Remove or compress generic Ethereum knowledge that competent models already handle naturally.
