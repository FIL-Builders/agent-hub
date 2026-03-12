# Open Agent Spec v0.4.0

## Purpose

Specification for AgentHub "Expert Knowledge Packs".

A pack teaches an agent to use a given API, SDK, protocol, or developer tool at
senior-developer level.

Version 0.4.0 defines Expert Knowledge Packs as structured Markdown documents
that preserve the full pack model: pack metadata, grouped exports, symbol-level
reference entries, and optional library-wide sections for workflows,
troubleshooting, FAQ, and external resources.

## Document Contract

A v0.4.0 pack is one Markdown document with:

1. one document title
2. four required metadata sections
3. one required grouped reference section
4. zero or more optional library-wide sections

The required top-level sections are:

1. `# <Library Name>`
2. `## Snapshot`
3. `## Purpose`
4. `## Guiding Principles`
5. `## Design Notes`
6. `## API Groups`

The optional top-level sections are:

1. `## Common Workflows`
2. `## Troubleshooting Cheatsheet`
3. `## FAQ`
4. `## External Resources`

Additional top-level sections may appear after the required sections when they
add real value and do not obscure the core pack structure.

## Required Sections

### `# <Library Name>`

The title is the display name of the pack.

It should be the readable library or tool name, for example:

- `# React`
- `# AWS SDK / S3`
- `# OpenAI Responses API`

### `## Snapshot`

This section contains the pack's canonical metadata as Markdown bullets.

Required bullets:

- `Spec name: <id>`
- `Spec version: <version>`
- `Generated: <date>`
- `Library version: <version-range-or-release>`

Optional bullets:

- `Primary language: <language>`
- `Homepage: <url>`
- `Tags: <comma-separated-tags>`

#### Snapshot Field Rules

`Spec name`
- required
- unique kebab-or-slash identifier
- pattern: `^[a-z0-9]+([-/][a-z0-9]+)*$`
- examples: `react`, `aws-sdk/s3`, `openai/responses-api`

`Spec version`
- required
- pack semver
- pattern: `^0\.4\.[0-9]+$`

`Generated`
- required
- UTC date of pack generation
- pattern: `^\d{4}-\d{2}-\d{2}$`

`Library version`
- required
- upstream version range or release marker reflected by the pack
- examples: `^18.3.0`, `v2`, `2025-02 API`

`Primary language`
- optional
- primary runtime or authoring language
- examples: `javascript`, `typescript`, `python`, `solidity`

`Homepage`
- optional
- canonical docs or project URL

`Tags`
- optional
- compact discovery-oriented list

### `## Purpose`

This section is required.

It must be one concise paragraph that explains:

- what the pack enables an agent to do
- what class of tasks it supports
- what kind of decisions or actions it should improve

### `## Guiding Principles`

This section is required.

It must contain 3 to 10 bullets.

These bullets should express operational guidance for agent behavior, such as:

- safe defaults
- sequencing rules
- versioning expectations
- interoperability guidance
- common foot-guns

### `## Design Notes`

This section is required.

It should explain:

- the source material used
- how the pack is organized
- what was compressed or normalized
- any intentional coverage boundaries

## API Groups

`## API Groups` is required.

It contains one or more group subsections. Each group subsection represents a
logical cluster of exports, endpoints, components, or primitives.

### Group Structure

Each group must use this structure:

```md
### <Group Name>

**Exports:** exportA, exportB, exportC

<optional one-paragraph group intro>

#### exportA
...

#### exportB
...
```

#### Group Rules

- at least one group is required
- every group must have a name
- every group must declare an `Exports` line
- the `Exports` line must list one or more export names
- export names must be unique across the entire pack
- every export listed in `Exports` must have a matching `#### <Symbol Name>`
  subsection in the same group
- every symbol subsection under the group must correspond to an entry in that
  group's `Exports` line

### Symbol Structure

Each symbol subsection must use this structure and field order:

````md
#### <Symbol Name>
**Kind:** <kind>

**Summary**
<one-sentence summary>

**Definition**
Language: <definition-language>
Source: <optional source context>

```<definition-language>
<raw signature, interface, schema, request shape, response shape, or contract>
```

**Guidance**
- <guidance point>
- <guidance point>

**Example**
Language: <example-language>
Description: <optional description>

```<example-language>
<example code>
```

**Since:** <optional version>

**Deprecated**
- Reason: <reason>
- Replaced by: <replacement>
````

#### Symbol Field Rules

`<Symbol Name>`
- required
- must exactly match the export name declared in the containing group's
  `Exports` line

`Kind`
- required
- allowed values:
  - `function`
  - `hook`
  - `component`
  - `class`
  - `constant`
  - `type`
  - `interface`
  - `object`
  - `endpoint`
  - `config`
  - `workflow`
  - `other`

`Summary`
- required
- one sentence
- should state the symbol's role plainly

