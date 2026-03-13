# redux Documentation Pack

## Snapshot
- library name: redux
- version or version range: ^5.0.1
- primary language: typescript
- homepage or canonical docs URL: https://redux.js.org/
- short description: redux is the low-level core package for store creation, reducer composition, action dispatch, middleware composition, and a small set of supporting utility types and functions.
- source set summary: `npm:redux@5.0.1` declarations, official Redux docs pages, `parse/redux.out`, and `agents/redux/0.2.0.md` for coverage audit only

## What This Library Is For
The `redux` package defines the core contracts behind Redux state management: actions, reducers, stores, middleware, enhancers, and a few small helpers that compose those pieces. It is appropriate when you need the low-level Redux core directly, are maintaining existing core-Redux code, or need to understand the contracts that Redux Toolkit builds on top of.

Major use cases:
- maintaining existing Redux core applications
- building libraries or examples that need the low-level Redux contracts directly
- understanding the store, reducer, and middleware model beneath Redux Toolkit

Scope and boundaries:
- this pack covers the `redux` package itself
- this pack does not treat Redux Toolkit (`@reduxjs/toolkit`) as part of the core `redux` package
- this pack does not treat `react-redux` bindings as part of the core `redux` package
- official Redux guidance for new application code prefers Redux Toolkit over direct use of the `redux` core package

## Installation And Setup
- install commands:
  - `npm install redux`
- environment prerequisites:
  - any modern Node.js or browser-bundled JavaScript environment
  - a clear decision about whether you actually need the core package instead of Redux Toolkit
- configuration prerequisites:
  - reducers must return defined initial state when called with `undefined`
  - state should remain serializable and immutable in ordinary Redux workflows
  - store enhancers and middleware should be composed intentionally, not ad hoc
- minimum setup example:

```ts
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";

const counter = (state = 0, action: { type: string }) => {
  switch (action.type) {
    case "counter/increment":
      return state + 1;
    default:
      return state;
  }
};

const rootReducer = combineReducers({ counter });
const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => {
  console.log("dispatching", action);
  return next(action);
};

const store = createStore(rootReducer, applyMiddleware(logger));
```

## Core Concepts

### Actions and dispatch
- Redux state changes are requested by dispatching action objects.
- The base store dispatch expects plain object actions ready for the reducer.
- Middleware can extend dispatch behavior, but the store contract still centers on actions.

### Reducers and state shape
- Reducers compute the next state from the previous state and an action.
- Reducers must be pure, deterministic, and free of side effects.
- `combineReducers` builds a root reducer by assigning one reducer to each state key.

### Store as runtime coordinator
- The store owns state reads, action dispatch, subscriptions, and reducer replacement.
- A typical Redux application uses one store and composes complexity through reducers, not multiple stores.
- Enhancers and middleware extend the store lifecycle in different ways.

### Middleware versus enhancers
- Middleware wraps dispatch.
- Enhancers wrap store creation.
- `applyMiddleware(...)` is itself a store enhancer.

### Core package versus modern Redux app setup
- The Redux docs explicitly recommend Redux Toolkit for new Redux application code.
- The `redux` core package remains supported and useful for low-level control, learning, and maintenance work.
- Agents should distinguish "how Redux works" from "what the docs recommend as the default way to build new apps today".

## Version Delta Audit
- prior version or prior pack target: `>=5.0.0 <6.0.0`
- current locked version: `^5.0.1`
- major changes that affect agent behavior:
  - no major-version jump is involved, but the v0.4 pack must now represent the official guidance more accurately
  - `createStore` remains exported but is explicitly deprecated as a visual signal
  - `legacy_createStore` is the non-deprecated alias when direct core usage is intentionally chosen
  - official Redux docs continue to recommend Redux Toolkit, not the core package alone, for new application code
- outdated assumptions that must not carry forward:
  - do not present Redux Toolkit exports as core `redux` exports
  - do not present `react-redux` hooks or components as core `redux` exports
  - do not present `createStore` as the preferred default for new application code without the deprecation context

