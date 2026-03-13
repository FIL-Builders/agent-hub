# React Documentation Pack

## Snapshot
- library name: React
- version or version range: ^18.3.0
- primary language: javascript
- homepage or canonical docs URL: https://react.dev
- short description: React is a declarative UI library centered on components, state, effects, and concurrent rendering primitives.
- source set summary: npm:@types/react@18.3.0/index.d.ts, react@18.3.1, legacy React API and Hooks references, selected react.dev reference pages for unchanged APIs

## What This Library Is For
React is used to build interactive user interfaces from components that render declarative tree output and respond to state, props, context, and external events. The core surface in this pack focuses on the APIs most often needed by an agent editing or extending a React 18.3-era application: element creation, component helpers, core hooks, performance hooks, and advanced synchronization hooks.

## Installation And Setup
- install commands:
  - `npm install react react-dom`
  - `npm install -D @types/react @types/react-dom` for TypeScript projects
- environment prerequisites:
  - modern bundler or framework such as Vite, Next.js, or another React-capable toolchain
  - JSX or TSX compilation when using JSX syntax
- configuration prerequisites:
  - ensure the runtime and type package versions are aligned with the application target
  - use the React Hooks lint rules when effects and callback dependencies matter
- minimum setup example:

```js
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
```

## Core Concepts

### Declarative element trees
- React elements describe UI structure rather than directly mutating the DOM.
- JSX is the common syntax, but `createElement` is the underlying factory primitive.
- Stable identity through keys is essential for list rendering and reconciliation.

### Hooks as stateful composition
- Hooks let function components own local state, effects, refs, and transitions.
- Dependency arrays determine when memoized callbacks, values, and effects update.
- Hook ordering must remain stable across renders.

### Concurrent rendering primitives
- React 18 introduced transitions, deferred values, and external-store primitives that coordinate urgent and non-urgent work.
- These APIs help keep input and navigation responsive during expensive rendering.
- Concurrency features work best when state responsibilities are clearly separated.

## Public Surface Area

### Element Creation

#### createElement
**Kind:** function

**Summary:** Programmatically creates a React element from a type, props object, and children.

**Definition**
```ts
function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: ReactNode[]
): ReactElement<P>;
```

**Guidance**
- Prefer JSX in ordinary component code.
- Use stable keys when creating arrays of elements.

**Example**
```js
import React from "react";

const button = React.createElement("button", { type: "button" }, "Click");
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`
- Coverage audit only: `agents/react/0.3.0.md`

#### cloneElement
**Kind:** function

**Summary:** Copies an existing element with updated props and optional children.

**Definition**
```ts
function cloneElement<P>(
    element: ReactElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
): ReactElement<P>;
```

**Guidance**
- Use for controlled prop injection into child elements.
- Be careful with replaced `key` and `ref` values.

**Example**
```js
import React, { cloneElement } from "react";

function AddClass({ child }) {
  return React.isValidElement(child)
    ? cloneElement(child, { className: "highlight" })
    : child;
}
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`
- Coverage audit only: `agents/react/0.3.0.md`

#### Fragment
**Kind:** component

**Summary:** Groups children without adding an extra DOM node.

**Definition**
```ts
const Fragment: FunctionComponent<{ children?: ReactNode | undefined }>;
```

**Guidance**
- Use the shorthand fragment syntax by default.
- Use the explicit component when you need a `key`.

**Example**
```js
import { Fragment } from "react";

function List({ items }) {
  return items.map((item) => (
    <Fragment key={item.id}>
      <li>{item.label}</li>
      <li>{item.detail}</li>
    </Fragment>
  ));
}
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`
- Coverage audit only: `agents/react/0.3.0.md`

### Component Helpers

#### Children
**Kind:** object

**Summary:** Utilities for iterating, counting, and normalizing the opaque `props.children` value.

**Definition**
```ts
interface ReactChildren {
    map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T): Array<...>;
    forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
    count(children: any): number;
    only<C>(children: C): C;
    toArray(children: ReactNode | ReactNode[]): Array<...>;
}
const Children: ReactChildren;
```

**Guidance**
- Use `Children.map` and `Children.toArray` when callers may pass mixed child shapes.
- Prefer `Children.only` for one-child APIs.

**Example**
```js
import { Children } from "react";

function Upper({ children }) {
  return Children.map(children, (child) =>
    typeof child === "string" ? child.toUpperCase() : child
  );
}
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`
- Coverage audit only: `agents/react/0.3.0.md`

