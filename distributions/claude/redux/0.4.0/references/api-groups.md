# Redux API Groups

### Action Contracts
**Exports**
- Action
- UnknownAction
- AnyAction
- ActionCreator

Core types for describing action objects and action-creator functions.

#### Action
**Kind**
type

**Summary**
Minimal Redux action contract with a required string `type` field.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
type Action<T extends string = string> = {
  type: T;
};
```

**Guidance**
- Use when the only guaranteed action field is `type`.
- Keep action `type` values serializable strings.
- Extend this type for payload contracts instead of weakening everything to `any`.

**Example**
Language: typescript
Description: A narrow action contract for a counter increment.

```ts
import type { Action } from "redux";

type IncrementAction = Action<"counter/increment">;

const action: IncrementAction = { type: "counter/increment" };
```

#### UnknownAction
**Kind**
interface

**Summary**
Action shape with arbitrary extra unknown properties.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface UnknownAction extends Action {
  [extraProps: string]: unknown;
}
```

**Guidance**
- Prefer this over `AnyAction` when you need a permissive action type without dropping all type information.
- Use it as the default generic action parameter for generic reducers or dispatch helpers.
- Do not treat it as an excuse to skip discriminating on `type`.

**Example**
Language: typescript
Description: A reducer that accepts general Redux actions but only handles one case.

```ts
import type { Reducer, UnknownAction } from "redux";

const reducer: Reducer<number, UnknownAction> = (state = 0, action) => {
  if (action.type === "counter/increment") return state + 1;
  return state;
};
```

#### AnyAction
**Kind**
interface

**Summary**
Legacy permissive action contract with arbitrary `any` properties.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface AnyAction extends Action {
  [extraProps: string]: any;
}
```

**Guidance**
- Keep this for compatibility with older code, not as the preferred default in new type definitions.
- Prefer `Action` or `UnknownAction` when authoring fresh Redux 5 types.
- Expect weaker type safety if you rely on this broadly.

**Example**
Language: typescript
Description: Compatibility-style action logging in legacy code.

```ts
import type { AnyAction } from "redux";

function legacyLogger(action: AnyAction) {
  console.log(action.type, action.payload);
}
```

**Since**
4.0.0

**Deprecated**
- Reason: The declarations deprecate `AnyAction` in favor of `Action` or `UnknownAction`.
- Replaced by: `Action` or `UnknownAction`

#### ActionCreator
**Kind**
interface

**Summary**
Function signature for creating an action value from arguments.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface ActionCreator<A, P extends any[] = any[]> {
  (...args: P): A;
}
```

**Guidance**
- Remember that action creators create actions; they do not dispatch by themselves.
- Use clear argument lists because bound action creators preserve this call signature.
- Put side effects elsewhere; an action creator should stay a pure factory unless you are in a middleware-specific ecosystem outside core Redux.

**Example**
Language: typescript
Description: A typed action creator that returns a concrete Redux action.

```ts
import type { ActionCreator } from "redux";

type AddTodo = { type: "todos/add"; payload: string };

const addTodo: ActionCreator<AddTodo, [string]> = (text) => ({
  type: "todos/add",
  payload: text,
});
```

### Reducer Composition
**Exports**
- Reducer
- ReducersMapObject
- combineReducers

Core contracts for reducers and keyed reducer composition.

#### Reducer
**Kind**
type

**Summary**
Pure function from previous state and action to next state.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
type Reducer<S = any, A extends Action = UnknownAction, PreloadedState = S> =
  (state: S | PreloadedState | undefined, action: A) => S;
```

**Guidance**
- Return an initial state when called with `undefined`.
- Never put side effects such as API calls inside reducers.
- Return the current state for unknown actions instead of `undefined`.

**Example**
Language: typescript
Description: A small reducer with explicit unknown-action fallback.

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

#### ReducersMapObject
**Kind**
type

**Summary**
Object map from state keys to reducers for `combineReducers(...)`.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

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
- Keep keys stable because they define the resulting state object shape.
- Match preloaded state shape to the same keys.
- Use this contract when you want strong typing for root-reducer assembly.

**Example**
Language: typescript
Description: A typed reducer map for a small root state.

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

#### combineReducers
**Kind**
function

**Summary**
Builds one root reducer from an object map of child reducers.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

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
- Every child reducer must return a defined value for initialization and unknown actions.
- Keep hydrated or server-provided preloaded state aligned with the reducer-map shape.

**Example**
Language: typescript
Description: Compose two slice reducers into a root reducer.

```ts
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  counter: (state = 0, action: { type: string }) =>
    action.type === "counter/increment" ? state + 1 : state,
  todos: (state: string[] = []) => state,
});
```

### Store Lifecycle
**Exports**
- Dispatch
- Store
- createStore
- legacy_createStore

Store creation, dispatch behavior, and the runtime store interface.

#### Dispatch
**Kind**
interface

**Summary**
Dispatch signature that accepts an action and returns it by default.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface Dispatch<A extends Action = UnknownAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T;
}
```

**Guidance**
- Base dispatch is synchronous and expects plain object actions.
- Middleware may extend what dispatch accepts or returns, but do not assume that without middleware.
- Keep action validation explicit at integration boundaries.

