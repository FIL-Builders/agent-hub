# Redux Overview

## Snapshot

- Spec name: redux
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^5.0.1
- Primary language: typescript
- Homepage: https://redux.js.org/
- Source set: npm:redux@5.0.1 declarations, official Redux docs pages, parse/redux.out as a cross-check, parse/redux-docs-v0.4.0.md as the intermediate documentation pack, and agents/redux/0.2.0.md for coverage audit only

**Tags**
- state-management
- redux
- javascript
- typescript
- middleware

## Purpose

This pack teaches an agent to use the low-level Redux 5 core package for reducer composition, store creation, middleware composition, dispatch contracts, and utility guards while keeping modern boundary guidance explicit around Redux Toolkit and `react-redux`.

## Guiding Principles

- Treat the `redux` package as the low-level core surface, not the default modern application stack.
- Keep core Redux answers separate from Redux Toolkit and `react-redux` companion-library answers.
- Prefer `legacy_createStore` over `createStore` when direct core store creation is intentional and you want to avoid the deprecated identifier.
- Require reducers to return defined initial state and current state for unknown actions.
- Treat middleware as dispatch wrappers and enhancers as store-creation wrappers.
- Use `combineReducers(...)` when state naturally maps to keyed reducer slices.
- Assume plain object actions unless the task explicitly installs middleware that extends dispatch behavior.

## Boundary Notes

- Source material: `npm:redux@5.0.1:package/dist/redux.d.ts` as the primary contract source, official Redux docs pages for the core API reference, `createStore`, utilities, and "Why Redux Toolkit is How To Use Redux Today", plus `parse/redux.out` as a cross-check.
- Coverage is intentionally centered on the `redux` package itself: action contracts, reducers, store lifecycle, middleware, enhancers, and small utilities.
- The pack preserves the official docs boundary: Redux Toolkit and `react-redux` are first-party companions, not exports of the core `redux` package.
- `agents/redux/0.2.0.md` was used only to audit coverage and useful operational guidance, not as the primary contract source.
- Deprecated and compatibility-only surfaces remain documented when they materially affect maintenance tasks, especially `createStore` and `AnyAction`.

## FAQ

### Should a new application use the core `redux` package directly?
Usually no. The official Redux docs recommend Redux Toolkit for new application code. This pack exists so agents can answer correctly when the task explicitly targets the low-level core `redux` package or when maintaining existing core-Redux code.

### What is the practical difference between `createStore` and `legacy_createStore`?
Runtime behavior is the same. `createStore` carries the official deprecation marker, while `legacy_createStore` is the non-deprecated alias for intentional direct core usage.

### Are `configureStore` and `createSlice` part of this pack?
No. They belong to Redux Toolkit, not the core `redux` package. They may be the right recommendation for a modern application task, but they are out of scope for the core Redux export surface.

## External Resources

- Redux API Reference: https://redux.js.org/api/api-reference
- Redux createStore docs: https://redux.js.org/api/createstore
- Redux utility functions docs: https://redux.js.org/api/utils
- Why Redux Toolkit Is Redux Today: https://redux.js.org/introduction/why-rtk-is-redux-today
- redux package source: https://github.com/reduxjs/redux
