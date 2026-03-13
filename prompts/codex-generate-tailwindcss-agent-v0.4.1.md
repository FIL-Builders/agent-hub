==============================================================
AGENTHUB - TAILWIND CSS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/tailwindcss/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Tailwind CSS sources.
==============================================================

### 1 - Target Output

Write:

- `agents/tailwindcss/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/tailwindcss-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Tailwind CSS sources, including:

- `npm:tailwindcss@4.2.1` package contents and type declarations where relevant
- official Tailwind CSS v4.2 documentation pages
- official compatibility, upgrade, theme, directives, and installation pages
- official release notes and compatibility notes when needed
- the Tailwind CSS repository at a version-matched tag or commit when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: tailwindcss`
- `Spec version: 0.4.0`
- `Library version: ^4.2.1`
- `Primary language: css`
- `Homepage: https://tailwindcss.com/docs/compatibility`

Lock the target to Tailwind CSS `^4.2.1` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current Tailwind target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- old JavaScript-config-first workflows being the default answer for v4-era work
- preprocessors like Sass or Less being a natural companion instead of a poor
  fit for the current Tailwind workflow
- utility classes, theme variables, directives, and custom CSS layers being one
  undifferentiated styling model
- generic PostCSS or bundler behavior fully capturing Tailwind's current build
  and compatibility model

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Tailwind CSS itself: utilities, directives, theme variables,
layers, compatibility, build workflow, and framework integration boundaries.

You must distinguish:

- Tailwind CSS core behavior
- general CSS platform behavior
- build-tool or framework integration behavior
- third-party component-library or plugin patterns

Specific rules:

- do not treat framework integration packages as Tailwind core exports
- do not collapse native CSS features and Tailwind-specific directives into one
  vague styling model
- do not blur compatibility constraints, build workflow, and runtime styling
  behavior into a single concept

If another tool or framework pattern is useful as context, call it out as a
boundary rather than treating it as Tailwind core API.

### 7 - Coverage Expectations

The generated file should cover the current Tailwind CSS surface needed for
real project work, including:

- utility-first styling model
- theme variables and customization
- directives and custom CSS authoring
- layers and composition
- compatibility and browser/tooling constraints
- framework/build integration boundaries
- migration pitfalls from older Tailwind workflows
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched package contents and official docs
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Tailwind CSS 4.2 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- explain the v4 CSS-first workflow in positive terms, not as an afterthought
- distinguish theme variables, utility usage, directives, and custom CSS layers
- explain compatibility and browser/tooling support constraints explicitly
- keep build-time imports, native CSS variables, and nesting behavior grounded
  in the current official workflow
- preserve high-value guidance around migration pitfalls, env/tooling fit, and
  when not to combine Tailwind with older preprocessor habits

### 10 - Required Tailwind CSS 4.2 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that Sass, Less, or Stylus are recommended peers for the core v4 workflow
- that old config-heavy Tailwind habits are always the preferred modern path
- that framework-specific integration behavior is Tailwind core behavior

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   customize a design system using utilities, theme variables, and directives
2. troubleshooting:
   debug a migration or compatibility issue involving build workflow or browser
   support
3. design or tradeoff:
   choose between utility usage, custom CSS, and layering strategies
4. version-confusion:
   prevent an answer that substitutes older Tailwind or preprocessor intuition
   for current v4 behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/tailwindcss/0.4.0.md`
3. fix any reported structural errors
4. confirm Tailwind-vs-native-CSS and Tailwind-vs-framework boundaries are
   explicit
5. confirm v4 workflow and compatibility semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