`Definition`
- required
- must include a code fence
- must include `Language: <lang>`
- may include `Source: <source context>`
- should preserve the authoritative contract as closely as possible
- valid content includes signatures, interfaces, request or response shapes,
  schema fragments, protocol messages, or config contracts

`Guidance`
- required
- at least 1 bullet
- should focus on best practices, sequencing, caveats, and integration behavior

`Example`
- required
- must include a code fence
- may include `Language: <lang>`
- may include `Description: <description>`
- if `Language` is omitted, consumers may assume `javascript`

`Since`
- optional
- the upstream library version in which the symbol became available

`Deprecated`
- optional
- when present, it should explain the reason and replacement path when known

## Optional Library-Wide Sections

### `## Common Workflows`

This section is optional.

It contains one or more workflow subsections:

```md
## Common Workflows

### <Workflow Title>
1. <step>
2. <step>
3. <step>
```

Workflow rules:

- each workflow must have a title
- each workflow must contain at least one ordered step
- additional explanatory text before or after the steps is allowed

### `## Troubleshooting Cheatsheet`

This section is optional.

It contains one or more troubleshooting entries:

```md
## Troubleshooting Cheatsheet

### <Symptom>
**Cause**
<cause>

**Fix**
<fix>
```

Troubleshooting rules:

- each entry must have a symptom heading
- each entry must include `Cause`
- each entry must include `Fix`

### `## FAQ`

This section is optional.

It contains one or more FAQ entries:

```md
## FAQ

### <Question>
<answer>
```

FAQ rules:

- each entry must use the question as the subsection title
- each entry must contain an answer paragraph or bullet list

### `## External Resources`

This section is optional.

It is a flat bullet list of labeled links:

```md
## External Resources
- Official docs: https://example.dev/docs
- API reference: https://example.dev/reference
```

Resource rules:

- every item must have a human-readable label
- every item must include a valid URL

## Validation Rules

A v0.4.0 pack is valid when all of the following are true:

1. it is exactly one Markdown document
2. the required top-level sections appear in the required order
3. `## Snapshot` contains all required metadata bullets
4. `Spec name` matches `^[a-z0-9]+([-/][a-z0-9]+)*$`
5. `Spec version` matches `^0\.4\.[0-9]+$`
6. `Generated` matches `^\d{4}-\d{2}-\d{2}$`
7. `## Guiding Principles` contains 3 to 10 bullets
8. `## API Groups` contains at least one group
9. every group contains an `Exports` line with at least one export
10. exports are unique across all groups
11. every export listed in a group has a matching symbol subsection in that
    group
12. every symbol subsection contains `Kind`, `Summary`, `Definition`,
    `Guidance`, and `Example`
13. every `Definition` block contains a code fence
14. every `Example` block contains a code fence

## Parser Guidance

Consumers should parse v0.4.0 packs by heading structure and labeled fields.

Recommended parser strategy:

1. read the title from the first `#` heading
2. locate required `##` sections by exact heading name
3. parse `## Snapshot` as a bullet list of labeled fields
4. locate groups under `## API Groups` by `###`
5. parse `**Exports:**` for the declared export list of each group
6. locate symbols within each group by `####`
7. parse labeled fields within each symbol subsection in order
8. parse optional library-wide sections only when present

## Minimal Skeleton

````md
# Example Library

## Snapshot
- Spec name: example-library
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^1.2.3
- Primary language: typescript
- Homepage: https://example.dev
- Tags: example, sdk, api

## Purpose
This pack teaches an agent to use Example Library correctly for common
integration, extension, and debugging tasks.

## Guiding Principles
- Reuse configured clients within a single execution context.
- Validate request payloads before invoking write operations.
- Prefer explicit versioned endpoints when the platform offers them.

## Design Notes
- Sources: official docs, TypeScript declarations, and examples.
- Grouped by client creation, resources, and workflows.

## API Groups

### Client Creation
**Exports:** createClient

Creates and configures client instances.

#### createClient
**Kind:** function

**Summary**
Creates a configured client instance.

**Definition**
Language: typescript
Source: src/client.ts

```ts
function createClient(options: ClientOptions): Client;
```

**Guidance**
- Reuse one client per configuration scope.
- Validate credentials before first request.

**Example**
Language: typescript

```ts
import { createClient } from "example-library";

const client = createClient({ apiKey: process.env.EXAMPLE_API_KEY! });
```

## Common Workflows

### First Authenticated Request
1. Create a client with valid credentials.
2. Call a read endpoint.
3. Inspect the returned resource shape before chaining writes.

## Troubleshooting Cheatsheet

### Authentication fails
**Cause**
Credentials are invalid or scoped incorrectly.

**Fix**
Rotate the credential and verify the expected environment value is loaded.

## FAQ

### Should I recreate the client for every request?
No. Reuse the client unless configuration changes.

## External Resources
- Official docs: https://example.dev/docs
````

## Version Notes

v0.4.0 is the first Markdown-native edition of the Open Agent Spec.
