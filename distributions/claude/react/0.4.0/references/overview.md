# React Overview

## Snapshot

- Spec name: react
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^18.3.0
- Primary language: javascript
- Homepage: https://react.dev
- Source set: npm:@types/react@18.3.0/index.d.ts, react@18.3.1, legacy React API and Hooks references, selected react.dev reference pages for unchanged APIs

**Tags**
- react
- frontend
- hooks
- library
- typescript

## Purpose

This pack teaches an agent to use React's core public API for component
composition, state, effects, concurrency, and performance-sensitive rendering
tasks in a React 18.3-era codebase.

## Guiding Principles

- Prefer current function-component and hooks-based patterns over legacy class APIs.
- Treat TypeScript signatures as the authoritative contract for each symbol.
- Keep dependency arrays complete and use linting rules to enforce them.
- Reach for `useMemo`, `useCallback`, and `memo` only when they stabilize real work.
- Use concurrent features such as `useTransition`, `startTransition`, and `useDeferredValue` to keep urgent interactions responsive.
- Use stable data IDs for list keys and avoid index keys unless the list is static.
- Keep examples import-complete and aligned with modern ESM React usage.

## Boundary Notes

- Source material: `npm:@types/react@18.3.0/index.d.ts` as the primary contract source, `react@18.3.1` as the runtime reference, the React 18.3 upgrade note, the legacy React API and Hooks references, and selected current `react.dev` reference pages for unchanged APIs.
- Organization follows the same mental-model grouping as the v0.3.0 pack: element creation, component helpers, core hooks, performance hooks, and advanced hooks.
- Definitions are slightly compressed from the React 18.3 type surface to keep the primary contract readable without changing meaning.
- Coverage was audited against `agents/react/0.3.0.md`, but prior pack content was not treated as the primary contract source.
- `parse/react.out` remains a cross-check only because it appears to contain newer-era symbols that do not fit the locked `^18.3.0` target.

## FAQ

### Do I still need PureComponent or shouldComponentUpdate?
For function-component codebases, prefer `memo` plus stable props and hook-based optimization patterns.

### When should I choose useReducer over useState?
Choose `useReducer` when state transitions are coupled, action-driven, or significantly more understandable as reducer logic than individual setter calls.

## External Resources

- React Documentation: https://react.dev
- React API Reference (legacy): https://legacy.reactjs.org/docs/react-api.html
- Hooks API Reference (legacy): https://legacy.reactjs.org/docs/hooks-reference.html
- React 18.3 upgrade note: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- TypeScript definitions (@types/react v18): https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/v18/index.d.ts
