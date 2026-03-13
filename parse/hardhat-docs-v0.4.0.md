# Hardhat Documentation Pack

## Snapshot
- library name: hardhat
- version or version range: ^3.1.12
- primary language: typescript
- homepage or canonical docs URL: https://hardhat.org/docs/
- short description: Hardhat is an Ethereum development environment with typed project configuration, network management, build and artifact APIs, and a pluggable runtime for scripts, tests, and tasks.
- source set summary: npm:hardhat@3.1.12 TypeScript declarations, official Hardhat 3 docs and explanations pages, package README, parse/hardhat.out as a cross-check only, and the existing AgentHub hardhat pack for coverage audit only

## What This Library Is For
Hardhat is used to initialize Ethereum development projects, define and validate project configuration, manage simulated and remote network connections, compile Solidity sources, read artifacts, and extend the runtime with tasks and plugins. This pack focuses on the current Hardhat 3 core surface rather than plugin-specific helpers such as ethers or viem wrappers.

## Installation And Setup
- install commands:
  - `npm install --save-dev hardhat`
  - `npx hardhat --init`
- environment prerequisites:
  - Node.js `v22.10.0` or greater for Hardhat 3
  - an npm project root for config resolution and local installs
- configuration prerequisites:
  - author the project config with `defineConfig(...)`
  - store RPC URLs, mnemonics, and API keys through `configVariable(...)` or the Hardhat keystore instead of hard-coding them
  - choose the right network type explicitly: simulated (`edr-simulated`) or remote HTTP (`http`)
- minimum setup example:

```ts
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
    },
  },
});
```

## Core Concepts

### Hardhat 3 is config-first
- `defineConfig(...)` is the canonical entry point for authoring `hardhat.config.ts`.
- Network, compiler, test, and plugin behavior flow from the config object.
- Common confusion to avoid: do not treat legacy Hardhat 2 guides as current if they lean on `hre.ethers` or plugin extension hooks without checking Hardhat 3 docs.

### Configuration variables are lazy
- `configVariable(name, format?)` resolves only when the value is needed.
- This lets a project define multiple secrets without requiring all of them for every task.
- Common confusion to avoid: missing secrets may not fail at startup; they often fail only when a specific network or task path is exercised.

### Network connections are explicit runtime objects
- `network.connect(...)` returns a `NetworkConnection` with an EIP-1193 provider and connection metadata.
- Repeated `network.connect(...)` calls create independent connections.
- Common confusion to avoid: selecting `--network mainnet` for a CLI run is not the same thing as reusing one connection object across a long-lived Node process.

### Build and artifact access are first-class APIs
- Hardhat 3 exposes `solidity` for build-system operations and `artifacts` for contract outputs.
- Artifact names may be ambiguous if bare contract names collide.
- Common confusion to avoid: do not assume a contract name is unique across the project; use fully qualified names when ambiguity matters.

### The core package is smaller than many Hardhat 2 examples imply
- The core package exports `config`, `tasks`, `network`, `artifacts`, and `solidity`.
- Ethers and viem helpers are plugin-provided, not generic core guarantees.
- Common confusion to avoid: importing from `hardhat` does not automatically give you the old Hardhat 2 `hre.ethers` experience unless the right plugin provides it.

## Decision Rules
- Use `defineConfig(...)` for every real project config and reserve raw object exports for edge cases only.
- Use `configVariable(...)` whenever a value is environment-specific, secret, or likely to vary across machines.
- Use `network.connect(...)` for programmatic scripts and long-lived processes; use `--network` for CLI task selection.
- Use `artifacts.readArtifact(...)` when you need ABI or bytecode, and use fully qualified names when contract-name ambiguity is possible.
- Use `solidity.build(...)` when you need programmatic compilation control; use normal CLI build flows for ordinary project work.
- Avoid the deprecated Hardhat 2 plugin API exports (`extendConfig`, `extendEnvironment`, `extendProvider`, `scope`, `subtask`) in new Hardhat 3 code.

## Preconditions And Invariants
- Hardhat 3 requires Node.js `v22.10.0` or newer.
- `createHardhatRuntimeEnvironment(...)` expects a valid `HardhatUserConfig` and resolves the project root from the npm project unless one is supplied explicitly.
- HTTP network configs require a `url`.
- Tokenized or derived config values from `configVariable(...)` are not resolved until the execution path requires them.
- Each `network.connect(...)` call creates a separate connection that should be closed in long-running or high-churn processes.
- `solidity.build(...)` operates on root file paths, which may be filesystem paths or `npm:<package>/<file>` URIs.