## Decision Rules
- Use the core `redux` package when you need low-level store, reducer, middleware, or enhancer contracts directly.
- Avoid using the core `redux` package by itself for new app code when official guidance points to Redux Toolkit instead.
- Use `combineReducers` when your state shape is object-based and maps cleanly to slice reducers.
- Use `legacy_createStore` instead of `createStore` when you intentionally want the core API without the deprecation marker.
- Use `applyMiddleware(...)` as the first enhancer in an enhancer composition chain.
- Use `bindActionCreators(...)` only when you specifically need dispatch-bound action creators; do not assume it is necessary in every architecture.
- Use `isAction(...)` when narrowing unknown input to a Redux action shape.
- Use `isPlainObject(...)` when validating payloads or state-like values that must be plain objects.

## Ecosystem Boundaries
- core Redux surface:
  - action, reducer, store, dispatch, middleware, enhancer, observable, and utility contracts from the `redux` package
  - top-level helpers such as `combineReducers`, `applyMiddleware`, `compose`, `isAction`, and `isPlainObject`
- first-party companion surfaces:
  - Redux Toolkit from `@reduxjs/toolkit`
  - React bindings from `react-redux`
- third-party ecosystem surfaces:
  - middleware such as `redux-thunk`, `redux-saga`, and logging middleware
  - devtools integrations and persistence libraries
- intentionally out of scope for this pack:
  - `configureStore`, `createSlice`, `createAsyncThunk`, RTK Query, React hooks, and `<Provider>`

## Preconditions And Invariants
- Reducers must return a valid state value for unknown actions and initial calls with `undefined`.
- Base `dispatch` expects plain object actions; non-plain workflows depend on middleware.
- If you use `combineReducers`, any preloaded state must match the combined reducer keys.
- Middleware should normally forward actions with `next(action)` unless it intentionally terminates the chain.
- Subscribers should not assume they will observe every intermediate nested dispatch state.
- A Redux app should normally have one store instance per app runtime, or one per request in server-rendered scenarios.

## Public Surface Area

### Action and reducer contracts

#### Action
**Kind:** type

**Summary:** Minimal Redux action contract with a required string `type` field.

**Definition**
```ts
type Action<T extends string = string> = {
  type: T;
};
```

**Guidance**
- Use as the narrowest action shape when the only guaranteed field is `type`.
- Prefer string action types because Redux docs require `type` to be serializable.
- Extend this type for richer payload contracts rather than weakening everything to `any`.

**Example**
```ts
type IncrementAction = Action<"counter/increment">;

const action: IncrementAction = { type: "counter/increment" };
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact type alias from declarations

#### UnknownAction
**Kind:** interface

**Summary:** Action shape with arbitrary extra unknown properties.

**Definition**
```ts
interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}
```

**Guidance**
- Prefer over `AnyAction` when you need a permissive action shape without discarding type safety entirely.
- Use as the default generic action parameter when building library-quality reducer or dispatch utilities.
- Do not treat this as permission to skip discriminating action types in application logic.

**Example**
```ts
import type { Reducer, UnknownAction } from "redux";

const reducer: Reducer<number, UnknownAction> = (state = 0, action) => {
  if (action.type === "counter/increment") return state + 1;
  return state;
};
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact interface from declarations

#### AnyAction
**Kind:** interface

**Summary:** Legacy permissive action shape with arbitrary `any` properties.

**Definition**
```ts
interface AnyAction extends Action {
  [extraProps: string]: any;
}
```

**Guidance**
- Treat as compatibility surface, not the preferred modern default.
- Prefer `Action` or `UnknownAction` for new type definitions.
- Use only when integrating with older code that already depends on the looser `any` contract.

**Example**
```ts
import type { AnyAction } from "redux";

function legacyActionLogger(action: AnyAction) {
  console.log(action.type, action.payload);
}
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact interface from declarations; deprecated in declarations

#### Reducer
**Kind:** type

**Summary:** Pure function from previous state and action to next state.

**Definition**
```ts
type Reducer<S = any, A extends Action = UnknownAction, PreloadedState = S> =
  (state: S | PreloadedState | undefined, action: A) => S;
```

**Guidance**
- Return a concrete initial state when `state` is `undefined`.
- Never perform side effects inside reducers.
- Never return `undefined` for handled or unknown actions.

**Example**
```ts
import type { Reducer } from "redux";

const counter: Reducer<number, { type: "inc" | "dec" }> = (state = 0, action) => {
  switch (action.type) {
    case "inc":
      return state + 1;
    case "dec":
      return state - 1;
    default:
      return state;
  }
};
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact type alias from declarations

