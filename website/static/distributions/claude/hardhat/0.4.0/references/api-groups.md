# Hardhat API Groups

### Configuration Authoring
**Exports**
- defineConfig
- configVariable
- task

Core entry points for authoring `hardhat.config.ts`, handling machine-specific values safely, and defining reusable project tasks.

#### defineConfig
**Kind**
function

**Summary**
Wraps a `HardhatUserConfig` and is the standard authoring entry point for `hardhat.config.ts`.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/config.d.ts

```ts
export declare function defineConfig(config: HardhatUserConfig): HardhatUserConfig;
```

**Guidance**
- Use `defineConfig(...)` in real Hardhat 3 projects so generated examples stay aligned with the official config model.
- Keep plugin-specific configuration limited to installed plugins; the Hardhat core config should remain valid without assuming ethers-era defaults.
- Prefer `hardhat.config.ts` examples over stale blog posts or Hardhat 2 snippets when migrating or scaffolding new projects.

**Example**
Language: typescript
Description: Minimal Hardhat 3 project configuration with an explicit compiler version.

```ts
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
});
```

#### configVariable
**Kind**
function

**Summary**
Creates a lazily resolved configuration variable for secrets and environment-specific values.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/internal/core/config.d.ts

```ts
export declare function configVariable(name: string, format?: string): ConfigurationVariable;
```

**Guidance**
- Use `configVariable(...)` for RPC URLs, API keys, mnemonics, and private keys instead of hard-coding values into config files.
- The optional `format` parameter is useful when only part of the final string should come from a secret value, such as templating an Alchemy or Infura URL.
- Resolution is lazy, so missing values often fail when a target network or task path is exercised rather than at config load time.

**Example**
Language: typescript
Description: Store only the API key and compose the final RPC URL through the format parameter.

```ts
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable(
        "ALCHEMY_KEY",
        "https://eth-sepolia.g.alchemy.com/v2/{variable}"
      ),
    },
  },
});
```

#### task
**Kind**
function

**Summary**
Starts a new Hardhat task definition with typed arguments, options, and an action.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/internal/core/config.d.ts

```ts
export declare function task(id: string | string[], description?: string): NewTaskDefinitionBuilder;
```

**Guidance**
- Use `task(...)` when behavior should become a reusable project command instead of a one-off script.
- Keep task IDs stable because they become part of the CLI contract and documentation.
- Use lazy action modules for plugin-safe or reusable task code and keep inline actions small for project-local automation.
- Prefer new task definitions over the deprecated Hardhat 2 task-extension style.

**Example**
Language: typescript
Description: Define a simple project-local task that reads the selected network config.

```ts
import { task } from "hardhat/config";

export default [
  task("network:name", "Print the selected network").setInlineAction(
    async (_args, hre) => {
      const connection = await hre.network.connect();
      try {
        console.log(connection.networkName);
      } finally {
        await connection.close();
      }
    }
  ).build(),
];
```

### Runtime and Network Management
**Exports**
- createHardhatRuntimeEnvironment
- config
- network

Core runtime primitives for programmatic embedding, resolved project inspection, and explicit network connection management.

#### createHardhatRuntimeEnvironment
**Kind**
function

**Summary**
Creates a Hardhat Runtime Environment from user config, global options, and an optional project root.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/internal/hre-initialization.d.ts

```ts
export declare function createHardhatRuntimeEnvironment(
  config: HardhatUserConfig,
  userProvidedGlobalOptions?: Partial<GlobalOptions>,
  projectRoot?: string,
  unsafeOptions?: UnsafeHardhatRuntimeEnvironmentOptions
): Promise<HardhatRuntimeEnvironment>;
```

**Guidance**
- Use this when embedding Hardhat inside Node programs or generators that need an HRE without going through the CLI.
- Provide an explicit `projectRoot` when the current working directory is not the intended npm project root.
- Treat HRE creation as a heavyweight setup step rather than something to perform repeatedly inside tight loops.
- Prefer the CLI for ordinary build and test workflows; this API is for programmatic orchestration.

**Example**
Language: typescript
Description: Create a minimal runtime environment programmatically.

```ts
import { createHardhatRuntimeEnvironment } from "hardhat/hre";

const hre = await createHardhatRuntimeEnvironment(
  {
    solidity: {
      version: "0.8.28",
    },
  },
  { config: "hardhat.config.ts" }
);

console.log(hre.config.paths.sources);
```

#### config
**Kind**
object

**Summary**
Exposes the resolved Hardhat configuration for the active runtime.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/index.d.ts

```ts
export declare const config: HardhatConfig;
```

**Guidance**
- Use `config` for diagnostics, runtime branching, or tooling that needs the resolved compiler, path, or network settings.
- Treat it as resolved state, not as a mutable authoring surface.
- When debugging environment-specific issues, inspect `config` after the runtime resolves variables and plugin extensions.

**Example**
Language: typescript
Description: Inspect resolved project settings from a script.

```ts
import { config } from "hardhat";

console.log(config.paths.sources);
console.log(config.networks.default?.type);
```

#### network
**Kind**
object

**Summary**
Creates programmatic network connections and spawned JSON-RPC servers.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/types/network.d.ts

