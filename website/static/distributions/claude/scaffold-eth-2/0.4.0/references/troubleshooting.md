# Scaffold-ETH 2 Troubleshooting

### The frontend says the contract is not deployed
**Cause**
- `useScaffoldWriteContract` and related helpers read from generated deployment metadata.
- The deploy step may not have run, or it ran before your latest contract/deploy changes.

**Fix**
- Run `yarn deploy` again.
- Verify that the deployed contract metadata was regenerated before debugging the UI layer.

### `deployedContracts.ts` is empty, stale, or keeps being overwritten
**Cause**
- The file is generated output.
- Manual edits are overwritten because the deploy flow regenerates it from deployment artifacts.

**Fix**
- Stop editing `packages/nextjs/contracts/deployedContracts.ts` directly.
- Change the contract or deploy script, then run `yarn deploy` to regenerate the metadata correctly.

### The wallet is connected, but writes still fail
**Cause**
- The wallet is connected to the wrong network for the selected target network.
- `useScaffoldWriteContract` explicitly guards against wrong-network writes.

**Fix**
- Switch the wallet to the selected target network.
- Check `packages/nextjs/scaffold.config.ts` if the app is targeting a different chain than you expected.

### The docs mention Foundry, but this repo only has Hardhat
**Cause**
- `AGENTS.md` documents the broader two-flavor Scaffold-ETH 2 model.
- The current upstream `main` workspace you cloned contains `packages/hardhat`, not `packages/foundry`.

**Fix**
- Follow Hardhat-flavor instructions for this repo.
- Only apply Foundry guidance when the cloned workspace actually includes `packages/foundry`.

### The AI agent keeps reaching for generic wagmi or old Scaffold-ETH examples
**Cause**
- The repo has its own current contract hooks, naming conventions, and agent guidance.
- Older blog posts or memory may use deprecated hook names.

**Fix**
- Re-read `AGENTS.md`.
- Use `useScaffoldReadContract` and `useScaffoldWriteContract` exactly as currently named in the repo.
- Pull current library docs through Context7 only after grounding on the repo’s own guidance.