#### ReducersMapObject
**Kind:** type

**Summary:** Object mapping state keys to reducer functions for `combineReducers`.

**Definition**
```ts
type ReducersMapObject<S = any, A extends Action = UnknownAction, PreloadedState = S> =
  keyof PreloadedState extends keyof S
    ? {
        [K in keyof S]: Reducer<
          S[K],
          A,
          K extends keyof PreloadedState ? PreloadedState[K] : never
        >;
      }
    : never;
```

**Guidance**
- Keep reducer-map keys stable because they define the state object shape.
- Make preloaded state match the same key structure when hydrating a store.
- Prefer this contract for typed root-reducer assembly instead of ad hoc object maps.

**Example**
```ts
import type { ReducersMapObject } from "redux";

type RootState = {
  counter: number;
  todos: string[];
};

const reducers: ReducersMapObject<RootState> = {
  counter: (state = 0) => state,
  todos: (state = []) => state,
};
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact type alias from declarations

### Store lifecycle and dispatch

#### Store
**Kind:** interface

**Summary:** Redux store contract for state reads, dispatch, subscription, and reducer replacement.

**Definition**
```ts
interface Store<S = any, A extends Action = UnknownAction, StateExt extends unknown = unknown> {
  dispatch: Dispatch<A>;
  getState(): S & StateExt;
  subscribe(listener: ListenerCallback): Unsubscribe;
  replaceReducer(nextReducer: Reducer<S, A>): void;
  [Symbol.observable](): Observable<S & StateExt>;
}
```

**Guidance**
- Use public methods only; do not assume hidden internals or mutate store fields.
- Prefer `replaceReducer(...)` over rebuilding the store when swapping reducer logic in controlled scenarios.
- Be careful with subscription callbacks during nested dispatch flows; you are guaranteed the latest state, not every intermediate state.

**Example**
```ts
import { legacy_createStore as createStore } from "redux";

const store = createStore((state = 0, action: { type: string }) => {
  return action.type === "inc" ? state + 1 : state;
});

const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch({ type: "inc" });
unsubscribe();
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Definition condensed from the full interface to the public methods agents most often need

#### Dispatch
**Kind:** interface

**Summary:** Store dispatch contract that forwards an action and returns it by default.

**Definition**
```ts
interface Dispatch<A extends Action = UnknownAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T;
}
```

**Guidance**
- Base dispatch is synchronous and expects plain object actions.
- Middleware may extend the return type or input handling, but the unenhanced contract is narrow.
- Do not assume thunk-like behavior unless middleware is installed.

**Example**
```ts
import type { Dispatch } from "redux";

type CounterAction = { type: "inc" } | { type: "dec" };

const run = (dispatch: Dispatch<CounterAction>) => {
  dispatch({ type: "inc" });
};
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact interface from declarations

#### legacy_createStore
**Kind:** function

**Summary:** Core Redux store-creation function without the `createStore` deprecation marker.

**Definition**
```ts
declare function legacy_createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(
  reducer: Reducer<S, A, PreloadedState>,
  preloadedState?: PreloadedState | undefined,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;
```

**Guidance**
- Use when you intentionally need core Redux store creation and want to avoid the deprecated `createStore` identifier.
- Prefer this spelling over `createStore` for maintained low-level Redux code if direct core usage is still intentional.
- Do not present it as the recommended path for new application architecture; official docs prefer Redux Toolkit.

**Example**
```ts
import { legacy_createStore as createStore } from "redux";

const store = createStore((state = { ready: true }) => state);
console.log(store.getState());
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: official `createStore` docs page and API reference
- Exact declaration from package types

#### createStore
**Kind:** function

**Summary:** Deprecated visual alias for the core Redux store-creation API.

**Definition**
```ts
declare function createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(
  reducer: Reducer<S, A, PreloadedState>,
  preloadedState?: PreloadedState | undefined,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;
```

**Guidance**
- Treat as compatibility surface and teaching aid, not the preferred default for new code.
- If you intentionally stay on core Redux, prefer `legacy_createStore` for the same runtime behavior without the deprecation marker.
- Always include the official context that Redux docs recommend Redux Toolkit for new application code.

**Example**
```ts
import { createStore } from "redux";

const store = createStore((state = 0) => state);
console.log(store.getState());
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: official `createStore` docs page and "Why RTK Is Redux Today"
- Exact declaration from package types; deprecation is documented in both types and docs

### Reducer composition and dispatch helpers

#### combineReducers
**Kind:** function

**Summary:** Builds one root reducer from an object map of child reducers.

**Definition**
```ts
declare function combineReducers<M>(reducers: M):
  M[keyof M] extends Reducer<any, any, any> | undefined
    ? Reducer<
        StateFromReducersMapObject<M>,
        ActionFromReducersMapObject<M>,
        Partial<PreloadedStateShapeFromReducersMapObject<M>>
      >
    : never;
```

**Guidance**
- Use when state naturally partitions into keyed slices.
- Every child reducer must return a defined state for unknown actions and initialization.
- Keep preloaded state aligned with the reducer map keys.

**Example**
```ts
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  counter: (state = 0, action: { type: string }) =>
    action.type === "counter/increment" ? state + 1 : state,
  todos: (state: string[] = []) => state,
});
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: official API reference and `createStore` docs
- Exact declaration from package types

