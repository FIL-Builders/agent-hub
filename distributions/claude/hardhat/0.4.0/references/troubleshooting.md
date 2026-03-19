# Hardhat Troubleshooting

### A config variable error appears only for one network or task
**Cause**
`configVariable(...)` values are resolved lazily, so the missing value may surface only when a selected network or task path actually uses it.

**Fix**
Check the exact variable name referenced in `hardhat.config.ts`, then define it through the environment or the Hardhat keystore before rerunning that specific workflow.

### A script expects hre.ethers or similar helpers but they do not exist
**Cause**
The script was written against a plugin-enabled or Hardhat 2-style environment, but Hardhat 3 core does not guarantee those helpers.

**Fix**
Install the plugin that provides the helper or rewrite the script to use core Hardhat primitives such as `network`, `artifacts`, and `solidity`.

### readArtifact fails even though the contract file exists
**Cause**
The contract may not have been built yet, the contract name may be ambiguous, or the project is using stale outputs.

**Fix**
Run a build, inspect `artifacts.getAllFullyQualifiedNames()`, and retry with a fully qualified contract name instead of a bare name.

### Programmatic scripts start consuming too many resources
**Cause**
The script creates many `network.connect(...)` connections without closing them.

**Fix**
Close each `NetworkConnection` explicitly in long-lived or high-churn scripts, especially inside loops or generators.