## Public Surface Area

### Configuration authoring

#### defineConfig
**Kind:** function

**Summary:** Wraps a `HardhatUserConfig` and is the standard authoring entry point for `hardhat.config.ts`.

**Definition**
```ts
export declare function defineConfig(config: HardhatUserConfig): HardhatUserConfig;
```

**Guidance**
- Use it in every `hardhat.config.ts` so config shape stays explicit and aligned with current docs.
- Prefer `defineConfig(...)` over ad hoc config exports when you want examples and generated code to match the official Hardhat 3 flow.
- Keep plugin-provided config isolated to the plugins you actually install; Hardhat core examples should not assume ethers-specific fields.

**Example**
```ts
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
});
```

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/config.d.ts`
- Exact export surface from the published package.

#### configVariable
**Kind:** function

**Summary:** Creates a lazily resolved configuration variable for secrets and environment-specific values.

**Definition**
```ts
export declare function configVariable(name: string, format?: string): ConfigurationVariable;
```

**Guidance**
- Use it for RPC URLs, private keys, mnemonics, and API tokens instead of hard-coding values in config.
- The optional `format` string is useful when only part of a value should come from the secret store, such as embedding an API key into a URL template.
- Expect lazy resolution: a missing value may surface only when the selected network or task actually reads it.

**Example**
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

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/internal/core/config.d.ts`
- Guidance cross-checked with `https://hardhat.org/docs/guides/configuration-variables`

#### task
**Kind:** function

**Summary:** Starts a new Hardhat task definition with typed options, positional arguments, and an action.

**Definition**
```ts
export declare function task(id: string | string[], description?: string): NewTaskDefinitionBuilder;
```

**Guidance**
- Use `task(...)` for new Hardhat 3 tasks and keep task IDs stable because they become part of the CLI contract.
- Prefer lazy action modules for plugin-safe task definitions and keep inline actions small for project-local tasks.
- Reach for task definitions when the behavior is a reusable project command, not just a one-off script.

**Example**
```ts
import { task } from "hardhat/config";

export default [
  task("accounts", "Print the configured accounts").setInlineAction(
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

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/internal/core/config.d.ts`
- Builder behavior and argument model grounded in `npm:hardhat@3.1.12:package/dist/src/types/tasks.d.ts`

### Runtime and network management

#### createHardhatRuntimeEnvironment
**Kind:** function

**Summary:** Creates a Hardhat Runtime Environment instance from config, global options, and an optional project root.

**Definition**
```ts
export declare function createHardhatRuntimeEnvironment(
  config: HardhatUserConfig,
  userProvidedGlobalOptions?: Partial<GlobalOptions>,
  projectRoot?: string,
  unsafeOptions?: UnsafeHardhatRuntimeEnvironmentOptions
): Promise<HardhatRuntimeEnvironment>;
```

**Guidance**
- Use this when embedding Hardhat programmatically, not for normal CLI-driven project work.
- Provide an explicit `projectRoot` when the current working directory is not the intended npm project root.
- Treat the runtime environment as heavyweight; create it deliberately and avoid reinitializing it repeatedly inside tight loops.

**Example**
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
```

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/internal/hre-initialization.d.ts`

#### network
**Kind:** object

**Summary:** Manages programmatic network connections and spawned JSON-RPC servers.

**Definition**
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
- Use `network.connect(...)` for programmatic scripts, tests, and long-lived processes that need an explicit `NetworkConnection`.
- Each call returns an independent connection; close them explicitly in scripts that create many of them.
- Use `createServer(...)` when you need to expose a JSON-RPC server process for external tools or local integration flows.
- Distinguish network config names from live blockchain identity; the config name is how Hardhat resolves settings, not a guarantee about remote state.

**Example**
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

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/index.d.ts`
- Method contracts grounded in `npm:hardhat@3.1.12:package/dist/src/types/network.d.ts`
- Guidance cross-checked with `https://hardhat.org/docs/explanations/network-management`

#### config
**Kind:** object

**Summary:** Exposes the resolved Hardhat configuration for the current runtime.

**Definition**
```ts
export declare const config: HardhatConfig;
```