#### bindActionCreators
**Kind:** function

**Summary:** Wraps action creators so calling them dispatches immediately.

**Definition**
```ts
declare function bindActionCreators<A, M extends ActionCreatorsMapObject<A>>(
  actionCreators: M,
  dispatch: Dispatch
): M;
```

**Guidance**
- Use as a convenience wrapper when you specifically want dispatch-bound action creators.
- Avoid adding it mechanically when direct `dispatch(actionCreator(...))` calls are clearer.
- Do not confuse bound creators with the original action creators; binding dispatches immediately.

**Example**
```ts
import { bindActionCreators, legacy_createStore as createStore } from "redux";

const store = createStore((state = 0) => state);
const actions = {
  inc: () => ({ type: "inc" as const }),
};

const bound = bindActionCreators(actions, store.dispatch);
bound.inc();
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Definition condensed to the object-map overload most often used in practice

### Middleware and enhancers

#### Middleware
**Kind:** interface

**Summary:** Higher-order function that can inspect, transform, delay, or terminate dispatched actions.

**Definition**
```ts
interface Middleware<_DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
  (api: MiddlewareAPI<D, S>): (next: (action: unknown) => unknown) => (action: unknown) => unknown;
}
```

**Guidance**
- Call `next(action)` unless the middleware intentionally terminates or replaces the action flow.
- Keep middleware side effects deliberate and ordered; middleware executes in composition order.
- Do not assume middleware can change reducer purity rules; reducers still must stay pure.

**Example**
```ts
import type { Middleware } from "redux";

const logger: Middleware = () => (next) => (action) => {
  console.log("dispatch", action);
  return next(action);
};
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact interface from declarations

#### applyMiddleware
**Kind:** function

**Summary:** Creates a store enhancer that installs a middleware chain around dispatch.

**Definition**
```ts
declare function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>;
```

**Guidance**
- Place as the first enhancer in a composed enhancer chain because middleware can be asynchronous.
- Use for logging, async flow adapters, interception, and dispatch-shape extension.
- Do not expect middleware alone to replace a store enhancer that changes store creation semantics.

**Example**
```ts
import { applyMiddleware, legacy_createStore as createStore } from "redux";

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => {
  console.log(action);
  return next(action);
};

const store = createStore((state = 0) => state, applyMiddleware(logger));
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: package declaration comments
- Definition condensed to the variadic overload

#### StoreEnhancer
**Kind:** type

**Summary:** Higher-order store creator transformer that augments store behavior or types.

**Definition**
```ts
type StoreEnhancer<Ext extends {} = {}, StateExt extends {} = {}> =
  <NextExt extends {}, NextStateExt extends {}>(
    next: StoreEnhancerStoreCreator<NextExt, NextStateExt>
  ) => StoreEnhancerStoreCreator<NextExt & Ext, NextStateExt & StateExt>;
```

**Guidance**
- Use when you need to alter store creation rather than only wrapping dispatch.
- Compose enhancers deliberately because enhancer order affects behavior and typing.
- Recognize that `applyMiddleware(...)` already returns an enhancer.

**Example**
```ts
import { compose, legacy_createStore as createStore, type StoreEnhancer } from "redux";