**Example**
Language: typescript
Description: A helper that accepts a typed Redux dispatch function.

```ts
import type { Dispatch } from "redux";

type CounterAction = { type: "counter/increment" };

function run(dispatch: Dispatch<CounterAction>) {
  dispatch({ type: "counter/increment" });
}
```

#### Store
**Kind**
interface

**Summary**
Runtime contract for reading state, dispatching actions, subscribing, and replacing reducers.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

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
- Use the public methods only; do not rely on private internals.
- Prefer `replaceReducer(...)` over rebuilding the store when controlled reducer replacement is required.
- Subscribers see the latest completed state, not necessarily every intermediate nested dispatch state.

**Example**
Language: typescript
Description: Subscribe to a store and then unsubscribe after a dispatch.

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

#### createStore
**Kind**
function

**Summary**
Deprecated core Redux store-creation function retained for compatibility.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(
  reducer: Reducer<S, A, PreloadedState>,
  preloadedState?: PreloadedState | undefined,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;
```

**Guidance**
- Treat this as compatibility surface and learning surface, not the preferred default for new application code.
- Keep the official docs guidance explicit: Redux Toolkit is the recommended path for new Redux application logic.
- If you intentionally stay on core Redux and want identical behavior without the deprecated identifier, use `legacy_createStore`.

**Example**
Language: typescript
Description: Compatibility-style store creation using the deprecated identifier.

```ts
import { createStore } from "redux";

const store = createStore((state = 0) => state);
console.log(store.getState());
```

**Deprecated**
- Reason: Official Redux docs mark `createStore` as deprecated to steer new application code toward Redux Toolkit.
- Replaced by: `legacy_createStore` for direct core usage, or `configureStore` in Redux Toolkit for modern application setup

#### legacy_createStore
**Kind**
function

**Summary**
Non-deprecated alias for the core Redux store-creation API.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function legacy_createStore<S, A extends Action, Ext extends {} = {}, StateExt extends {} = {}, PreloadedState = S>(
  reducer: Reducer<S, A, PreloadedState>,
  preloadedState?: PreloadedState | undefined,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<S, A, UnknownIfNonSpecific<StateExt>> & Ext;
```

**Guidance**
- Use when you intentionally need core Redux store creation but want to avoid the deprecated `createStore` identifier.
- Keep the same constraints as `createStore`: reducer shape, preloaded state shape, and enhancer order still matter.
- Do not confuse this with a new API surface; it is the same runtime behavior with a different identifier.

**Example**
Language: typescript
Description: Explicit low-level core Redux store creation.

```ts
import { legacy_createStore as createStore } from "redux";

const store = createStore((state = { ready: true }) => state);
console.log(store.getState());
```

### Middleware And Enhancers
**Exports**
- Middleware
- MiddlewareAPI
- applyMiddleware
- StoreEnhancer
- compose

Dispatch wrappers and store-creation wrappers for extending core Redux behavior.

#### Middleware
**Kind**
interface

**Summary**
Higher-order function interface for wrapping dispatch behavior.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface Middleware<_DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
  (api: MiddlewareAPI<D, S>): (next: (action: unknown) => unknown) => (action: unknown) => unknown;
}
```

**Guidance**
- Call `next(action)` unless the middleware intentionally terminates or replaces the action flow.
- Keep middleware focused on interception, transformation, async sequencing, logging, or other dispatch-level concerns.
- Do not use middleware as a back door for reducer-side mutation or hidden state writes.

**Example**
Language: typescript
Description: A small logging middleware.

```ts
import type { Middleware } from "redux";

const logger: Middleware = () => (next) => (action) => {
  console.log("dispatch", action);
  return next(action);
};
```

#### MiddlewareAPI
**Kind**
interface

**Summary**
The `dispatch` and `getState` pair exposed to middleware.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D;
  getState(): S;
}
```

**Guidance**
- Use `getState()` sparingly so middleware stays easy to reason about and test.
- Prefer reading state only when the middleware genuinely needs coordination or branching behavior.
- Remember that `dispatch` inside middleware may already be enhanced by other middleware.

**Example**
Language: typescript
Description: Middleware that reads state before forwarding an action.

```ts
import type { Middleware } from "redux";

const guard: Middleware = ({ getState }) => (next) => (action) => {
  console.log("before", getState());
  return next(action);
};
```

#### applyMiddleware
**Kind**
function