**Guidance**
- Treat `config` as resolved runtime state for inspection and branching, not as mutable authoring input.
- Use it when diagnostics or scripts need to confirm the active compiler, paths, or network settings.
- Keep writes out of the runtime path; config mutation belongs in configuration authoring, not in execution logic.

**Example**
```ts
import { config } from "hardhat";

console.log(config.paths.sources);
console.log(config.solidity.version ?? config.solidity.compilers?.[0]?.version);
```

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/index.d.ts`
- Config shapes cross-checked with `https://hardhat.org/docs/reference/configuration`

### Build and artifact access

#### artifacts
**Kind:** object

**Summary:** Reads built contract artifacts, artifact paths, and build info metadata from the Hardhat build system.

**Definition**
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
- Use `readArtifact(...)` when deployment or verification code needs ABI and bytecode without guessing artifact file paths.
- Prefer fully qualified names when the project can contain colliding contract names across packages or source files.
- Check existence or enumerate fully qualified names before assuming a contract has already been built.

**Example**
```ts
import { artifacts } from "hardhat";

const artifact = await artifacts.readArtifact("contracts/Counter.sol:Counter");
console.log(artifact.abi.length, artifact.bytecode.slice(0, 10));
```

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/index.d.ts`
- Method contracts grounded in `npm:hardhat@3.1.12:package/dist/src/types/artifacts.d.ts`

#### solidity
**Kind:** object

**Summary:** Exposes the Hardhat 3 Solidity build system for root-file discovery, compilation planning, and builds.

**Definition**
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
- Use `solidity` when you need programmatic compilation orchestration instead of shelling out to the CLI.
- `build(...)` accepts both filesystem source paths and `npm:<package>/<file>` URIs, which matters for dependency builds and library analysis.
- `isolated: true` trades compilation merging for cleaner per-file boundaries, which can help verification and debugging.
- Always inspect failed build results instead of assuming a build map was returned; `isSuccessfulBuildResult(...)` is the explicit guard.

**Example**
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

**Source Notes**
- Source: `npm:hardhat@3.1.12:package/dist/src/index.d.ts`
- Method contracts grounded in `npm:hardhat@3.1.12:package/dist/src/types/solidity/build-system.d.ts`

## Common Workflows

### Initialize a Hardhat 3 project with safe config variables
- when to use it:
  - when starting a new Hardhat 3 project or modernizing a Hardhat 2-era config
- ordered steps:
  1. Run `npx hardhat --init` in an empty npm project directory.
  2. Author `hardhat.config.ts` with `defineConfig(...)`.
  3. Replace RPC URLs, mnemonics, and similar secrets with `configVariable(...)`.
  4. If you want encrypted local storage, install and use the Hardhat keystore workflow.
  5. Run a simple build or network-targeted task to verify lazy config variables resolve correctly.
- example:

```bash
npx hardhat --init
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat build
```

- common failure points:
  - using a stale Node.js version below Hardhat 3's support floor
  - copying Hardhat 2 config examples that assume old plugin defaults
  - forgetting that config variables resolve lazily and only fail on the execution path that needs them

### Programmatically connect to a network and clean up correctly
- when to use it:
  - when writing Node scripts or integration utilities that need explicit runtime control
- ordered steps:
  1. Import `network` from `hardhat`.
  2. Call `await network.connect("<network-name>")` or pass explicit connection params.
  3. Use the returned `provider`, `networkName`, and `networkConfig` for work.
  4. Close the connection when the process creates many connections or runs for a long time.
- example:

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

- common failure points:
  - confusing the selected network config with the remote blockchain's actual identity
  - leaking connections in long-lived tools
  - assuming plugin helpers are present on every connection without installing the corresponding plugin

### Compile contracts and read artifacts programmatically
- when to use it:
  - when a script needs to ensure artifacts exist before reading them
- ordered steps:
  1. Use `solidity.getRootFilePaths()` to enumerate build roots.
  2. Call `solidity.build(...)`.
  3. Guard the result with `solidity.isSuccessfulBuildResult(...)`.
  4. Read ABI and bytecode through `artifacts.readArtifact(...)`.
- example:

```ts
import { artifacts, solidity } from "hardhat";

const rootFilePaths = await solidity.getRootFilePaths();
const buildResult = await solidity.build(rootFilePaths, { quiet: true });