#### memo
**Kind:** function

**Summary:** Memoizes a component to skip re-renders when props are equivalent.

**Definition**
```ts
function memo<P extends object>(
    Component: FunctionComponent<P>,
    propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): NamedExoticComponent<P>;
```

**Guidance**
- Use only when stable prop identities actually reduce downstream work.
- Pair with `useCallback` and `useMemo` when parents create new references.

**Example**
```js
import { memo } from "react";

const Row = memo(function Row({ item }) {
  return <div>{item.text}</div>;
});
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### forwardRef
**Kind:** function

**Summary:** Forwards a ref through a function component to an inner target.

**Definition**
```ts
function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

**Guidance**
- Use for reusable primitives that need imperative focus or measurement access.
- Keep the forwarded target stable and deliberate.

**Example**
```js
import { forwardRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} {...props} />;
});
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### lazy
**Kind:** function

**Summary:** Declares a lazily loaded component backed by dynamic import.

**Definition**
```ts
function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): LazyExoticComponent<T>;
```

**Guidance**
- The imported module must resolve to a default-exported component.
- Always pair with `Suspense`.

**Example**
```js
import { lazy, Suspense } from "react";

const Chart = lazy(() => import("./Chart"));
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### Suspense
**Kind:** component

**Summary:** Shows fallback UI while children suspend during loading or data resolution.

**Definition**
```ts
const Suspense: ExoticComponent<SuspenseProps>;
interface SuspenseProps {
    children?: ReactNode;
    fallback?: NonNullable<ReactNode> | null;
}
```

**Guidance**
- Use nested boundaries to stage loading.
- Keep fallbacks scoped and lightweight.

**Example**
```js
import { Suspense } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

### Core Hooks

#### useState
**Kind:** hook

**Summary:** Declares component-local state and returns the current value with a setter.

**Definition**
```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
```

**Guidance**
- Use lazy initialization for expensive initial values.
- Use functional updates when the next value depends on the previous one.

**Example**
```js
import { useState } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useEffect
**Kind:** hook

**Summary:** Synchronizes rendered output with external systems.

**Definition**
```ts
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

**Guidance**
- Keep dependency arrays complete.
- Return cleanup for subscriptions and external resources.

**Example**
```js
import { useEffect } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useContext
**Kind:** hook

**Summary:** Reads the nearest value for a given context.

**Definition**
```ts
function useContext<T>(context: Context<T>): T;
```

**Guidance**
- Pass the context object itself.
- Memoize provider values when object identity matters.

**Example**
```js
import { createContext, useContext } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useReducer
**Kind:** hook

**Summary:** Manages state transitions through a reducer and dispatched actions.

**Definition**
```ts
function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

**Guidance**
- Prefer for complex or action-driven state transitions.
- Keep reducers pure.

**Example**
```js
import { useReducer } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useRef
**Kind:** hook

**Summary:** Creates a stable mutable container whose current value persists across renders.

**Definition**
```ts
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
```

**Guidance**
- Use refs for DOM access and non-reactive mutable values.
- Updating `.current` does not schedule a render.

**Example**
```js
import { useRef } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

### Performance Hooks

#### useCallback
**Kind:** hook

**Summary:** Memoizes a callback and stabilizes its identity across renders.

**Definition**
```ts
function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
): T;
```

**Guidance**
- Use it when stable callback identity prevents meaningful downstream work.
- Apply the same dependency discipline as `useEffect`.

**Example**
```js
import { useCallback } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useMemo
**Kind:** hook

**Summary:** Memoizes a computed value until dependencies change.

**Definition**
```ts
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
```

**Guidance**
- Use for expensive computations or stable derived references.
- Skip it for trivial work.

**Example**
```js
import { useMemo } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useLayoutEffect
**Kind:** hook

**Summary:** Runs synchronously after DOM mutation and before paint.

**Definition**
```ts
function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
```

**Guidance**
- Reserve it for layout measurement or pre-paint DOM correction.
- Keep the work small to avoid blocking paint.

**Example**
```js
import { useLayoutEffect } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useTransition
**Kind:** hook

**Summary:** Marks updates as non-urgent transitions and exposes pending state.

**Definition**
```ts
function useTransition(): [boolean, TransitionStartFunction];
```

**Guidance**
- Keep urgent input updates outside the transition.
- Use pending state to communicate transition progress.

**Example**
```js
import { useTransition } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### startTransition
**Kind:** function

