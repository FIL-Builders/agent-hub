---
name: the-graph
description: Use for The Graph tasks. Helps with work on The Graph as a developer platform: authoring subgraphs, keeping manifest, schema, mappings, and generated artifacts aligned, deploying with graph-cli, querying indexed entities correctly, and handling indexer-management operations without collapsing them into the default developer workflow.
---

# The Graph

Use this skill when the task depends on The Graph-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to work on The Graph as a developer platform: authoring subgraphs, keeping manifest, schema, mappings, and generated artifacts aligned, deploying with graph-cli, querying indexed entities correctly, and handling indexer-management operations without collapsing them into the default developer workflow.

## When to use this skill

- The Graph setup and implementation work
- The Graph API usage and configuration decisions
- The Graph-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat subgraph authoring, query usage, graph-cli workflows, and indexer operations as separate surfaces with explicit boundaries.
- Start ordinary developer tasks from `subgraph.yaml`, `schema.graphql`, mappings, code generation, build, and deploy.
- Treat GraphQL queries as reads against indexed entities, not as direct blockchain access.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