**Summary**
Creates a store enhancer that installs a middleware chain around dispatch.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function applyMiddleware<Ext, S = any>(
  ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{ dispatch: Ext }>;
```

**Guidance**
- Place it first in the enhancer chain because middleware can be asynchronous.
- Use it for logging, async adapters, action transformation, or similar dispatch-level concerns.
- Do not assume it replaces a full store enhancer when the behavior changes store creation rather than dispatch.

**Example**
Language: typescript
Description: Install a logging middleware during store creation.

```ts
import { applyMiddleware, legacy_createStore as createStore } from "redux";

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => {
  console.log(action);
  return next(action);
};

const store = createStore((state = 0) => state, applyMiddleware(logger));
```

#### StoreEnhancer
**Kind**
type

**Summary**
Higher-order store creator transformer that augments the store interface or state typing.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
type StoreEnhancer<Ext extends {} = {}, StateExt extends {} = {}> =
  <NextExt extends {}, NextStateExt extends {}>(
    next: StoreEnhancerStoreCreator<NextExt, NextStateExt>
  ) => StoreEnhancerStoreCreator<NextExt & Ext, NextStateExt & StateExt>;
```

**Guidance**
- Use when you need to wrap store creation rather than only wrapping dispatch.
- Compose enhancers deliberately because order changes resulting behavior and typing.
- Recognize that `applyMiddleware(...)` already returns a store enhancer.

**Example**
Language: typescript
Description: Add a marker field to the store through a custom enhancer.

```ts
import { compose, legacy_createStore as createStore, type StoreEnhancer } from "redux";

const markEnhanced: StoreEnhancer<{ marker: true }> = (next) => (reducer, preloadedState) => {
  const store = next(reducer, preloadedState);
  return Object.assign(store, { marker: true as const });
};

const enhancer = compose(markEnhanced);
const store = createStore((state = 0) => state, enhancer);
```

#### compose
**Kind**
function

**Summary**
Right-to-left function composition helper commonly used for enhancers.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function compose<R>(...funcs: Function[]): (...args: any[]) => R;
```

**Guidance**
- Read the function list from right to left because the rightmost function runs first.
- Use primarily for enhancers or other compatible function layers with clear contracts.
- Keep composition small and intentional so control flow remains obvious.

**Example**
Language: typescript
Description: Compose one middleware enhancer and one custom enhancer.

```ts
import { applyMiddleware, compose, legacy_createStore as createStore } from "redux";

const logger = () => (next: (action: unknown) => unknown) => (action: unknown) => next(action);
const addFlag = (next: any) => (reducer: any, preloadedState: any) => {
  const store = next(reducer, preloadedState);
  return Object.assign(store, { flagged: true });
};

const enhancer = compose(addFlag, applyMiddleware(logger));
const store = createStore((state = 0) => state, enhancer);
```

### Utilities And Interop
**Exports**
- bindActionCreators
- isAction
- isPlainObject
- Observable

Convenience helpers and low-level interop utilities.

#### bindActionCreators
**Kind**
function

**Summary**
Wraps action creators so calling them immediately dispatches their return values.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function bindActionCreators<A, M extends ActionCreatorsMapObject<A>>(
  actionCreators: M,
  dispatch: Dispatch
): M;
```

**Guidance**
- Use when dispatch-bound action creators improve ergonomics for the current integration boundary.
- Avoid adding it by default when direct `dispatch(actionCreator(...))` calls are simpler.
- Remember that bound action creators trigger dispatch immediately; they are not plain action factories anymore.

**Example**
Language: typescript
Description: Bind a small action-creator object to store dispatch.

```ts
import { bindActionCreators, legacy_createStore as createStore } from "redux";

const store = createStore((state = 0) => state);
const actions = {
  inc: () => ({ type: "inc" as const }),
};

const bound = bindActionCreators(actions, store.dispatch);
bound.inc();
```

#### isAction
**Kind**
function

**Summary**
Type guard that checks whether an unknown value is a Redux action object.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function isAction(action: unknown): action is Action<string>;
```

**Guidance**
- Use at integration boundaries before assuming an unknown value is dispatchable as an action.
- Remember that this checks shape, not domain semantics or payload quality.
- Pair it with stronger app-level validation when payload fields matter.

**Example**
Language: typescript
Description: Guard unknown input before logging the action type.

```ts
import { isAction } from "redux";

function maybeLog(value: unknown) {
  if (isAction(value)) {
    console.log(value.type);
  }
}
```

#### isPlainObject
**Kind**
function

**Summary**
Checks whether a value appears to be a plain JavaScript object.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
declare function isPlainObject(obj: any): obj is object;
```

**Guidance**
- Use when enforcing plain-object assumptions for actions or state-like values.
- Do not confuse this with deep serializability checks.
- Prefer it over ad hoc object checks when you specifically want Redux's plain-object semantics.

**Example**
Language: typescript
Description: Accept only plain-object payloads at a boundary.

```ts
import { isPlainObject } from "redux";

function acceptsRecord(value: unknown) {
  return isPlainObject(value);
}
```

#### Observable
**Kind**
type

**Summary**
Minimal observable interface exposed by the store for state-change interop.

**Definition**
Language: typescript
Source: npm:redux@5.0.1:package/dist/redux.d.ts

```ts
type Observable<T> = {
  subscribe: (observer: Observer<T>) => {
    unsubscribe: Unsubscribe;
  };
  [Symbol.observable](): Observable<T>;
};
```

**Guidance**
- Use for observable interop only when another consumer expects that interface.
- Prefer ordinary `store.subscribe(...)` for most day-to-day Redux logic.
- Treat this as an interoperability surface, not the primary state-consumption path.

**Example**
Language: typescript
Description: Subscribe to the store through the observable contract.

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
