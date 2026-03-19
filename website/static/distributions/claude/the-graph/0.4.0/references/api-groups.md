# The Graph API Groups

### Subgraph Authoring
**Exports**
- subgraph.yaml
- schema.graphql
- mappings
- generated types

These files and generated artifacts define what gets indexed and what downstream queries can return.

#### subgraph.yaml
**Kind**
config

**Summary**
The subgraph manifest declares data sources, ABIs, networks, handlers, templates, and mapping entrypoints for the indexing pipeline.

**Definition**
Language: yaml
Source: https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/

```yaml
specVersion: <spec-version>
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: <DataSourceName>
    network: <network>
    source:
      address: "<contract-address>"
      abi: <AbiName>
      startBlock: <start-block>
    mapping:
      file: ./src/<mapping-file>.ts
templates:
  - kind: ethereum/contract
    name: <TemplateName>
```

**Guidance**
- Treat the manifest as the authoritative description of what the subgraph indexes.
- Keep ABI names, handler names, and mapping paths aligned with the files on disk and the generated bindings.
- When adding data sources or templates, check whether the schema and mappings already support the new entity flow.
- If a query returns nothing useful, inspect the manifest and handler coverage before rewriting the query.

**Example**
Language: yaml
Description: Minimal shape of a contract-backed subgraph manifest.

```yaml
specVersion: 1.3.0
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: Token
    network: mainnet
    source:
      address: "0x1234567890abcdef1234567890abcdef12345678"
      abi: Token
      startBlock: 18000000
    mapping:
      file: ./src/token.ts
```

#### schema.graphql
**Kind**
config

**Summary**
The GraphQL schema defines the entity model stored by indexing and returned to downstream GraphQL clients.

**Definition**
Language: graphql
Source: https://thegraph.com/docs/en/subgraphs/developing/creating/graphql-schema/

```graphql
type Transfer @entity {
  id: Bytes!
  from: Bytes!
  to: Bytes!
  value: BigInt!
  blockNumber: BigInt!
}
```

**Guidance**
- Model entities around the queries and relationships the application needs rather than blindly mirroring chain structures.
- Keep schema changes synchronized with mappings and code generation.
- Remember that GraphQL queries are constrained by this schema and by what indexing actually wrote into the store.
- Missing fields or wrong entity IDs usually indicate schema or mapping drift, not a query-language problem.

**Example**
Language: graphql
Description: A query-oriented entity for token transfers.

```graphql
type Transfer @entity {
  id: Bytes!
  token: Bytes!
  from: Bytes!
  to: Bytes!
  value: BigInt!
  transactionHash: Bytes!
}
```

#### mappings
**Kind**
workflow

**Summary**
Mappings are deterministic handlers that transform chain inputs into entity writes that populate the indexed store.

**Definition**
Language: typescript
Source: https://thegraph.com/docs/en/subgraphs/developing/creating/assemblyscript-mappings/

```ts
export function handleTransfer(event: TransferEvent): void {
  const id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new Transfer(id);
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.save();
}
```

**Guidance**
- Treat mappings as the bridge between chain events or calls and the entity store defined in `schema.graphql`.
- Debug missing or stale query results by checking mapping handler coverage, entity IDs, and field assignments before blaming the GraphQL layer.
- Keep mapping code aligned with generated types and ABI changes.
- If you change entity shape or contract bindings, rerun code generation before fixing type errors by hand.

**Example**
Language: typescript
Description: Save a transfer entity from an indexed event.

```ts
import { Transfer as TransferEvent } from "../generated/Token/Token";
import { Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  const entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.save();
}
```

#### generated types
**Kind**
other

**Summary**
Generated bindings and schema types are derived outputs that connect the manifest, ABIs, mappings, and entity schema.

**Definition**
Language: bash
Source: npx @graphprotocol/graph-cli@0.98.1 codegen --help

```bash
graph codegen [SUBGRAPH-MANIFEST] [-o <value>] [--skip-migrations] [-w]
```

**Guidance**
- Regenerate after schema or ABI changes; do not manually edit generated output as a long-term fix.
- Treat generated files as part of the build pipeline, not as the primary authoring surface.
- If mapping code and generated bindings disagree, first check whether codegen was rerun against the current manifest and schema.

**Example**
Language: bash
Description: Refresh generated bindings for the current subgraph project.

