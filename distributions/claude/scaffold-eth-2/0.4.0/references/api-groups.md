# Scaffold-ETH 2 API Groups

### Workspace Entry Points
**Exports**
- yarn chain
- yarn deploy
- yarn start
- yarn verify
- yarn generate

The root command surface for running the local chain, deploying contracts,
starting the Next.js app, verifying contracts, and managing deployer accounts.

#### yarn chain
**Kind**
workflow

**Summary**
Start the local Hardhat chain used for development and local deployment.

**Definition**
Language: json
Source: root `package.json` and `packages/hardhat/package.json`

```json
{
  "chain": "yarn hardhat:chain",
  "hardhat:chain": "yarn workspace @se-2/hardhat chain",
  "@se-2/hardhat#chain": "hardhat node --network hardhat --no-deploy"
}
```

**Guidance**
- Run this in its own terminal before local deploys and local frontend work.
- This is the default local chain for the current checked-in Hardhat flavor.
- Use `yarn fork` instead only when you intentionally want mainnet forking behavior.

**Example**
Language: bash
Description: Start the local blockchain terminal.

```bash
yarn chain
```

#### yarn deploy
**Kind**
workflow

**Summary**
Deploy the contracts from the Hardhat workspace and regenerate frontend
contract metadata.

**Definition**
Language: json
Source: root `package.json`, `packages/hardhat/package.json`, and `packages/hardhat/hardhat.config.ts`

```json
{
  "deploy": "yarn hardhat:deploy",
  "hardhat:deploy": "yarn workspace @se-2/hardhat deploy",
  "@se-2/hardhat#deploy": "ts-node scripts/runHardhatDeployWithPK.ts"
}
```

**Guidance**
- Treat this as both deployment and contract-metadata refresh because the Hardhat config extends the deploy task to run `generateTsAbis`.
- Re-run it after contract ABI or address changes before expecting the frontend hooks and debug page to know about the new contract shape.
- Use `--network <network>` when deploying off localhost.

**Example**
Language: bash
Description: Deploy locally after the chain is running.

```bash
yarn deploy
```

#### yarn start
**Kind**
workflow

**Summary**
Start the Next.js frontend in development mode.

**Definition**
Language: json
Source: root `package.json` and `packages/nextjs/package.json`

```json
{
  "start": "yarn workspace @se-2/nextjs dev",
  "@se-2/nextjs#dev": "next dev"
}
```

**Guidance**
- Run this after the local chain and deploy steps so the frontend can load contract metadata and local-network state correctly.
- The current default app URL is `http://localhost:3000`.
- Treat this as the frontend development server, not the production serve path.

**Example**
Language: bash
Description: Start the frontend in the third terminal.

```bash
yarn start
```

#### yarn verify
**Kind**
workflow

**Summary**
Verify deployed contracts on a supported live network explorer.

**Definition**
Language: json
Source: root `package.json` and `packages/hardhat/package.json`

```json
{
  "verify": "yarn hardhat:verify",
  "@se-2/hardhat#verify": "hardhat etherscan-verify"
}
```

**Guidance**
- Use this after a live-network deployment, not for localhost development.
- The checked-in Hardhat config uses `ETHERSCAN_V2_API_KEY` with explorer defaults as a fallback.
- Keep the target network explicit when verifying.

**Example**
Language: bash
Description: Verify contracts on Sepolia.

```bash
yarn verify --network sepolia
```

#### yarn generate
**Kind**
workflow

**Summary**
Generate a deployer account for the current workspace.

**Definition**
Language: json
Source: root `package.json` and `packages/hardhat/package.json`

```json
{
  "generate": "yarn account:generate",
  "account:generate": "yarn workspace @se-2/hardhat account:generate",
  "@se-2/hardhat#account:generate": "hardhat run scripts/generateAccount.ts"
}
```

**Guidance**
- Use this when you need a dedicated deployer instead of the default local Hardhat account.
- Pair it with `yarn account` or `yarn account:import` as needed.
- For live networks, make sure the resulting deployer actually has gas funds.

