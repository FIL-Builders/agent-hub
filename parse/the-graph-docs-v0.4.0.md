# The Graph Documentation Pack

## Snapshot
- library name: the-graph
- version or version range: current-docs + graph-cli^0.98.1 + indexer-cli^0.25.6
- primary language: javascript
- homepage or canonical docs URL: https://thegraph.com/docs
- short description: The Graph is a developer platform for authoring subgraphs, indexing blockchain data, querying indexed entities over GraphQL, and operating indexer-specific management workflows.
- source set summary: official The Graph docs pages for subgraph authoring, querying, and indexing; `npx @graphprotocol/graph-cli@0.98.1` command help; `npm:@graphprotocol/indexer-cli@0.25.6` README; and the existing AgentHub The Graph pack for coverage audit only

## What This Library Is For
The Graph is used to describe how blockchain data should be indexed, generate typed mapping scaffolding, build and deploy subgraphs, and query the indexed entity store. Its operational surface also includes indexer-management workflows for rule configuration, actions, allocations, and provision management. This pack focuses on the platform boundaries an agent most often needs when working on subgraph projects or operational The Graph tooling.

## Installation And Setup
- install commands:
  - `npm install -D @graphprotocol/graph-cli`
  - `npm install -D @graphprotocol/indexer-cli`
- environment prerequisites:
  - Node.js for CLI workflows
  - an IPFS endpoint and Graph node or Graph Network deployment target for publish flows
  - blockchain RPC access when scaffolding from or testing against live contracts
- configuration prerequisites:
  - subgraph projects need a manifest, schema, mappings, and generated types that stay aligned
  - deployment workflows need a deploy key or access token plus the correct target endpoint
  - indexer workflows require access to an Indexer Agent management API
- minimum setup example:

```sh
npx @graphprotocol/graph-cli@0.98.1 init my-subgraph
cd my-subgraph
npx @graphprotocol/graph-cli@0.98.1 codegen
npx @graphprotocol/graph-cli@0.98.1 build
```

## Core Concepts

### Subgraph authoring is a document set, not a single file
- `subgraph.yaml` defines data sources, templates, and mapping entrypoints.
- `schema.graphql` defines the entity model that mappings write and clients query.
- mappings transform blockchain events or calls into entity writes.
- generated types sit between the manifest and mapping code and must be refreshed when schema or ABI inputs change.

### Querying reflects indexed entities, not raw chain state
- GraphQL queries execute over the indexed store.
- Results depend on schema design, indexing progress, and the manifest or mapping logic that produced the entities.
- Generic GraphQL intuition is not enough; query behavior is constrained by what the subgraph indexed.

### graph-cli is the ordinary developer workflow
- `graph init`, `graph codegen`, `graph build`, and `graph deploy` are the normal authoring and deployment path.
- Indexer commands are operational workflows layered on top of indexer infrastructure, not the default path for ordinary subgraph development.

### Indexer operations are a separate product boundary
- `graph indexer ...` controls management APIs, rules, actions, provision, and disputes.
- These workflows assume an indexer stack and are not required for routine subgraph authoring or querying tasks.

## Version Delta Audit
- prior pack target: indexer-management and Agora-heavy workflows
- current target: broader The Graph platform surface covering subgraph authoring, querying, graph-cli workflows, and indexer operational boundaries
- major shift:
  - ordinary subgraph developers should start from manifest, schema, mappings, code generation, build, and deploy
  - indexer-management remains important but should not dominate answers unless the task is clearly operational
- stale assumptions to avoid:
  - that The Graph equals indexer-management only
  - that generic GraphQL advice is sufficient without subgraph indexing context
  - that graph-cli and indexer-cli are interchangeable tools

## Decision Rules
- Use `graph init` to scaffold a new or contract-based subgraph, then treat the generated manifest, schema, and mappings as the project baseline.
- Use `graph codegen` whenever the schema, manifest ABI references, or contract bindings change.
- Use `graph build` before `graph deploy` so build output and manifest migrations are caught locally.
- Query the subgraph's GraphQL API when the task is data retrieval from indexed entities; do not answer with direct RPC reads unless the task explicitly asks for raw chain access.
- Use indexer-management commands only when the task is about operating an indexer or changing indexing rules, allocations, or provision state.

## Ecosystem Boundaries