```bash
npx @graphprotocol/graph-cli@0.98.1 codegen
```

### Graph CLI Workflows
**Exports**
- graph init
- graph codegen
- graph build
- graph deploy

These commands define the ordinary subgraph developer workflow.

#### graph init
**Kind**
workflow

**Summary**
Scaffolds a new subgraph project from a protocol target, existing subgraph, example, or contract.

**Definition**
Language: bash
Source: npx @graphprotocol/graph-cli@0.98.1 init --help

```bash
graph init [ARGSUBGRAPHNAME] [ARGDIRECTORY] \
  [--protocol arweave|ethereum|near|cosmos|substreams|subgraph] \
  [--from-subgraph <value> | --from-example <value> | --from-contract <value>] \
  [--contract-name <value>] [--index-events] [--skip-install] [--skip-git] \
  [--start-block <value>] [--abi <value>] [--network <value>]
```

**Guidance**
- Use this to establish the initial manifest, schema, and mapping layout instead of hand-creating every file from scratch.
- Choose protocol and network carefully because they shape downstream manifest and mapping assumptions.
- When scaffolding from a contract, set ABI and start block deliberately to avoid indexing irrelevant history or the wrong contract surface.
- Treat the generated project as a starting point that still needs schema, mapping, and deployment review.

**Example**
Language: bash
Description: Scaffold an Ethereum contract-backed subgraph.

```bash
npx @graphprotocol/graph-cli@0.98.1 init my-token ./my-token \
  --protocol ethereum \
  --from-contract 0x1234567890abcdef1234567890abcdef12345678 \
  --contract-name Token \
  --network mainnet \
  --start-block 18000000
```

#### graph codegen
**Kind**
workflow

**Summary**
Generates AssemblyScript bindings and helper output from the current subgraph inputs.

**Definition**
Language: bash
Source: npx @graphprotocol/graph-cli@0.98.1 codegen --help

```bash
graph codegen [SUBGRAPH-MANIFEST] [-o <value>] [--skip-migrations] [-w]
```

**Guidance**
- Run this after schema or ABI changes and before treating type errors as mapping bugs.
- Use `--watch` only when the project workflow benefits from continuous regeneration.
- Keep codegen output disposable and reproducible.

**Example**
Language: bash
Description: Generate bindings into the default `generated/` directory.

```bash
npx @graphprotocol/graph-cli@0.98.1 codegen subgraph.yaml
```

#### graph build
**Kind**
workflow

**Summary**
Builds the subgraph into deployable artifacts and can optionally upload them to IPFS.

**Definition**
Language: bash
Source: npx @graphprotocol/graph-cli@0.98.1 build --help

```bash
graph build [SUBGRAPH-MANIFEST] [-i <value>] [-o <value>] \
  [-t wasm|wast] [--skip-migrations] [-w] [--network <value>] \
  [--network-file <value>]
```

**Guidance**
- Use build as the local gate before deployment; it catches schema, manifest, and codegen drift early.
- Keep `--network` and `--network-file` aligned with the environment you intend to deploy.
- Do not skip migrations casually if the build needs to reconcile manifest evolution.

**Example**
Language: bash
Description: Build the current subgraph for a specific configured network.

```bash
npx @graphprotocol/graph-cli@0.98.1 build subgraph.yaml --network mainnet
```

#### graph deploy
**Kind**
workflow

**Summary**
Deploys a subgraph to a Graph node or compatible target using the built artifacts and deployment credentials.

**Definition**
Language: bash
Source: npx @graphprotocol/graph-cli@0.98.1 deploy --help

```bash
graph deploy [SUBGRAPH-NAME] [SUBGRAPH-MANIFEST] \
  [--node <value>] [--deploy-key <value> | --access-token <value>] \
  [--version-label <value>] [--ipfs <value>] [--ipfs-hash <value>] \
  [--output-dir <value>] [--skip-migrations] [--watch] \
  [--network <value>] [--network-file <value>]
```

**Guidance**
- Treat deployment target, credentials, IPFS endpoint, and version label as environment-specific release inputs.
- Build first so deployment errors are not mixed with authoring-time schema or mapping mistakes.
- Prefer explicit node, network, and credential inputs in automation so deploy behavior is auditable.
- If query results look wrong after deploy, confirm the correct subgraph and version were deployed before rewriting the query or mapping logic.