**Example**
Language: bash
Description: Generate a new deployer account.

```bash
yarn generate
```

### Hardhat Deployment and Generated Metadata
**Exports**
- deploy task extension
- packages/hardhat/deploy/00_deploy_your_contract.ts
- packages/nextjs/contracts/deployedContracts.ts

The contract-side source of truth and the metadata bridge that the frontend
depends on after deploy.

#### deploy task extension
**Kind**
workflow

**Summary**
The Hardhat config extends the standard deploy task so ABI/address metadata is
regenerated for the frontend immediately after deploy.

**Definition**
Language: typescript
Source: `packages/hardhat/hardhat.config.ts`

```ts
task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});
```

**Guidance**
- This is the key reason the frontend can track contract changes automatically after deploy.
- Do not remove or bypass this behavior unless you replace the metadata generation flow deliberately.
- When contract info looks stale in the frontend, start by checking whether deploy completed and the generation step ran.

**Example**
Language: text
Description: Understand why `yarn deploy` also updates the frontend contract metadata.

```text
Scaffold-ETH 2 extends the Hardhat deploy task so ABI/address generation runs automatically after deploy.
```

#### packages/hardhat/deploy/00_deploy_your_contract.ts
**Kind**
workflow

**Summary**
Starter deploy script showing the expected Hardhat deploy pattern, deployer
account usage, constructor args, and tagged deployment.

**Definition**
Language: typescript
Source: `packages/hardhat/deploy/00_deploy_your_contract.ts`

```ts
const deployYourContract: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

deployYourContract.tags = ["YourContract"];
```

**Guidance**
- Use this as the pattern for new contract deploy files in the Hardhat flavor.
- Replace `YourContract` and constructor args with your real deployment logic instead of trying to preserve the starter example unchanged.
- Use deployment tags when you want targeted deploy runs.

**Example**
Language: bash
Description: Deploy only one tagged contract script.

```bash
yarn deploy --tags YourContract
```

#### packages/nextjs/contracts/deployedContracts.ts
**Kind**
config

**Summary**
Autogenerated frontend contract registry populated from deployment output.

**Definition**
Language: typescript
Source: `packages/nextjs/contracts/deployedContracts.ts`

```ts
/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
const deployedContracts = {} as const;
```

**Guidance**
- Treat this as generated output only.
- The frontend hooks and debug UI depend on this file being current.
- If contract info is missing, regenerate it by deploying again instead of editing this file by hand.

**Example**
Language: text
Description: Expected maintenance rule for contract metadata.

```text
Do not edit deployedContracts.ts manually; update contracts and run yarn deploy.
```

### Frontend Contract and Network Surface
**Exports**
- packages/nextjs/scaffold.config.ts
- packages/nextjs/services/web3/wagmiConfig.tsx
- useScaffoldReadContract
- useScaffoldWriteContract
- /debug

The frontend-specific configuration and hook surface for reading/writing
contracts and debugging deployed metadata.

#### packages/nextjs/scaffold.config.ts
**Kind**
config

**Summary**
Main Scaffold-ETH frontend config for target networks, polling, RPC overrides,
WalletConnect, and burner wallet behavior.

**Definition**
Language: typescript
Source: `packages/nextjs/scaffold.config.ts`

```ts
type ScaffoldConfig = {
  targetNetworks: readonly Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  burnerWalletMode: "localNetworksOnly" | "allNetworks" | "disabled";
};
```

**Guidance**
- Change `targetNetworks` first when moving the app off the default local Hardhat network.
- Keep RPC overrides and API keys here instead of scattering network config through components.
- Adjust the polling interval intentionally for live networks and especially L2 targets.

**Example**
Language: typescript
Description: Switch the app target network from local Hardhat to Sepolia.

```ts
import * as chains from "viem/chains";

const scaffoldConfig = {
  targetNetworks: [chains.sepolia],
  pollingInterval: 3000,
  // ...
} as const;
```

#### packages/nextjs/services/web3/wagmiConfig.tsx
**Kind**
config

