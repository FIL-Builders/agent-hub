# Open Agent Spec v0.4.0

## Purpose

Open Agent Spec v0.4.0 defines a Markdown-native format for AgentHub knowledge
packs.

The goal is to make each pack read like authored technical documentation rather
than serialized data. A valid v0.4.0 pack should be:

- easy for humans to read
- easy for LLMs to retrieve from by section
- structurally predictable
- free of YAML frontmatter and YAML-shaped bodies

## Core Principle

The pack should look like a document that was designed in Markdown from the
start.

It should not look like:

- a schema object copied into text
- YAML keys rendered line by line
- frontmatter plus a serialized payload

## Required Document Shape

A v0.4.0 knowledge pack is one Markdown document with the following top-level
sections, in this exact order:

1. `# <Library Name>`
2. `## Snapshot`
3. `## Purpose`
4. `## Guiding Principles`
5. `## Design Notes`
6. `## Quick Start`
7. `## Core Concepts`
8. `## API Groups`
9. `## Common Workflows`
10. `## Troubleshooting`
11. `## FAQ`
12. `## External Resources`

Additional sections may appear after `## External Resources` only when they add
clear value and do not break the predictability of the document.

## Section Requirements

### `# <Library Name>`

The document title is the canonical project or library name.

### `## Snapshot`

This section replaces YAML metadata.

It must include these fields as Markdown bullets:

- `Spec version`
- `Library version`
- `Primary language`
- `Homepage`
- `Tags`

It may also include:

- `Generated`
- `Status`
- `Package`

### `## Purpose`

This section must be a short paragraph explaining:

- what the pack is for
- what class of tasks it should help with
- how an LLM should use it

### `## Guiding Principles`

This section must contain 3 to 10 bullets.

The bullets should be operational guidance, not marketing language. They should
help a model choose safe and idiomatic usage patterns.

### `## Design Notes`

This section should explain:

- the source material used
- how the pack is organized
- any intentional omissions or coverage boundaries

### `## Quick Start`

This section should make the first successful use path obvious.

It should include:

- setup or installation
- minimal configuration
- one short example

### `## Core Concepts`

This section contains concept subsections:

### `<Concept Name>`

Each concept subsection should explain:

- what the concept is
- why it matters
- how it affects usage decisions
- common confusion or failure modes

### `## API Groups`

This is the main reference section.

It contains group subsections:

### `<Group Name>`

Each group should contain a short intro sentence and then one subsection per
important symbol, endpoint, component, type, or primitive:

#### `<Symbol Name>`

Each symbol subsection must include these subheadings in this exact order:

1. `**Kind:**`
2. `**Summary**`
3. `**Definition**`
4. `**Guidance**`
5. `**Example**`
6. `**Related**`

It may also include:

- `**Since**`
- `**Deprecated**`

#### Symbol Content Rules

**Kind**
- one of: `function`, `hook`, `component`, `class`, `constant`, `type`,
  `interface`, `object`, `endpoint`, `config`, `workflow`, `other`

**Summary**
- one sentence only

**Definition**
- use a fenced code block when the source provides a signature, contract, type,
  schema, request shape, or response shape
- stay as close to source truth as possible
- light condensation is allowed when it removes noise without changing meaning

**Guidance**
- at least 2 bullets
- focus on sequencing, caveats, interoperability, performance, and safe usage

**Example**
- use a fenced code block
- should be runnable or nearly runnable
- should show the intended usage pattern, not just syntax

**Related**
- list adjacent symbols, concepts, or workflows

**Since**
- include only when discoverable from source material

**Deprecated**
- include only when applicable
- explain replacement path when known

### `## Common Workflows`

This section contains task-oriented workflows:

### `<Workflow Name>`

Each workflow should include:

- when to use it
- prerequisites
- ordered steps
- one example
- likely failure points or edge cases

### `## Troubleshooting`

This section contains issue-oriented subsections:

### `<Problem Or Symptom>`

Each item should include:

- cause
- diagnosis
- fix

### `## FAQ`

This section contains question subsections:

### `<Question>`

Answers should be concise and practical.

### `## External Resources`

This section is a flat Markdown bullet list of:

- label + URL

Prioritize official documentation and canonical references.

## Authoring Rules

- Use real Markdown structure, not serialized keys.
- Use headings, bullets, short paragraphs, and fenced code blocks.
- Prefer exact technical definitions over paraphrased summaries when accuracy
  matters.
- Keep examples minimal but useful.
- Mark uncertain claims explicitly.
- Do not invent APIs, fields, or workflows.
- Avoid repeating the same idea across multiple sections unless each repetition
  adds distinct value.

## Validation Rules

A v0.4.0 pack is valid when all of the following are true:

1. It is exactly one Markdown document.
2. It contains no YAML frontmatter.
3. It does not use top-level schema keys such as `meta:`, `groups:`,
   `symbols:`, `guidance:`, or `example:`.
4. The required top-level sections appear in the required order.
5. `## Guiding Principles` contains 3 to 10 bullets.
6. Every important symbol documented under `## API Groups` includes `Kind`,
   `Summary`, `Definition`, `Guidance`, `Example`, and `Related`.
7. The document reads like authored documentation, not exported data.

## Parsing Guidance

Consumers should parse v0.4.0 packs by heading structure, not by indentation or
schema keys.

Recommended parser strategy:

1. read the document title from the first `#` heading
2. locate required `##` sections by exact heading name
3. locate groups under `## API Groups` by `###`
4. locate symbols within each group by `####`
5. locate symbol fields by bold labels such as `**Kind:**`, `**Summary**`,
   `**Definition**`, and `**Example**`

## Minimal Skeleton

````md
# Example Library

## Snapshot
- Spec version: 0.4.0
- Library version: ^1.2.3
- Primary language: typescript
- Homepage: https://example.dev
- Tags: example, sdk, api

## Purpose
This pack helps an LLM use Example Library correctly for common integration and
extension tasks.

## Guiding Principles
- Prefer authenticated clients over anonymous defaults.
- Validate request payloads before sending them.
- Use retry logic only for idempotent operations.

## Design Notes
- Sources: official docs, TypeScript declarations, examples.
- Grouped by authentication, clients, and resources.

## Quick Start
Install the package, create a client, and make a minimal request.

```ts
import { createClient } from "example-library";

const client = createClient({ apiKey: process.env.EXAMPLE_API_KEY! });
```

## Core Concepts

### Client Lifecycle
- The client owns configuration, authentication, and request behavior.

## API Groups

### Client Creation
Create and configure client instances.

#### createClient
**Kind:** function

**Summary**
Creates a configured client instance.

**Definition**
```ts
function createClient(options: ClientOptions): Client;
```

**Guidance**
- Reuse one client per configuration scope.
- Validate credentials before first request.

**Example**
```ts
const client = createClient({ apiKey: process.env.EXAMPLE_API_KEY! });
```

**Related**
- Client Lifecycle

## Common Workflows

### First Authenticated Request
- Create a client.
- Call a read endpoint.

## Troubleshooting

### Authentication Fails
- Cause: invalid credentials
- Diagnosis: inspect API error response
- Fix: rotate or correct the API key

## FAQ

### Should I recreate the client for every request?
No. Reuse clients unless configuration changes.

## External Resources
- Official docs: https://example.dev/docs
````

## Version Notes

v0.4.0 is the first Markdown-native version of the spec.
