# Scaffold-ETH 2 Workflows

### Start the local Scaffold-ETH 2 loop
1. Run `yarn chain` in the first terminal.
2. Run `yarn deploy` in the second terminal to deploy contracts and regenerate frontend metadata.
3. Run `yarn start` in the third terminal to boot the Next.js app on `http://localhost:3000`.
4. Open `/debug` to confirm the deployed contract surface is visible.

### Add or modify a contract
1. Edit or replace `packages/hardhat/contracts/YourContract.sol` and its matching deploy script in `packages/hardhat/deploy/`.
2. Re-run `yarn deploy` so the deployment and generated contract metadata stay aligned.
3. Confirm `packages/nextjs/contracts/deployedContracts.ts` reflects the new deploy output instead of editing it manually.
4. Update frontend interactions only after the generated metadata is current.

### Build frontend contract interactions the scaffold way
1. Set the right target networks in `packages/nextjs/scaffold.config.ts`.
2. Use `useScaffoldReadContract` for view/pure calls and `useScaffoldWriteContract` for writes.
3. Keep UI components aligned with DaisyUI and `@scaffold-ui/components` patterns.
4. Use the `/debug` page to sanity-check ABI/address integration before building product-specific UI.

### Deploy to a live network
1. Configure the deployer account and relevant API keys or RPC settings.
2. Run `yarn deploy --network <network>`.
3. Run `yarn verify --network <network>` after deployment.
4. Update frontend target networks and RPC/API config for the live environment in `packages/nextjs/scaffold.config.ts`.

### Work effectively as an AI agent inside the repo
1. Read `AGENTS.md` first and detect whether the repo is Hardhat or Foundry flavored.
2. Use Context7 through `.mcp.json` for current third-party library docs.
3. Pull in only the relevant `.agents/skills/*` topic skill for the task at hand.
4. Follow repo-specific hook names, component choices, and contract-metadata rules instead of generic stack assumptions.
