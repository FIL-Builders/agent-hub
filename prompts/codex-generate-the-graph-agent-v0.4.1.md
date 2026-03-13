==============================================================
AGENTHUB - THE GRAPH 0.4.1 GENERATION BRIEF
Goal: Generate `agents/the-graph/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current The Graph sources.
==============================================================

### 1 - Target Output

Write:

- `agents/the-graph/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/the-graph/0.3.0.md`
- `parse/the-graph-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
The Graph sources, including:

- official The Graph docs pages for subgraphs, querying, indexing, and CLI usage
- `npm:@graphprotocol/graph-cli@0.98.1` package contents when relevant
- `npm:@graphprotocol/indexer-cli@0.25.6` package contents when relevant
- official release or compatibility notes when needed
- the relevant The Graph repositories at version-matched tags or commits when
  needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: the-graph`
- `Spec version: 0.4.0`
- `Library version: current-docs + graph-cli^0.98.1 + indexer-cli^0.25.6`
- `Primary language: javascript`
- `Homepage: https://thegraph.com/docs`

Lock the target to the current The Graph docs surface, with `graph-cli@0.98.1`
and `indexer-cli@0.25.6` as the command-line anchors.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: narrow indexer-management and CLI focus
- current target: broader The Graph surface centered on subgraph design,
  indexing, querying, and operational boundaries

You must identify and avoid stale assumptions, including any assumptions about:

- The Graph meaning only indexer-management and Agora workflows
- query examples being sufficient without subgraph schema and mapping design
- subgraph authoring, deployment, querying, and indexer operations being one
  undifferentiated workflow
- generic GraphQL intuition being sufficient without The Graph-specific
  indexing, schema, and deployment model

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for The Graph as a developer platform, but it must keep product
and workflow boundaries explicit.

You must distinguish:

- subgraph authoring and manifest/schema/mapping work
- querying indexed data
- graph-cli deployment and local development workflows
- indexer-management and operational indexer workflows
- generic GraphQL, generic indexing, or generic blockchain-tooling behavior

Specific rules:

- do not collapse graph-cli and indexer-cli into one tool model
- do not treat indexer-management operations as the default path for ordinary
  subgraph developers
- do not present generic GraphQL advice as sufficient for The Graph data model
  and indexing semantics

If a workflow is operationally important but belongs to a different product
surface, call it out as a boundary rather than treating it as the same API
group.

### 7 - Coverage Expectations

The generated file should cover the current The Graph surface needed for real
project work, including:

- subgraph schema design
- manifest and data-source authoring
- mapping behavior and indexing model where source support is strong
- query patterns and GraphQL-facing behavior
- graph-cli deployment and local workflows
- indexer operational boundaries where source support is strong
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/the-graph/0.3.0.md` only to audit coverage and preserve strong
indexer-management insights where they remain valid. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required The Graph Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish schema design, manifest authoring, mappings, and querying as
  separate concerns
- explain graph-cli as the ordinary developer workflow and indexer tooling as
  an operational workflow boundary
- keep subgraph indexing behavior distinct from generic GraphQL request/response
  intuition
- preserve high-value guidance around deployment IDs, schema/mapping alignment,
  query patterns, and operational rule precedence where relevant

### 10 - Required The Graph Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that indexer-management operations are the default workflow for ordinary
  subgraph development
- that generic GraphQL knowledge fully captures The Graph-specific indexing and
  deployment semantics
- that graph-cli and indexer-cli are interchangeable

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   author and deploy a subgraph with schema, manifest, and mapping alignment
2. troubleshooting:
   debug a query mismatch, indexing issue, or deployment/config problem
3. design or tradeoff:
   choose between subgraph design strategies or operational indexing rules
4. version-confusion:
   prevent an answer that overfocuses on indexer ops when the task is ordinary
   subgraph development, or vice versa

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/the-graph/0.4.0.md`
3. fix any reported structural errors
4. confirm subgraph, query, CLI, and indexer boundaries are explicit
5. confirm the broader The Graph scope is reflected instead of only the legacy
   indexer-management focus
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
