==============================================================
AGENTHUB - FASTAPI 0.4.1 GENERATION BRIEF
Goal: Generate `agents/fastapi/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched FastAPI sources.
==============================================================

### 1 - Target Output

Write:

- `agents/fastapi/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/fastapi-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
FastAPI sources, including:

- `pypi:fastapi==0.135.1` package contents and type hints
- official FastAPI tutorial and reference pages
- official release notes and compatibility notes when needed
- the FastAPI repository at a version-matched tag or commit when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: fastapi`
- `Spec version: 0.4.0`
- `Library version: ^0.135.1`
- `Primary language: python`
- `Homepage: https://fastapi.tiangolo.com/tutorial/`

Lock the target to FastAPI `^0.135.1` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current FastAPI target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- FastAPI validation behavior being the same thing as arbitrary custom runtime
  validation logic
- sync and async path operation behavior being interchangeable without
  performance or correctness implications
- dependency injection, request parsing, and OpenAPI generation being loosely
  coupled instead of part of one framework contract
- generic ASGI or Starlette behavior being sufficient without FastAPI-specific
  modeling and docs generation semantics

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for FastAPI itself: path operations, dependency injection,
validation and serialization, async behavior, background tasks, and OpenAPI
generation.

You must distinguish:

- FastAPI framework behavior
- underlying Starlette behavior
- Pydantic model behavior
- generic ASGI server or deployment behavior
- third-party auth, ORM, or task-queue patterns

Specific rules:

- do not treat third-party auth, ORM, or background-job libraries as FastAPI
  core surface
- do not collapse FastAPI behavior into generic Starlette-only or ASGI-only
  guidance
- do not blur request validation, dependency injection, and OpenAPI generation
  into one vague framework concept

If another library pattern is useful as context, call it out as a boundary
rather than treating it as FastAPI core API.

### 7 - Coverage Expectations

The generated file should cover the current FastAPI surface needed for real
project work, including:

- app and router setup
- path operation declaration
- request parsing and validation
- response models and serialization
- dependency injection
- async and sync execution behavior
- background tasks and middleware where source support is strong
- OpenAPI and docs generation
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched package contents, type hints, and official docs
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required FastAPI 0.135 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- use typed path operation signatures and models so validation and docs stay
  aligned
- treat dependencies as composable request-time framework primitives, not just
  helper calls
- distinguish sync and async execution paths deliberately
- explain how request/response models shape generated OpenAPI output
- preserve high-value guidance around validation errors, dependency reuse, and
  response modeling

### 10 - Required FastAPI 0.135 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that third-party auth or ORM integrations are FastAPI core APIs
- that generic Starlette or ASGI behavior fully captures FastAPI model and docs
  semantics
- that type annotations alone replace FastAPI request/response modeling rules

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   build a typed API route with dependency injection and response modeling
2. troubleshooting:
   debug a validation error, dependency issue, or async misuse
3. design or tradeoff:
   choose between sync and async handlers or between dependency patterns
4. version-confusion:
   prevent an answer that substitutes generic ASGI or Starlette intuition for
   FastAPI-specific validation, dependency, or docs behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/fastapi/0.4.0.md`
3. fix any reported structural errors
4. confirm FastAPI-vs-Starlette/Pydantic boundaries are explicit
5. confirm validation, dependency, and docs semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
