==============================================================
AGENTHUB - DOCUMENTATION PROMPT (v0.4.0)
Goal: Produce a complete Markdown-native documentation pack from
      authoritative source material.
==============================================================

### 1 - Role
You are an expert technical writer, API analyst, and senior developer.
Your job is to turn raw source material into a Markdown-native documentation
pack that another agent can use as source truth when drafting an AgentHub
knowledge pack.

### 2 - Objective
Return ONE Markdown document only.

The document must be:
- Markdown-native
- self-contained
- source-grounded
- optimized for later transformation into an AgentHub v0.4.0 knowledge pack
- optimized for downstream task performance, not just reference completeness

### 3 - Inputs (replace placeholders before running)
<LIBRARY_NAME>            <- canonical project or library name
<DOCUMENTATION_SOURCES>   <- starting set of source material, which may include
                             local files, docs bundles, README files, API docs,
                             type definitions, examples, tests, and release notes
<VERSION_CONTEXT>         <- library or API version when known

### 4 - Workflow

1. Lock the target version before extraction.
   - If <VERSION_CONTEXT> is explicit, use it.
   - If it is ambiguous, infer the best supported target from the task and mark
     any uncertainty as `Needs verification`.
2. Acquire authoritative source material for that target version.
   Preferred source order:
   - version-pinned upstream source code or type declarations
   - official docs for the same version
   - official examples, release notes, migration notes, or RFCs
   - local bundles and prior generated packs only as accelerators or coverage audits
3. Read the authoritative material and identify the public surface area:
   - modules
   - namespaces
   - exported symbols
   - endpoints
   - configuration keys
   - workflows
   - common mistakes
4. Separate source truth from interpretation:
   - "Definition" content should stay close to the source
   - "Guidance" should contain expert recommendations, caveats, decision rules,
     failure modes, and usage advice
5. Extract operational knowledge explicitly:
   - when to use a primitive
   - when not to use it
   - what it is commonly confused with
   - what must be true before using it
   - what usually breaks in real implementations
6. Build a small challenge set mentally while reading:
   - one implementation task
   - one debugging or troubleshooting task
   - one design or tradeoff task
   Use that challenge set to decide what guidance is important enough to keep.
7. Organize the output as a Markdown document with predictable headings.
8. Prefer concise, high-signal writing over raw dumping of docs.

### 5 - Required Output Structure

Use these sections in this exact order.

# <LIBRARY_NAME> Documentation Pack

## Snapshot
- library name
- version or version range
- primary language
- homepage or canonical docs URL
- short description
- source set summary

## What This Library Is For
- one short overview paragraph
- major use cases
- scope and boundaries

## Installation And Setup
- install commands
- environment prerequisites
- configuration prerequisites
- minimum setup example

## Core Concepts
For each major concept:
### <Concept Name>
- explanation
- why it matters
- common confusion to avoid

## Decision Rules
- "Use X when..."
- "Avoid Y when..."
- "Choose A over B if..."
- keep these short and operational

## Preconditions And Invariants
- what must already be true before important operations
- sequencing assumptions
- environment or version requirements

## Public Surface Area
Break the library into logical groups.

### <Group Name>
For each important symbol, endpoint, type, or primitive:

#### <Symbol Name>
**Kind:** function | class | hook | endpoint | interface | component | config | workflow | other

**Summary:** one sentence

**Definition**
Use a fenced code block when the source has a signature, type, schema, request
shape, response shape, or protocol contract.

**Guidance**
- at least 2 actionable bullets
- include constraints, performance notes, sequencing, or interoperability details
- include at least one decision rule or anti-pattern when relevant
- include likely failure cases when relevant

**Example**
Use a fenced code block with a runnable or nearly runnable example.

**Source Notes**
- where this came from
- exact version or upstream reference when known
- whether it is exact, condensed, or inferred

## Common Workflows
Document high-value end-to-end tasks.

### <Workflow Name>
- when to use it
- ordered steps
- example
- common failure points

## Common Confusions
- symbols that are easy to confuse
- version-specific traps
- things that look equivalent but are not

## Pitfalls And Troubleshooting

### <Problem Or Symptom>
- likely cause
- how to verify
- fix

## Best Practices
- short, actionable bullets only

## References
- official docs
- source files
- specs
- release notes
- upstream refs, tags, or package versions used

## Open Questions
- unresolved items that need verification

### 6 - Writing Rules
- Use headings, bullets, short paragraphs, and fenced code blocks.
- Keep the structure stable and predictable.
- Prefer exact definitions when available.
- Mark uncertain claims as "Needs verification".
- For gaps in source coverage, mark the point as "Needs verification".
- Use only APIs, fields, and workflows grounded in the source material.
- Prefer version-pinned upstream sources over generic latest docs.
- Use prior generated packs only to audit coverage, not as authoritative contract sources.
- Preserve operational knowledge that helps an agent choose correctly under task pressure.
- Prefer guidance that changes implementation behavior over generic descriptive prose.
- If two symbols are commonly confused, name the distinction explicitly.
- If a workflow often fails for a specific reason, document that failure mode directly.

### 7 - Quality Checks
Before you emit the final document, verify:
- the output is a single Markdown document
- every important public primitive has summary, definition, guidance, and example
- workflows are task-oriented end-to-end guides
- decision rules are present for high-value primitives and workflows
- common confusions and failure modes are surfaced, not implied
- open questions are clearly separated from verified facts
- the target version is stated clearly
- the references make it possible to audit the source set later
- the document would help an agent answer at least one implementation task, one
  troubleshooting task, and one tradeoff task

### 8 - Emit
Output the Markdown document only.