```ts
export declare const network: NetworkManager;

export interface NetworkManager {
  connect<ChainTypeT extends ChainType | string = DefaultChainType>(
    networkOrParams?: NetworkConnectionParams<ChainTypeT> | string
  ): Promise<NetworkConnection<ChainTypeT>>;
  createServer(
    networkOrParams?: NetworkConnectionParams | string,
    hostname?: string,
    port?: number
  ): Promise<JsonRpcServer>;
}
```

**Guidance**
- Use `network.connect(...)` for explicit programmatic work in scripts, tests, and automation instead of assuming one implicit global connection.
- Every `connect(...)` call creates a new independent `NetworkConnection`; close it when your process creates many connections or runs long enough for leaks to matter.
- Use explicit network names or params when a script must not inherit the CLI fallback network accidentally.
- The returned `provider` is an EIP-1193 provider; plugin-added helpers may appear too, but they are not guaranteed by the Hardhat core pack.

**Example**
Language: typescript
Description: Connect to Sepolia, query the current chain ID, and clean up the connection.

```ts
import { network } from "hardhat";

const connection = await network.connect("sepolia");

try {
  const chainId = await connection.provider.request({
    method: "eth_chainId",
    params: [],
  });
  console.log(connection.networkName, chainId);
} finally {
  await connection.close();
}
```

### Build and Artifact Access
**Exports**
- artifacts
- solidity

Core build-system and artifact APIs for compiling contracts, reading build outputs, and inspecting project contract metadata.

#### artifacts
**Kind**
object

**Summary**
Reads built artifacts, artifact paths, and build-info-related metadata from the Hardhat build system.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/types/artifacts.d.ts

```ts
export declare const artifacts: ArtifactManager;

export interface ArtifactManager {
  readArtifact<ContractNameT extends StringWithArtifactContractNamesAutocompletion>(
    contractNameOrFullyQualifiedName: ContractNameT
  ): Promise<GetArtifactByName<ContractNameT>>;
  getArtifactPath(contractNameOrFullyQualifiedName: string): Promise<string>;
  artifactExists(contractNameOrFullyQualifiedName: string): Promise<boolean>;
  getAllFullyQualifiedNames(): Promise<ReadonlySet<string>>;
}
```

**Guidance**
- Use `readArtifact(...)` when deployment, verification, or analysis code needs ABI and bytecode without manually guessing output paths.
- Prefer fully qualified names in real projects because duplicate contract names across packages or files are common.
- If a script depends on artifacts, ensure a successful build happened first instead of assuming the filesystem is already current.
- Use enumeration helpers when debugging ambiguity or missing-artifact failures.

**Example**
Language: typescript
Description: Read an artifact by fully qualified name after a build.

```ts
import { artifacts, solidity } from "hardhat";

const rootFilePaths = await solidity.getRootFilePaths();
const buildResult = await solidity.build(rootFilePaths, { quiet: true });

if (!solidity.isSuccessfulBuildResult(buildResult)) {
  throw new Error(buildResult.formattedReason);
}

const artifact = await artifacts.readArtifact("contracts/Counter.sol:Counter");
console.log(artifact.contractName, artifact.abi.length);
```

#### solidity
**Kind**
object

**Summary**
Exposes the Hardhat 3 Solidity build system for root-file discovery, build planning, and compilation.

**Definition**
Language: typescript
Source: npm:hardhat@3.1.12:package/dist/src/types/solidity/build-system.d.ts

```ts
export declare const solidity: SolidityBuildSystem;

export interface SolidityBuildSystem {
  getRootFilePaths(options?: { scope?: BuildScope }): Promise<string[]>;
  getScope(fsPath: string): Promise<BuildScope>;
  build(
    rootFilePaths: string[],
    options?: BuildOptions
  ): Promise<CompilationJobCreationError | Map<string, FileBuildResult>>;
  isSuccessfulBuildResult(
    buildResult: CompilationJobCreationError | Map<string, FileBuildResult>
  ): buildResult is Map<string, FileBuildResult>;
  getCompilationJobs(
    rootFilePaths: string[],
    options?: GetCompilationJobsOptions
  ): Promise<CompilationJobCreationError | GetCompilationJobsResult>;
}
```

**Guidance**
- Use `solidity.build(...)` when a script needs programmatic control over compilation instead of shelling out to the CLI.
- Check `solidity.isSuccessfulBuildResult(...)` before treating the result as a map of built files.
- `isolated: true` is useful when you want clearer per-file build boundaries, even though it may reduce build merging optimizations.
- Remember that root file paths can be filesystem paths or `npm:<package>/<file>` URIs; this matters for dependency builds and analysis tooling.

**Example**
Language: typescript
Description: Force a programmatic build and inspect whether it succeeded.

```ts
import { solidity } from "hardhat";

const rootFilePaths = await solidity.getRootFilePaths();
const buildResult = await solidity.build(rootFilePaths, {
  force: true,
  quiet: true,
});

if (!solidity.isSuccessfulBuildResult(buildResult)) {
  throw new Error(buildResult.formattedReason);
}

console.log(buildResult.size);
```