**Summary:** Starts a transition outside the `useTransition` hook API.

**Definition**
```ts
function startTransition(scope: () => void): void;
```

**Guidance**
- Use when a hook-local pending flag is unnecessary.
- Wrap only non-urgent state updates in the transition.

**Example**
```js
import { startTransition } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

### Advanced Hooks

#### useSyncExternalStore
**Kind:** hook

**Summary:** Subscribes React to an external mutable store in a concurrency-safe way.

**Definition**
```ts
function useSyncExternalStore<Snapshot>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => Snapshot,
    getServerSnapshot?: () => Snapshot
): Snapshot;
```

**Guidance**
- Use for external stores and browser subscriptions.
- Ensure snapshots remain stable unless the underlying store changes.

**Example**
```js
import { useSyncExternalStore } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useId
**Kind:** hook

**Summary:** Generates a stable unique ID suitable for server/client-consistent markup.

**Definition**
```ts
function useId(): string;
```

**Guidance**
- Use for accessibility relationships such as `htmlFor` and `aria-labelledby`.
- Use data-derived keys for lists instead of generated IDs.

**Example**
```js
import { useId } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

#### useDeferredValue
**Kind:** hook

**Summary:** Defers propagation of a fast-changing value so expensive work can lag behind urgent updates.

**Definition**
```ts
function useDeferredValue<T>(value: T): T;
```

**Guidance**
- Use the immediate value for urgent UI and the deferred value for expensive derivations.
- Pair it with memoized work such as filtering or sorting.

**Example**
```js
import { useDeferredValue } from "react";
```

**Source Notes**
- Source: `npm:@types/react@18.3.0/index.d.ts`

## Common Workflows

### Controlled input with optimized filtering (React 18+)
- when to use it:
  - text input drives expensive filtering or rendering
- ordered steps:
  1. keep the live input value in `useState`
  2. derive a lagged value with `useDeferredValue`
  3. derive expensive results with `useMemo`
  4. render the deferred results while preserving immediate typing responsiveness
- example:
  - combine `useState`, `useDeferredValue`, and `useMemo`
- common failure points:
  - using only one state value and forcing expensive list work on every keystroke

### Code-splitting a route or large component
- when to use it:
  - route transitions or large visualizations inflate the initial bundle
- ordered steps:
  1. ensure the target module has a default export
  2. import it with `lazy`
  3. wrap usage in `Suspense`
  4. choose a scoped fallback
- example:
  - lazy route component rendered inside a route-local `Suspense`
- common failure points:
  - named export only
  - lazy component rendered outside a `Suspense` boundary

## Pitfalls And Troubleshooting

### Missing key warning in lists
- likely cause:
  - mapped children are missing stable data-backed keys
- how to verify:
  - inspect the mapped render and confirm the outermost returned element has a deterministic key
- fix:
  - use a stable data ID instead of an index when the list can reorder

### memo does not stop re-renders
- likely cause:
  - parent props change identity on every render
- how to verify:
  - inspect callbacks, arrays, and object literals passed to the memoized child
- fix:
  - stabilize references with `useCallback` and `useMemo` only where it prevents real work

### Stale closure behavior in callbacks or effects
- likely cause:
  - dependency arrays are incomplete or state updates rely on captured stale values
- how to verify:
  - compare values used inside the closure against the dependency list
- fix:
  - use functional updates and complete dependency arrays

## Best Practices
- Prefer function components and hooks for new code.
- Keep definitions close to the underlying React contract.
- Use transitions and deferred values for interaction-heavy, expensive UIs.
- Reach for effects only when synchronizing with something outside render.
- Use context deliberately and memoize provider values when object identity matters.

## References
- official docs: https://react.dev
- react api reference (legacy): https://legacy.reactjs.org/docs/react-api.html
- hooks api reference (legacy): https://legacy.reactjs.org/docs/hooks-reference.html
- type declarations: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/v18/index.d.ts
- runtime package: https://www.npmjs.com/package/react/v/18.3.1
- release notes: https://react.dev/blog/2024/04/25/react-19-upgrade-guide

## Open Questions
- The local `parse/react.out` appears to include newer-era symbols, so it should remain a cross-check rather than a contract source for React `^18.3.0`.