**Example**
Language: bash
Description: Deploy a built subgraph with an explicit access token and version label.

```bash
npx @graphprotocol/graph-cli@0.98.1 deploy my-org/my-token subgraph.yaml \
  --access-token "$GRAPH_ACCESS_TOKEN" \
  --version-label v0.1.0
```

### Querying Indexed Data
**Exports**
- GraphQL query

This group covers application-facing reads against indexed entities.

#### GraphQL query
**Kind**
endpoint

**Summary**
Queries read indexed entities from a deployed subgraph according to the subgraph's schema and indexing state.

**Definition**
Language: graphql
Source: https://thegraph.com/docs/en/subgraphs/querying/from-an-application/

```graphql
query Transfers($first: Int!) {
  transfers(first: $first, orderBy: blockNumber, orderDirection: desc) {
    id
    from
    to
    value
    blockNumber
  }
}
```

**Guidance**
- Validate query assumptions against `schema.graphql` and indexing progress before treating missing data as a query-language issue.
- Keep The Graph queries focused on indexed entities and relationships rather than generic GraphQL server patterns.
- If an entity field is absent, check whether the subgraph schema exposes it and whether mappings actually populate it.
- When application code needs raw chain state, that is a separate boundary from querying the subgraph.

**Example**
Language: javascript
Description: Query a deployed subgraph from an application.

```js
const query = `
  query Transfers($first: Int!) {
    transfers(first: $first, orderBy: blockNumber, orderDirection: desc) {
      id
      from
      to
      value
    }
  }
`;

const response = await fetch("https://api.thegraph.com/subgraphs/name/my-org/my-token", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query, variables: { first: 10 } }),
});

const { data, errors } = await response.json();
if (errors) throw new Error(JSON.stringify(errors));
console.log(data.transfers);
```

### Indexer Operations
**Exports**
- graph indexer connect
- graph indexer rules get
- graph indexer rules set

These commands are operational indexer-management workflows, not the default developer path.

#### graph indexer connect
**Kind**
workflow

**Summary**
Connects the CLI to the Indexer Agent management API so subsequent indexer commands operate on the intended environment.

**Definition**
Language: bash
Source: npm:@graphprotocol/indexer-cli@0.25.6 README

```bash
graph indexer connect <url>
```

**Guidance**
- Run this before issuing rules, actions, or other management commands.
- Treat the management endpoint as sensitive operational infrastructure, not a public application endpoint.
- Keep this workflow separate from ordinary subgraph authoring and deployment guidance.

**Example**
Language: bash
Description: Connect the CLI to a locally forwarded Indexer Agent.

```bash
graph indexer connect http://localhost:8000/
```

#### graph indexer rules get
**Kind**
workflow

**Summary**
Reads current indexing rules so operators can inspect effective or target-specific configuration before changing behavior.

**Definition**
Language: bash
Source: npm:@graphprotocol/indexer-cli@0.25.6 README

```bash
graph indexer rules get all
```

**Guidance**
- Inspect existing rules before applying overrides so you understand effective behavior and precedence.
- Use this when debugging why an indexer is or is not indexing a deployment.
- Do not answer ordinary subgraph-developer tasks with this command unless the task is explicitly about operating an indexer.

**Example**
Language: bash
Description: Inspect current indexing rules.

```bash
graph indexer rules get all
```

#### graph indexer rules set
**Kind**
workflow

**Summary**
Sets global or target-specific indexing rule fields that affect allocation and indexing decisions.

**Definition**
Language: bash
Source: npm:@graphprotocol/indexer-cli@0.25.6 README

```bash
graph indexer rules set <target> <key> <value> [<key> <value> ...]
```

**Guidance**
- Prefer sensible broad defaults and use narrow overrides only where necessary.
- Document decision-basis changes because `rules`, `always`, `never`, and `offchain` have materially different operational meaning.
- Remember that more specific rules override broader ones; apply deployment-level overrides carefully.
- Treat this as operational indexer control, not as a substitute for fixing a bad subgraph design.

**Example**
Language: bash
Description: Apply a deployment-specific rule override.

```bash
graph indexer rules set 0xa4e311bfa7edabed7b31d93e0b3e751659669852ef46adbedd44dc2454db4bf3 \
  decisionBasis rules \
  minStake 999
```