**Summary**
The wagmi client configuration that derives enabled chains from
`scaffold.config.ts`, forces mainnet availability for shared utilities such as
ENS, and builds fallback transports.

**Definition**
Language: typescript
Source: `packages/nextjs/services/web3/wagmiConfig.tsx`

```ts
export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors(),
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      ...(chain.id !== hardhat.id ? { pollingInterval: scaffoldConfig.pollingInterval } : {}),
    });
  },
});
```

**Guidance**
- Treat this as the transport layer derived from `scaffold.config.ts`, not the first place to hardcode app networks.
- The config always ensures mainnet is available once for things like ENS resolution and ETH price lookups.
- Put network intent in `scaffold.config.ts`; use this file to understand transport fallback behavior and SSR usage.

**Example**
Language: text
Description: Where to look when RPC fallback behavior is not what you expect.

```text
Adjust target networks and overrides in scaffold.config.ts, then inspect wagmiConfig.tsx for how fallback transports are built.
```

#### useScaffoldReadContract
**Kind**
hook

**Summary**
Wrapper around wagmi contract reads that auto-loads ABI and address info from
generated contract metadata for the selected network.

**Definition**
Language: typescript
Source: `packages/nextjs/hooks/scaffold-eth/useScaffoldReadContract.ts`

```ts
export const useScaffoldReadContract = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "pure" | "view">
>(
  config: UseScaffoldReadConfig<TContractName, TFunctionName>
) => { /* wagmi read wrapper */ };
```

**Guidance**
- Prefer this over ad hoc `useReadContract` calls when you are reading deployed contracts inside the Scaffold-ETH frontend.
- It resolves ABI and address from `deployedContracts.ts` and `externalContracts.ts`.
- Watch mode is enabled by default through block tracking, so be intentional when disabling or overriding it.
- Use the current hook name exactly; `AGENTS.md` explicitly warns against stale old names like `useScaffoldContractRead`.

**Example**
Language: typescript
Description: Read a view function from the deployed contract.

```ts
const { data: totalCounter } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "userGreetingCounter",
  args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
});
```

#### useScaffoldWriteContract
**Kind**
hook

**Summary**
Wrapper around wagmi contract writes that resolves deployed contract metadata,
checks wallet/network state, optionally simulates the write, and sends the
transaction through the scaffold transactor flow.

**Definition**
Language: typescript
Source: `packages/nextjs/hooks/scaffold-eth/useScaffoldWriteContract.ts`

```ts
export function useScaffoldWriteContract<TContractName extends ContractName>(
  config: UseScaffoldWriteConfig<TContractName>
): ScaffoldWriteContractReturnType<TContractName>;
```

**Guidance**
- Prefer this over raw `useWriteContract` for normal Scaffold-ETH contract writes.
- It already handles missing deployment metadata, wallet connection checks, wrong-network errors, and optional simulation.
- Use the object-parameter form; the string-parameter overload is deprecated in the source.
- Use the current hook name exactly; `AGENTS.md` explicitly warns against stale old names like `useScaffoldContractWrite`.

**Example**
Language: typescript
Description: Write to a payable contract function.

```ts
const { writeContractAsync, isPending } = useScaffoldWriteContract({
  contractName: "YourContract",
});

await writeContractAsync({
  functionName: "setGreeting",
  args: ["gm"],
  value: parseEther("0.01"),
});
```

#### /debug
**Kind**
workflow

**Summary**
The built-in Debug Contracts page for interacting with deployed contracts from
the generated metadata surface.

**Definition**
Language: typescript
Source: `packages/nextjs/app/debug/page.tsx`

```tsx
const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div>Debug Contracts</div>
    </>
  );
};
```

**Guidance**
- Use this as the first frontend inspection surface after deploying locally.
- If it looks empty or broken, check whether deploy metadata was regenerated before debugging the page itself.
- Treat it as scaffolded operator UI, not as the final product UX for your app.

**Example**
Language: text
Description: Built-in route for contract interaction after local deploy.