### Core The Graph platform surface
- subgraph manifest authoring
- entity schema design
- mapping logic and generated bindings
- graph-cli workflows for init, codegen, build, and deploy
- GraphQL querying against indexed data

### Operational indexer surface
- `graph indexer connect`
- indexing rules and precedence
- action queue management
- allocations, disputes, and provision management

### Out-of-scope or separate surfaces
- generic GraphQL server design
- blockchain RPC libraries such as ethers or viem
- graph-node internals beyond the docs-supported operational boundary
- network economics details unless the task is explicitly about indexer operations

## Preconditions And Invariants
- `subgraph.yaml`, `schema.graphql`, ABIs, and mapping code must stay aligned or build and runtime indexing will fail.
- Generated types are derived artifacts; regenerate them after ABI or schema changes instead of patching them by hand.
- Query answers are only as complete as the indexed entity model and indexing progress.
- Deployment targets, access credentials, IPFS endpoints, and network settings must match the intended environment.
- Indexer rule commands assume a reachable Indexer Agent management API and follow precedence from global to more specific scopes.

## Public Surface Area

### Subgraph authoring

#### `subgraph.yaml`
- role: manifest file
- purpose: declares data sources, templates, networks, ABIs, mapping entrypoints, and indexing behavior
- key guidance:
  - treat it as the authoritative configuration for what gets indexed
  - keep ABI references and mapping handler names aligned with on-disk files
  - update it deliberately when adding contracts, networks, or templates
- authoritative sources:
  - The Graph docs: subgraph manifest page
  - `graph init --help`

#### `schema.graphql`
- role: entity schema
- purpose: defines the entity store queried by downstream GraphQL clients
- key guidance:
  - design entities around indexed access patterns rather than mirroring chain objects blindly
  - keep schema changes synchronized with mappings and codegen
  - query behavior follows this schema, not arbitrary GraphQL server semantics
- authoritative sources:
  - The Graph docs: GraphQL schema page

#### mappings
- role: indexing transformation logic
- purpose: converts chain inputs into entity writes
- key guidance:
  - treat mappings as deterministic index-time transforms
  - keep generated bindings and schema types fresh
  - debug mismatches by checking event handlers, entity IDs, and field updates before blaming the query layer
- authoritative sources:
  - The Graph docs: mappings page
  - `graph codegen --help`

### graph-cli workflow

#### `graph init`
- role: scaffold command
- purpose: creates a new subgraph project or scaffolds from contract, subgraph, or example inputs
- key guidance:
  - choose protocol and network correctly up front
  - when using `--from-contract`, provide ABI and start block carefully to limit bad indexing scope
- authoritative sources:
  - `npx @graphprotocol/graph-cli@0.98.1 init --help`

#### `graph codegen`
- role: generated bindings command
- purpose: generates AssemblyScript types and helpers for the subgraph project
- key guidance:
  - rerun after ABI or schema changes
  - generated output is build input, not hand-authored source
- authoritative sources:
  - `npx @graphprotocol/graph-cli@0.98.1 codegen --help`

#### `graph build`
- role: local build command
- purpose: compiles the subgraph and prepares build artifacts, with optional IPFS upload
- key guidance:
  - use before deployment to catch schema or manifest issues early
  - keep network-file settings aligned with the environment you actually deploy to
- authoritative sources:
  - `npx @graphprotocol/graph-cli@0.98.1 build --help`

#### `graph deploy`
- role: deployment command
- purpose: deploys a built subgraph to a Graph node or compatible target
- key guidance:
  - deploy credentials and target node choice are environment-sensitive
  - version labels and network settings should be treated as release metadata, not afterthoughts
- authoritative sources:
  - `npx @graphprotocol/graph-cli@0.98.1 deploy --help`

### Querying

#### GraphQL query against a deployed subgraph
- role: data access operation
- purpose: retrieves indexed entities from the subgraph store
- key guidance:
  - validate query assumptions against the schema and indexing status
  - if results are missing or stale, inspect the subgraph design and indexing pipeline before rewriting the query
- authoritative sources:
  - The Graph docs: querying from an application

### Indexer operations

#### `graph indexer connect`
- role: operational command
- purpose: points the CLI at the Indexer Agent management API
- key guidance:
  - required before rules, actions, and other indexer-management commands
  - do not present this as part of the ordinary subgraph authoring path
- authoritative sources:
  - `npm:@graphprotocol/indexer-cli@0.25.6` README

