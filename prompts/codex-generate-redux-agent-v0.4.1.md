==============================================================
AGENTHUB - REDUX 0.4.1 GENERATION BRIEF
Goal: Generate `agents/redux/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Redux 5 sources.
==============================================================

### 1 - Target Output

Write:

- `agents/redux/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/redux.out`
- `agents/redux/0.2.0.md`
- `parse/redux-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Redux 5 sources, including:

- `npm:redux@5.0.1` package contents and type declarations
- official Redux documentation pages
- the Redux repository at a version-matched tag or commit when needed
- official release, migration, or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: redux`
- `Spec version: 0.4.0`
- `Library version: ^5.0.1`
- `Primary language: typescript`
- `Homepage: https://redux.js.org/`

Lock the target to Redux `^5.0.1` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Redux `>=5.0.0 <6.0.0`
- current target: Redux `^5.0.1`
- this is not a major-version transition, but the new pack must still identify
  stale authoring patterns and outdated ecosystem assumptions

You must identify and avoid carrying forward stale assumptions, including any
assumptions about:

- Redux Toolkit exports being part of the core `redux` package
- `react-redux` hooks or components being part of the core `redux` package
- compatibility-only or deprecated core APIs being the preferred starting point
  for new code

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for core Redux, not for Redux Toolkit or `react-redux`.

You must distinguish:

- core Redux exports and contracts
- first-party companion libraries such as Redux Toolkit and `react-redux`
- third-party ecosystem helpers

Specific rules:

- do not treat `configureStore`, `createSlice`, or `createAsyncThunk` as core
  Redux exports unless a cited, version-matched core source proves otherwise
- do not treat `useSelector`, `useDispatch`, or `<Provider>` as core Redux
  exports unless a cited, version-matched core source proves otherwise

If a companion-library surface is operationally important, call it out as a
boundary or dependency instead of folding it into the core API groups.

### 7 - Coverage Expectations

The generated file should cover the current Redux 5 core surface needed for
real project work, including:

- store lifecycle and dispatch flow
- reducer composition and replacement
- action typing and action utilities
- middleware and enhancer composition
- interop and observable support where source support is strong
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/redux/0.2.0.md` only to audit coverage and identify old high-value
insights that should not regress. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol:

- prefer version-matched published package declarations or source files
- use official docs for high-level guidance and workflows
- use `parse/redux.out` only as a cross-check
- do not source `Definition` blocks from `agents/redux/0.2.0.md`
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Redux 5 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- keep reducers pure and never return `undefined` for handled branches
- use middleware and enhancers intentionally, with correct composition order
- distinguish core Redux setup from companion-library setup
- preserve type-safe action and reducer contracts where the source material
  supports stronger guidance
- call out compatibility or legacy APIs accurately instead of presenting them as
  the default modern path

### 10 - Required Redux 5 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched core source proves otherwise:

- that Redux Toolkit exports are part of the `redux` package
- that `react-redux` bindings are part of the `redux` package
- that compatibility-only store-creation APIs are the preferred default path for
  new code

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   create a minimal core Redux store with reducer composition and middleware
2. troubleshooting:
   debug a reducer that returns `undefined` or middleware that swallows actions
3. design or tradeoff:
   explain when a task should stay in core Redux versus rely on a companion
   library boundary
4. version-confusion:
   prevent an answer that incorrectly uses Redux Toolkit or `react-redux` APIs
   as if they were core Redux exports

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/redux/0.4.0.md`
3. fix any reported structural errors
4. confirm the pack does not teach companion-library APIs as core Redux exports
5. confirm compatibility or legacy APIs are framed accurately
6. compare the regenerated pack against the baseline `agents/redux/0.2.0.md`
   when requested by the parent task
7. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
8. stop only when the validator passes
