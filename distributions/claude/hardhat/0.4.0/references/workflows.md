# Hardhat Workflows

### Initialize a Hardhat 3 project with safe configuration variables
1. Run `npx hardhat --init` inside an npm project root.
2. Keep the generated config in `hardhat.config.ts` and wrap it in `defineConfig(...)`.
3. Replace RPC URLs, mnemonics, and similar machine-specific values with `configVariable(...)`.
4. If you want encrypted local secret storage, set the value through `npx hardhat keystore set <NAME>`.
5. Run `npx hardhat build` or a network-targeted command to confirm the selected execution path resolves the needed variables.

```bash
npx hardhat --init
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat build
```

### Connect to a network programmatically and clean up the connection
1. Import `network` from `hardhat`.
2. Create a connection with `await network.connect("<network-name>")` or explicit params.
3. Use the returned EIP-1193 `provider` and connection metadata for the operation.
4. Call `close()` when the script no longer needs the connection.

```ts
import { network } from "hardhat";

const connection = await network.connect("sepolia");

try {
  const blockNumber = await connection.provider.request({
    method: "eth_blockNumber",
    params: [],
  });
  console.log(blockNumber);
} finally {
  await connection.close();
}
```

### Compile contracts and then read artifacts safely
1. Use `solidity.getRootFilePaths()` to collect current build roots.
2. Call `solidity.build(...)`.
3. Guard the result with `solidity.isSuccessfulBuildResult(...)`.
4. Read the target artifact with `artifacts.readArtifact(...)`, preferably by fully qualified name.

```ts
import { artifacts, solidity } from "hardhat";

const rootFilePaths = await solidity.getRootFilePaths();
const buildResult = await solidity.build(rootFilePaths, { quiet: true });

if (!solidity.isSuccessfulBuildResult(buildResult)) {
  throw new Error(buildResult.formattedReason);
}

const artifact = await artifacts.readArtifact("contracts/Counter.sol:Counter");
console.log(artifact.bytecode.slice(0, 10));
```
