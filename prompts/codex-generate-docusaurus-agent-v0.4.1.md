==============================================================
AGENTHUB - DOCUSAURUS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/docusaurus/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Docusaurus 3 sources.
==============================================================

### 1 - Target Output

Write:

- `agents/docusaurus/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/docusaurus.out`
- `agents/docusaurus/0.2.0.md`
- `parse/docusaurus-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Docusaurus 3 sources, including:

- `npm:@docusaurus/core@3.9.2` package contents and type declarations
- official Docusaurus documentation pages
- official Docusaurus API and lifecycle reference pages
- the Docusaurus repository at a version-matched tag or commit when needed
- official migration, release, or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: docusaurus`
- `Spec version: 0.4.0`
- `Library version: ^3.9.2`
- `Primary language: javascript`
- `Homepage: https://docusaurus.io/`

Lock the target to Docusaurus `^3.9.2` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Docusaurus `^3.0.0`
- current target: Docusaurus `^3.9.2`
- this is the same major version, but the new pack must still identify stale
  patterns and missing current guidance

You must identify and avoid carrying forward stale assumptions, including any
assumptions about:

- site-local swizzled components being exported by Docusaurus core packages
- theme-package exports being part of `@docusaurus/core` unless the package
  surface proves otherwise
- plugin lifecycle hooks, config fields, and CLI commands being interchangeable
  concepts

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Docusaurus platform development, but it must still keep
package and surface boundaries explicit.

You must distinguish:

- `@docusaurus/core` runtime and build-system behavior
- official companion packages such as theme, hook, router, or utility packages
- site-local components and swizzled theme files
- third-party plugins or presets

Specific rules:

- do not treat `@site/...` imports as core Docusaurus exports
- do not treat swizzled files as stable upstream API unless the official docs
  explicitly frame them that way
- do not blur CLI commands, plugin lifecycle methods, React hooks, and config
  fields into one undifferentiated API surface

If a companion package surface is operationally important, call it out as a
boundary or dependency instead of folding it into the wrong API group.

### 7 - Coverage Expectations

The generated file should cover the current Docusaurus 3 surface needed for
real project work, including:

- runtime hooks and components used inside site code
- configuration authoring and important config fields
- plugin lifecycle methods and route/content generation flow
- CLI commands and their operational role
- theme and swizzle boundaries
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/docusaurus/0.2.0.md` only to audit coverage and identify old
high-value insights that should not regress. It is not the primary contract
source.

### 8 - Definition Quality

For each documented symbol:

- prefer version-matched published package declarations or source files
- use official docs for high-level guidance and workflows
- use `parse/docusaurus.out` only as a cross-check
- do not source `Definition` blocks from `agents/docusaurus/0.2.0.md`
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Docusaurus 3 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- use Docusaurus hooks and routing helpers instead of hard-coding site paths
- keep SSR and CSR boundaries explicit when using browser-only APIs
- treat plugin lifecycle hooks as build-time extension points, not runtime
  component APIs
- treat swizzle as a customization boundary with maintenance cost, not the
  default first option
- keep config authoring, plugin lifecycle, and page-component concerns separate

### 10 - Required Docusaurus 3 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that `@site/...` imports are exported by Docusaurus packages
- that swizzled theme files are stable upstream API contracts
- that third-party plugins are part of the Docusaurus core surface

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   build a site page that uses Docusaurus hooks and internal routing correctly
2. troubleshooting:
   debug SSR issues caused by browser-only code or incorrect base URL handling
3. design or tradeoff:
   choose between config changes, plugin lifecycle work, or swizzle-based theme
   customization
4. version-confusion:
   prevent an answer that treats site-local or theme-local code as if it were a
   stable core export

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/docusaurus/0.4.0.md`
3. fix any reported structural errors
4. confirm package and surface boundaries are explicit
5. confirm swizzle and site-local code are framed accurately
6. compare the regenerated pack against the baseline `agents/docusaurus/0.2.0.md`
   when requested by the parent task
7. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
8. stop only when the validator passes