if (!solidity.isSuccessfulBuildResult(buildResult)) {
  throw new Error(buildResult.formattedReason);
}

const artifact = await artifacts.readArtifact("contracts/Counter.sol:Counter");
console.log(artifact.contractName);
```

- common failure points:
  - assuming a contract name is unique when a fully qualified name is required
  - ignoring failed build results and then blaming `readArtifact(...)`
  - running against stale artifacts after config or compiler changes

## Common Confusions
- Hardhat 3 core vs plugin helpers:
  - `hardhat` core exports network, config, artifacts, and solidity primitives.
  - Ethers or viem developer ergonomics are provided by plugins, not implied by the core package alone.
- `network.connect(...)` vs `--network`:
  - `--network` selects the fallback network config for a CLI invocation.
  - `network.connect(...)` constructs an explicit `NetworkConnection` object in code.
- `configVariable(...)` vs eager environment reads:
  - `configVariable(...)` resolves lazily and can be formatted.
  - direct `process.env` reads happen immediately and often leak environment assumptions into module load time.
- Hardhat 2 task/plugin API vs Hardhat 3:
  - some old plugin API functions remain exported for compatibility but are explicitly deprecated.
  - new code should not build on those deprecated hooks.

## Pitfalls And Troubleshooting

### A secret or RPC URL error appears only when I target one network
- likely cause:
  - the value is supplied through `configVariable(...)`, so Hardhat only tries to resolve it when that network or task path is exercised
- how to verify:
  - run the exact task with the same `--network` and inspect the referenced variable names in `hardhat.config.ts`
  - confirm the keystore entry or environment variable exists under the expected name
- fix:
  - define the missing variable through the environment or Hardhat keystore
  - keep the variable name stable and centralize it in config rather than spreading string literals through scripts

### A script assumes hre.ethers exists but Hardhat 3 core does not provide it
- likely cause:
  - the script or example was written for a Hardhat 2 or plugin-enabled environment
- how to verify:
  - inspect imports and installed plugins to see whether the ethers integration is actually present
  - compare the project setup to current Hardhat 3 docs, which recommend plugin-specific toolboxes
- fix:
  - either install the plugin that provides the helper or rewrite the script to use the currently installed runtime surface
  - keep the core Hardhat pack focused on Hardhat primitives, not plugin-specific assumptions

### readArtifact fails for a contract that appears to exist
- likely cause:
  - the contract was not built, the name is ambiguous, or the artifact path is stale after project changes
- how to verify:
  - rebuild the project
  - inspect `await artifacts.getAllFullyQualifiedNames()`
  - retry with a fully qualified name
- fix:
  - run a build first
  - use the fully qualified contract name
  - clear stale build outputs when switching branches or compiler settings

## Best Practices
- Keep the core pack centered on current Hardhat 3 primitives and explicitly mark plugin boundaries.
- Prefer `hardhat.config.ts` with `defineConfig(...)` over loose config objects.
- Use `configVariable(...)` or the keystore for machine-specific or secret values.
- Close network connections in long-running scripts and generators.
- Use fully qualified artifact names whenever ambiguity is possible.
- Check build results explicitly before assuming artifacts exist.

## References
- https://hardhat.org/docs/getting-started
- https://hardhat.org/docs/reference/configuration
- https://hardhat.org/docs/reference/nodejs-support
- https://hardhat.org/docs/guides/configuration-variables
- https://hardhat.org/docs/explanations/network-management
- npm:hardhat@3.1.12:package/README.md
- npm:hardhat@3.1.12:package/dist/src/config.d.ts
- npm:hardhat@3.1.12:package/dist/src/index.d.ts
- npm:hardhat@3.1.12:package/dist/src/internal/core/config.d.ts
- npm:hardhat@3.1.12:package/dist/src/internal/hre-initialization.d.ts
- npm:hardhat@3.1.12:package/dist/src/types/network.d.ts
- npm:hardhat@3.1.12:package/dist/src/types/artifacts.d.ts
- npm:hardhat@3.1.12:package/dist/src/types/solidity/build-system.d.ts

## Open Questions
- `parse/hardhat.out` appears to reflect an older or broader internal surface than the locked `^3.1.12` target, so it is not used as an authoritative contract source.
- Plugin-specific developer surfaces such as official viem and ethers integrations are intentionally left to separate packs or follow-on revisions.