```text
Open http://localhost:3000/debug after yarn chain + yarn deploy + yarn start.
```

### AI Agent Surface
**Exports**
- AGENTS.md
- .mcp.json
- .agents/skills/*
- editor agent directories

The repo’s built-in instructions for coding agents, retrieval setup, and
specialized local skill routing.

#### AGENTS.md
**Kind**
workflow

**Summary**
Primary agent instruction file describing flavor detection, common commands,
contract interaction hooks, styling expectations, and retrieval-first behavior.

**Definition**
Language: markdown
Source: `AGENTS.md`

```md
Check which package exists:
- packages/hardhat => Hardhat flavor
- packages/foundry => Foundry flavor

Use hooks from packages/nextjs/hooks/scaffold-eth
Use Context7 MCP for up-to-date library docs
```

**Guidance**
- Read this first before modifying Scaffold-ETH 2 with an AI agent.
- It contains current hook-name corrections, flavor detection, and style conventions that are more specific than generic Hardhat/Next/Wagmi knowledge.
- Treat it as the authoritative agent workflow surface for this repo.

**Example**
Language: text
Description: First retrieval step for an AI agent inside the repo.

```text
Open AGENTS.md first, detect the repo flavor, then follow the repo-specific hook and styling rules.
```

#### .mcp.json
**Kind**
config

**Summary**
Repo-scoped MCP configuration that points agents to the Context7 documentation
server.

**Definition**
Language: json
Source: `.mcp.json`

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

**Guidance**
- Use this when you need current library docs for Wagmi, Viem, RainbowKit, DaisyUI, Next.js, Hardhat, and related stack pieces.
- Treat it as a retrieval aid, not a replacement for the repo’s own guidance.
- If a coding agent supports repo-local MCP config, this file is part of the expected setup.

**Example**
Language: text
Description: Retrieve current library docs while working in the repo.

```text
Use the configured Context7 MCP server to fetch up-to-date docs for Wagmi, Viem, Hardhat, or Next.js.
```

#### .agents/skills/*
**Kind**
workflow

**Summary**
Local skill catalog for specialized Ethereum topics such as ERC-20, ERC-721,
SIWE, EIP-712, EIP-5792, Ponder, and Solidity security.

**Definition**
Language: text
Source: `.agents/skills/*`

```text
.agents/skills/erc-20/SKILL.md
.agents/skills/erc-721/SKILL.md
.agents/skills/eip-712/SKILL.md
.agents/skills/eip-5792/SKILL.md
.agents/skills/ponder/SKILL.md
.agents/skills/siwe/SKILL.md
.agents/skills/solidity-security/SKILL.md
```

**Guidance**
- Fetch the matching skill before implementing a topic-specific feature instead of relying only on generic Ethereum memory.
- Use these for narrow protocol or standards work; use `AGENTS.md` first for the repo-wide workflow.
- Keep the retrieval narrow and task-specific rather than loading all skills at once.

**Example**
Language: text
Description: Use a local skill for Sign-In with Ethereum work.

```text
Read .agents/skills/siwe/SKILL.md before implementing wallet-auth or SIWE session flows.
```

#### editor agent directories
**Kind**
config

**Summary**
Parallel agent-instruction surfaces for supported coding environments such as
Claude, Cursor, and OpenCode.

**Definition**
Language: text
Source: `.claude`, `.cursor`, `.opencode`, and `.agents/agents`

```text
.claude/
.cursor/
.opencode/
.agents/agents/grumpy-carlos-code-reviewer.md
```

**Guidance**
- Treat these as environment-specific instruction mirrors or extensions around the repo’s shared agent guidance.
- The `grumpy-carlos-code-reviewer` agent is a repo-specific post-change review persona, not a general Ethereum coding tool.
- If you are building agent workflows around Scaffold-ETH 2, these directories are part of the intended surface.

**Example**
Language: text
Description: Inspect repo-specific agent support beyond AGENTS.md.

```text
Check .claude, .cursor, .opencode, and .agents/agents when configuring editor- or CLI-specific agent behavior.
```