const markEnhanced: StoreEnhancer<{ marker: true }> = (next) => (reducer, preloadedState) => {
  const store = next(reducer, preloadedState);
  return Object.assign(store, { marker: true as const });
};

const enhancer = compose(markEnhanced);
const store = createStore((state = 0) => state, enhancer);
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact type alias from declarations

#### compose
**Kind:** function

**Summary:** Right-to-left function composition helper commonly used for enhancers.

**Definition**
```ts
declare function compose<R>(...funcs: Function[]): (...args: any[]) => R;
```

**Guidance**
- Use primarily to combine enhancers or other compatible function layers.
- Read composition right-to-left: the rightmost function runs first.
- Keep composed functions type-compatible; composition hides errors if function contracts do not align.

**Example**
```ts
import { applyMiddleware, compose, legacy_createStore as createStore } from "redux";

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => next(action);
const enhancer = compose(applyMiddleware(logger));
const store = createStore((state = 0) => state, enhancer);
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: declaration comments
- Definition condensed from overload set

### Utilities and interop

#### isAction
**Kind:** function

**Summary:** Type guard that checks whether an unknown value is a Redux action object.

**Definition**
```ts
declare function isAction(action: unknown): action is Action<string>;
```

**Guidance**
- Use when validating untyped external input before dispatching or inspecting action objects.
- Remember that it only checks action shape, not business-level validity.
- Pair with domain-specific guards when action payload structure matters.

**Example**
```ts
import { isAction } from "redux";

function maybeLog(action: unknown) {
  if (isAction(action)) {
    console.log(action.type);
  }
}
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: official utilities docs
- Exact declaration from package types

#### isPlainObject
**Kind:** function

**Summary:** Checks whether a value appears to be a plain JavaScript object.

**Definition**
```ts
declare function isPlainObject(obj: any): obj is object;
```

**Guidance**
- Use when enforcing plain-object assumptions for actions or state-like values.
- Do not confuse this with deep serializability checks; it is only a shallow structural check.
- Prefer this over ad hoc object checks when you specifically want Redux's own plain-object semantics.

**Example**
```ts
import { isPlainObject } from "redux";

function acceptsRecord(value: unknown) {
  return isPlainObject(value);
}
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Guidance cross-check: official utilities docs
- Exact declaration from package types

#### Observable
**Kind:** type

**Summary:** Minimal observable interface exposed by the store for state change interop.

**Definition**
```ts
type Observable<T> = {
  subscribe: (observer: Observer<T>) => {
    unsubscribe: Unsubscribe;
  };
  [Symbol.observable](): Observable<T>;
};
```

**Guidance**
- Use only when integrating with observable-aware consumers; ordinary app code usually prefers `subscribe(...)`.
- Do not overbuild around this surface if simple store subscriptions are enough.
- Treat it as an interop feature, not the primary day-to-day state consumption API.

**Example**
```ts
import { legacy_createStore as createStore } from "redux";

const store = createStore((state = 0) => state);
const observable = store[Symbol.observable]();
const subscription = observable.subscribe({
  next(value) {
    console.log(value);
  },
});

subscription.unsubscribe();
```

**Source Notes**
- Source: `npm:redux@5.0.1:package/dist/redux.d.ts`
- Cross-check: `parse/redux.out`
- Exact type alias from declarations

## Common Workflows

### Maintain an existing core Redux store
- when to use it:
  - the codebase intentionally uses the core `redux` package directly
  - you need to adjust reducers, middleware, or enhancers without migrating architecture first
- ordered steps:
  1. identify whether the code uses `createStore` or `legacy_createStore`
  2. check whether any behavior depends on middleware or enhancer ordering
  3. confirm reducer initialization and unknown-action handling
  4. add or adjust middleware with `applyMiddleware(...)`
  5. keep companion-library concerns out of the core pack unless the task explicitly crosses that boundary
- example:

```ts
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";

const reducers = combineReducers({
  count: (state = 0, action: { type: string }) =>
    action.type === "count/increment" ? state + 1 : state,
});

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => {
  console.log("action", action);
  return next(action);
};

