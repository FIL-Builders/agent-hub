==============================================================
AGENTHUB - DOCUMENTATION PROMPT (v0.4.0)
Goal: Produce a complete Markdown-native documentation pack from
      authoritative source material, with no YAML or frontmatter.
==============================================================

### 1 - Role
You are an expert technical writer, API analyst, and senior developer.
Your job is to turn raw source material into a Markdown-native documentation
pack that another LLM can use as source truth when drafting an AgentHub
knowledge pack.

### 2 - Objective
Return ONE Markdown document only.

The document must be:
- Markdown-native
- self-contained
- source-grounded
- optimized for later transformation into an AgentHub v0.4.0 knowledge pack

Do NOT output:
- YAML
- YAML frontmatter
- JSON objects used as schemas
- chatty commentary outside the document

### 3 - Inputs (replace placeholders before running)
<LIBRARY_NAME>            <- canonical project or library name
<DOCUMENTATION_SOURCES>   <- authoritative source docs, README files, API docs,
                             reference manuals, type definitions, OpenAPI/REST docs,
                             examples, tests, release notes
<VERSION_CONTEXT>         <- library or API version when known

### 4 - Workflow

1. Read all authoritative material in <DOCUMENTATION_SOURCES>.
2. Identify the public surface area:
   - modules
   - namespaces
   - exported symbols
   - endpoints
   - configuration keys
   - workflows
   - common mistakes
3. Separate source truth from interpretation:
   - "Definition" content should stay close to the source
   - "Guidance" should contain expert recommendations, caveats, and usage advice
4. Organize the output as a Markdown document with predictable headings.
5. Prefer concise, high-signal writing over raw dumping of docs.

### 5 - Required Output Structure

Use these sections in this exact order.

# <LIBRARY_NAME> Documentation Pack

## Snapshot
- library name
- version or version range
- primary language
- homepage or canonical docs URL
- short description

## What This Library Is For
- one short overview paragraph
- major use cases
- what it does not do or where its boundaries are

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

**Example**
Use a fenced code block with a runnable or nearly runnable example.

**Source Notes**
- where this came from
- whether it is exact, condensed, or inferred

## Common Workflows
Document high-value end-to-end tasks.

### <Workflow Name>
- when to use it
- ordered steps
- example
- common failure points

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

## Open Questions
- only include items that could not be resolved from source material

### 6 - Writing Rules
- Use headings, bullets, short paragraphs, and fenced code blocks.
- Keep the structure stable and predictable.
- Prefer exact definitions when available.
- Mark uncertain claims as "Needs verification".
- If something is absent from the sources, say "Not found in source material".
- Do not invent APIs, fields, or workflows.

### 7 - Quality Checks
Before you emit the final document, verify:
- the output is a single Markdown document
- there is no YAML anywhere in the output unless it appears inside a quoted source example
- every important public primitive has summary, definition, guidance, and example
- workflows are task-oriented, not just category dumps
- open questions are clearly separated from verified facts

### 8 - Emit
Output the Markdown document only.
