# ETHSkills Troubleshooting

### The agent fetched too many skills at once
**Cause**
The agent treated ETHSkills like a single blob of background knowledge instead of
using the router and only fetching the next relevant skill.

**Fix**
Go back to `ship` for broad dApp work or the single topic skill that best fits
the current task. Keep the active skill set minimal.

### The wrong skill name was used
**Cause**
The agent used a deprecated alias like `l2`, `layer2`, `contracts`, or `defi`
instead of the maintained canonical skill names.

**Fix**
Switch to `l2s`, `addresses`, or `building-blocks`, and prefer the canonical
`https://ethskills.com/<skill>/SKILL.md` path.

### Reviewer guidance was used as build guidance
**Cause**
The agent fetched `qa` or `audit` while still implementing the feature, so the
task drifted into review mode instead of build mode.

**Fix**
Use `ship`, `security`, `testing`, and the relevant implementation skills while
building. Move to `qa` or `audit` only after the build is complete.

### The answer still sounds like stale Ethereum training data
**Cause**
The agent did not fetch the current ETHSkills corrections for gas, tooling, or
L2 landscape and relied on older priors.

**Fix**
Fetch `why`, `gas`, `tools`, and `l2s` before finalizing any answer that depends
on current Ethereum reality.
