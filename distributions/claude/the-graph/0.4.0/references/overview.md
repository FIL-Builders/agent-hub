# The Graph Overview

## Snapshot

- Spec name: the-graph
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + graph-cli^0.98.1 + indexer-cli^0.25.6
- Primary language: javascript
- Homepage: https://thegraph.com/docs
- Source set: official The Graph docs for subgraph authoring, querying, and indexing; `npx @graphprotocol/graph-cli@0.98.1` command help; `npm:@graphprotocol/indexer-cli@0.25.6` README; parse/the-graph-docs-v0.4.0.md as the intermediate documentation pack; and agents/the-graph/0.3.0.md for coverage audit only

**Tags**
- the-graph
- subgraphs
- graphql
- indexing
- cli

## Purpose

This pack teaches an agent to work on The Graph as a developer platform: authoring subgraphs, keeping manifest, schema, mappings, and generated artifacts aligned, deploying with graph-cli, querying indexed entities correctly, and handling indexer-management operations without collapsing them into the default developer workflow.

## Guiding Principles

- Treat subgraph authoring, query usage, graph-cli workflows, and indexer operations as separate surfaces with explicit boundaries.
- Start ordinary developer tasks from `subgraph.yaml`, `schema.graphql`, mappings, code generation, build, and deploy.
- Treat GraphQL queries as reads against indexed entities, not as direct blockchain access.
- Keep generated types derived from source inputs; regenerate after schema or ABI changes instead of patching generated output manually.
- Use graph-cli as the standard authoring path and reserve indexer-cli guidance for operational indexer tasks.
- Preserve rule-precedence and action-queue insights from the old pack where they still hold, but do not let indexer-management dominate the whole platform model.
- Prefer official docs and version-matched CLI contracts over ecosystem folklore.

## Boundary Notes

- The main delta from `agents/the-graph/0.3.0.md` is scope: the old pack captured valuable indexer-management guidance but underrepresented ordinary subgraph design, build, deploy, and query work.
- Contract sources for CLI workflows come from `npx @graphprotocol/graph-cli@0.98.1 --help` and command-specific help for `init`, `codegen`, `build`, and `deploy`.
- Operational indexer command contracts come from `npm:@graphprotocol/indexer-cli@0.25.6` README because ephemeral `npx` execution in this environment did not expose `graph indexer` commands reliably.
- Guidance sources come from current The Graph docs routes for installing the CLI, subgraph manifest design, GraphQL schema design, querying from an application, and indexing overview.
- The pack keeps graph-cli and indexer-cli separate on purpose: graph-cli is the ordinary developer workflow, while indexer-cli is an operational extension for indexer-management.

## FAQ

### When should an answer focus on graph-cli instead of indexer-cli?
Use graph-cli for ordinary subgraph authoring, code generation, build, deploy, and publish work. Use indexer-cli only when the task is explicitly about operating an indexer-management environment.

### Why can a valid GraphQL query still return the wrong result?
Because queries read the indexed entity store. If the manifest, schema, mappings, or indexing progress are wrong, the query can be syntactically valid and still return missing or misleading data.

### Is The Graph just another GraphQL server?
No. The query layer is GraphQL-facing, but the data model and result set are determined by subgraph schema design and indexing behavior.

## External Resources

- Install the Graph CLI: https://thegraph.com/docs/en/subgraphs/developing/creating/install-the-cli/
- Subgraph manifest reference: https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/
- GraphQL schema reference: https://thegraph.com/docs/en/subgraphs/developing/creating/graphql-schema/
- Querying from an application: https://thegraph.com/docs/en/subgraphs/querying/from-an-application/
- Indexing overview: https://thegraph.com/docs/en/indexing/overview/