const store = createStore(reducers, applyMiddleware(logger));
```

- common failure points:
  - reducer returns `undefined`
  - middleware forgets to return `next(action)`
  - state hydration shape does not match `combineReducers(...)`

### Validate untyped action input before dispatch
- when to use it:
  - input comes from an integration boundary or plugin system
- ordered steps:
  1. check action shape with `isAction(...)`
  2. validate domain-specific payload fields separately
  3. dispatch only after both checks pass
- example:

```ts
import { isAction } from "redux";

function maybeDispatch(dispatch: (action: { type: string }) => void, value: unknown) {
  if (isAction(value)) {
    dispatch(value);
  }
}
```

- common failure points:
  - assuming `isAction(...)` validates payload semantics
  - dispatching non-plain objects without middleware support

## Common Confusions
- `redux` versus Redux Toolkit:
  - Redux Toolkit is the recommended modern app-facing layer
  - this pack is only for the low-level `redux` package
- `redux` versus `react-redux`:
  - `redux` owns the store contracts
  - `react-redux` owns React bindings such as `<Provider>`, `useSelector`, and `useDispatch`
- `createStore` versus `legacy_createStore`:
  - runtime behavior is the same
  - `createStore` carries the official deprecation marker
- middleware versus enhancers:
  - middleware wraps dispatch
  - enhancers wrap store creation
- `AnyAction` versus `UnknownAction`:
  - `AnyAction` is legacy and weaker
  - `UnknownAction` is the better permissive default

## Deprecated And Compatibility Surface
- `createStore` is deprecated as a visual signal, not because it stopped working
- `legacy_createStore` exists as the non-deprecated alias for the same core behavior
- `AnyAction` is deprecated in the type declarations in favor of `Action` or `UnknownAction`
- the main migration direction recommended by official docs is:
  - use Redux Toolkit for new application code
  - keep the core package for low-level control, learning, or legacy maintenance when appropriate
- migration traps:
  - replacing `createStore` mechanically without understanding companion-library boundaries
  - answering a core Redux question with Redux Toolkit or `react-redux` APIs as if they are exported from `redux`

## Pitfalls And Troubleshooting

### Reducer returns undefined
- likely cause:
  - reducer forgot its default state or does not return current state for unknown actions
- how to verify:
  - call the reducer with `undefined` and an unrelated action
  - check whether any switch branch falls through without returning
- fix:
  - return an initial state for `undefined`
  - return the existing state for unknown actions

### Middleware swallows actions
- likely cause:
  - middleware does not call or return `next(action)`
- how to verify:
  - insert logging before and after `next(action)`
  - inspect whether downstream reducers or middleware are ever reached
- fix:
  - return `next(action)` unless swallowing is the explicit behavior

### Hydrated state shape does not match root reducer
- likely cause:
  - preloaded state keys differ from the `combineReducers(...)` map
- how to verify:
  - compare the preloaded object keys against the reducer map keys
- fix:
  - align the preloaded state object to the combined reducer shape

### Wrong library surface is used in the answer
- likely cause:
  - core Redux exports were confused with Redux Toolkit or `react-redux`
- how to verify:
  - check whether the answer mentions `configureStore`, `createSlice`, `useSelector`, or `<Provider>`
- fix:
  - either move the answer to the correct companion package or keep the answer strictly on the `redux` exports

## Best Practices
- keep reducers pure and deterministic
- treat Redux Toolkit as the recommended default for new app code, but keep this pack precise about what the core package actually exports
- use `legacy_createStore` when direct core store creation is intentional
- use `combineReducers(...)` to keep state shape explicit and stable
- document middleware and enhancer order because it changes runtime behavior
- keep core-package answers separate from companion-library answers

## References
- `npm:redux@5.0.1:package/dist/redux.d.ts`
- `https://redux.js.org/api/api-reference`
- `https://redux.js.org/api/createstore`
- `https://redux.js.org/api/utils`
- `https://redux.js.org/introduction/why-rtk-is-redux-today`
- `parse/redux.out`
- `agents/redux/0.2.0.md` as coverage audit only

## Open Questions
- Needs verification: whether the final expert pack should expose the full family of inferred helper types such as `StateFromReducersMapObject` and `ActionFromReducersMapObject`, or keep them implied beneath `Reducer` and `ReducersMapObject`
- Needs verification: whether the eventual expert pack should include `StoreCreator` as a first-class symbol, or treat it as supporting type infrastructure rather than a high-value operational primitive