#### `graph indexer rules get`
- role: operational command
- purpose: inspects effective indexing rules
- key guidance:
  - use to confirm precedence-resolved behavior before applying changes
  - treat rule scope and specificity as operationally significant
- authoritative sources:
  - `npm:@graphprotocol/indexer-cli@0.25.6` README

#### `graph indexer rules set`
- role: operational command
- purpose: changes indexing rule fields for global or target-specific scopes
- key guidance:
  - use narrow overrides only when global defaults are insufficient
  - document decision-basis overrides because they materially change allocation behavior
- authoritative sources:
  - `npm:@graphprotocol/indexer-cli@0.25.6` README

## Common Workflows

### Scaffold and deploy a new subgraph
1. Run `graph init` with the correct protocol and network.
2. Inspect and refine `subgraph.yaml`, `schema.graphql`, and mapping handlers.
3. Run `graph codegen` after schema or ABI changes.
4. Run `graph build` to catch manifest, schema, or codegen drift.
5. Run `graph deploy` with the correct node, IPFS endpoint, credentials, and optional version label.

### Debug a query that returns missing or unexpected data
1. Check whether the entity and fields exist in `schema.graphql`.
2. Inspect the mapping logic and entity ID construction.
3. Confirm that the relevant data source and handlers are present in `subgraph.yaml`.
4. Regenerate types and rebuild if the schema or ABI changed.
5. Only after indexing design checks pass, adjust the GraphQL query shape.

### Change indexer behavior for a deployment
1. Connect the CLI to the Indexer Agent management API.
2. Inspect current rules with `graph indexer rules get`.
3. Apply a narrow `rules set`, `start`, `stop`, or `offchain` change.
4. Review action or allocation consequences before treating the change as complete.

## Common Confusions
- graph-cli vs indexer-cli:
  - graph-cli is the ordinary subgraph authoring and deployment tool
  - indexer-cli is an operational extension for indexer-management workflows
- GraphQL query vs indexing behavior:
  - a query cannot return entities that the subgraph never indexed
- schema vs mapping bug:
  - missing query data can come from a schema design mismatch, mapping logic bug, or indexing progress issue
- generated types vs handwritten code:
  - generated artifacts should be regenerated, not manually edited

## Deprecated And Compatibility Surface
- The old AgentHub The Graph pack overfocused on indexer-management and Agora as if they were the entire platform surface.
- `graph indexer` commands remain important but should be treated as an operational boundary rather than the default developer path.
- The docs and CLI show protocol breadth beyond Ethereum-only contract indexing, but this pack centers on the common subgraph-developer workflow and operational boundaries with strongest source support.

## Pitfalls And Troubleshooting
- schema, manifest, and mapping drift is the most common source of broken builds and incorrect queries
- deploying with the wrong node, access token, or network-file produces environment-specific failures that look like application bugs
- using direct GraphQL intuition without checking indexing state leads to misleading debugging
- treating rule overrides as harmless can change allocation decisions unexpectedly because specificity and decision basis matter
- ephemeral package execution may not expose `graph indexer` commands the same way a fully installed graph-cli plus indexer-cli setup does; verify local installation shape before writing automation around it

## Best Practices
- answer ordinary The Graph tasks from the subgraph lifecycle first: manifest, schema, mappings, codegen, build, deploy, query
- keep operational indexer content available but secondary unless the task is clearly about running an indexer
- prefer narrow, cited command definitions over paraphrased folklore
- carry explicit source and boundary notes into the final agent pack so future revisions do not collapse the product surfaces again

## References
- `https://thegraph.com/docs/en/subgraphs/developing/creating/install-the-cli/`
- `https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/`
- `https://thegraph.com/docs/en/subgraphs/developing/creating/graphql-schema/`
- `https://thegraph.com/docs/en/subgraphs/querying/from-an-application/`
- `https://thegraph.com/docs/en/indexing/overview/`
- `npm:@graphprotocol/graph-cli@0.98.1`
- `npm:@graphprotocol/indexer-cli@0.25.6`

## Open Questions
- The official docs site is authoritative for current subgraph workflows, but some individual page scraping paths are awkward in this environment; cited routes are still the right source anchors.
- The `indexer-cli` README documents `graph indexer ...` commands, but ephemeral `npx` execution did not expose them directly in this environment. The pack should treat the README as the operational contract and note local installation-shape verification where automation depends on it.
