# React API Groups

### Element Creation
**Exports**
- createElement
- cloneElement
- Fragment

Core factories and primitives for producing or reshaping React elements.

#### createElement
**Kind**
function

**Summary**
Programmatically creates a React element from a type, props object, and children.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: ReactNode[]
): ReactElement<P>;
```

**Guidance**
- Prefer JSX for everyday component authoring and reserve `createElement` for meta-frameworks, dynamic component factories, or non-JSX transforms.
- Supply stable `key` props when producing elements inside arrays so React can preserve identity correctly.
- The `type` parameter accepts intrinsic element names or component references; ensure the props object matches the chosen target.

**Example**
Language: javascript

```js
import React from "react";

const button = React.createElement(
  "button",
  { type: "button", onClick: () => alert("Hi") },
  "Click me"
);

export default function App() {
  return button;
}
```

#### cloneElement
**Kind**
function

**Summary**
Copies an existing React element while overriding props and optional children.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function cloneElement<P>(
    element: ReactElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
): ReactElement<P>;
```

**Guidance**
- Use `cloneElement` when you need to inject props into child elements you do not own directly, such as slot-like children passed through props.
- Be deliberate with `key` and `ref`; passing replacements changes identity or ref wiring.
- Prefer simpler composition patterns when possible, because cloning can obscure the data flow.

**Example**
Language: javascript

```js
import React, { cloneElement } from "react";

function AddClass({ child }) {
  if (!React.isValidElement(child)) {
    return child;
  }

  return cloneElement(child, { className: "highlight" });
}
```

#### Fragment
**Kind**
component

**Summary**
Groups multiple children without introducing an extra DOM element.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
const Fragment: FunctionComponent<{ children?: ReactNode | undefined }>;
```

**Guidance**
- Use the `<>...</>` shorthand by default and reach for `<Fragment>` when you need to attach a `key`.
- Keys belong on the fragment when mapping lists of fragment groups.
- Fragment is structural only; it does not change layout or accessibility semantics.

**Example**
Language: javascript

```js
import { Fragment } from "react";

function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <Fragment key={item.id}>
          <li>{item.label}</li>
          <li>{item.detail}</li>
        </Fragment>
      ))}
    </ul>
  );
}
```

### Component Helpers
**Exports**
- Children
- memo
- forwardRef
- lazy
- Suspense

Helpers for working with children, stable component identities, refs, and code-splitting boundaries.

#### Children
**Kind**
object

**Summary**
Provides utilities for counting, mapping, and normalizing the opaque `props.children` structure.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

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
- Use `Children.map` and `Children.toArray` when the caller may pass a single child, nested fragments, or falsy children.
- `Children.only` is useful for APIs that require exactly one child and should fail fast when the contract is violated.
- Normalizing children through `toArray` helps with stable key handling before rendering.

**Example**
Language: javascript

```js
import { Children } from "react";

function Upper({ children }) {
  return Children.map(children, (child) =>
    typeof child === "string" ? child.toUpperCase() : child
  );
}
```

#### memo
**Kind**
function

**Summary**
Wraps a component in shallow prop comparison to skip unnecessary re-renders.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function memo<P extends object>(
    Component: FunctionComponent<P>,
    propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): NamedExoticComponent<P>;
```

**Guidance**
- Use `memo` when a child re-renders frequently with stable props and the skipped work is meaningful.
- Pair `memo` with stable object, array, and callback references from the parent; otherwise the shallow comparison will miss.
- Prefer the default shallow comparison unless there is a clear, measured reason to provide a custom comparator.

**Example**
Language: javascript

```js
import { memo } from "react";

const Row = memo(
  function Row({ item }) {
    return <div>{item.text}</div>;
  },
  (prev, next) => prev.item.id === next.item.id
);

export default Row;
```

#### forwardRef
**Kind**
function

**Summary**
Allows a function component to receive a ref and forward it to an inner element or component.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

**Guidance**
- Use `forwardRef` for reusable primitives such as inputs, buttons, and focusable controls that need imperative access from parents.
- Keep the forwarded ref attached to the final public target element or pair it with `useImperativeHandle` to expose a narrowed imperative API.
- Do not add ref forwarding by default if the component has no legitimate imperative use case.

**Example**
Language: javascript

```js
import { forwardRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} {...props} />;
});
```

#### lazy
**Kind**
function

**Summary**
Declares a lazily loaded component backed by a dynamic `import()`.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): LazyExoticComponent<T>;
```

**Guidance**
- Ensure the imported module exposes a default export that resolves to the component.
- Always render lazy components inside a `Suspense` boundary with an appropriate fallback.
- Use lazy loading for routes or heavy components where bundle splitting improves startup or interaction costs.

**Example**
Language: javascript

```js
import { lazy, Suspense } from "react";

const Chart = lazy(() => import("./Chart"));

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <Chart />
    </Suspense>
  );
}
```

#### Suspense
**Kind**
component

**Summary**
Defines a boundary that shows fallback UI while child components or data dependencies suspend.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
const Suspense: ExoticComponent<SuspenseProps>;
interface SuspenseProps {
    children?: ReactNode;
    fallback?: NonNullable<ReactNode> | null;
}
```

**Guidance**
- Place `Suspense` around lazy components or data-aware children that can suspend, and pick fallbacks that match the scope of the pending work.
- Nest boundaries to create progressive loading sequences instead of one global spinner for the whole page.
- Keep fallbacks lightweight and structurally close to the pending content to minimize UI jumpiness.

**Example**
Language: javascript

```js
import { Suspense } from "react";
import ProfileDetails from "./ProfileDetails";
import ProfileTimeline from "./ProfileTimeline";

export default function Profile() {
  return (
    <Suspense fallback={<div>Fetching profile...</div>}>
      <ProfileDetails />
      <Suspense fallback={<div>Fetching timeline...</div>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}
```

### Core Hooks
**Exports**
- useState
- useEffect
- useContext
- useReducer
- useRef

State, effects, context consumption, reducer-driven state transitions, and mutable references.

#### useState
**Kind**
hook

**Summary**
Declares component-local state and returns the current value with a setter.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
```

**Guidance**
- Use lazy initialization when computing the initial value is expensive.
- Use functional updates when the next state depends on the previous state.
- Split unrelated state into separate hooks when it improves update locality and readability.

**Example**
Language: javascript

```js
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      {count}
    </button>
  );
}
```

#### useEffect
**Kind**
hook

**Summary**
Synchronizes rendered output with external systems such as subscriptions, network activity, and DOM integration.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

**Guidance**
- Include every reactive value used inside the effect in the dependency array.
- Return cleanup logic whenever the effect creates subscriptions, timers, listeners, or in-flight work that must be torn down.
- Prefer event handlers or derived render logic over effects when no external synchronization is needed.

**Example**
Language: javascript

```js
import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return <div>{user ? user.name : "Loading..."}</div>;
}
```

#### useContext
**Kind**
hook

**Summary**
Reads the nearest current value for a given React context.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useContext<T>(context: Context<T>): T;
```

**Guidance**
- Pass the context object itself, not a provider or the context value.
- Consumers re-render when the provided value changes, so memoize object-like provider values when necessary.
- Use context for tree-wide coordination, not as a default replacement for every prop.

**Example**
Language: javascript

```js
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Click</button>;
}
```

#### useReducer
**Kind**
hook

**Summary**
Manages state transitions through a reducer and dispatched actions.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

**Guidance**
- Prefer `useReducer` when transitions are complex, state fields are coupled, or updates are easiest to express as actions.
- Keep reducers pure and move side effects out into event handlers or effects.
- Use explicit action shapes so the reducer remains auditable and easy to extend.

**Example**
Language: javascript

```js
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <button onClick={() => dispatch({ type: "increment" })}>{state.count}</button>;
}
```

#### useRef
**Kind**
hook

**Summary**
Creates a stable mutable container whose `.current` value persists across renders without triggering re-renders.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
```

**Guidance**
- Use refs for DOM access, instance-like mutable values, and previous-value storage that should not affect rendering.
- Update refs from effects or event handlers rather than during render.
- Do not treat refs as reactive state; changing `.current` does not schedule a render.

**Example**
Language: javascript

```js
import { useEffect, useRef } from "react";

export default function FocusOnMount() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

### Performance Hooks
**Exports**
- useCallback
- useMemo
- useLayoutEffect
- useTransition
- startTransition

Tools for reference stability, expensive computations, synchronous layout work, and concurrent non-urgent updates.

#### useCallback
**Kind**
hook

**Summary**
Memoizes a callback so its function identity stays stable until dependencies change.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: DependencyList
): T;
```

**Guidance**
- Use `useCallback` when a stable function identity materially reduces downstream work or stabilizes another hook dependency.
- Dependency rules are the same as `useEffect`; include every reactive value used inside the callback.
- Do not add `useCallback` automatically when the downstream consumer does not care about function identity.

**Example**
Language: javascript

```js
import { memo, useCallback, useState } from "react";

const Child = memo(function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
});

export default function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <>
      <button onClick={() => setCount((current) => current + 1)}>{count}</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

#### useMemo
**Kind**
hook

**Summary**
Memoizes a computed value and recomputes it only when dependencies change.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
```

**Guidance**
- Use `useMemo` for expensive derived values or to stabilize object and array identities passed into memoized consumers.
- Keep the dependency list accurate so the memoized value stays synchronized with inputs.
- Avoid it for cheap calculations because memoization adds its own maintenance cost.

**Example**
Language: javascript

```js
import { useMemo } from "react";

function SortedList({ list, sortFn }) {
  const sortedList = useMemo(() => [...list].sort(sortFn), [list, sortFn]);

  return <ul>{sortedList.map((item) => <li key={item}>{item}</li>)}</ul>;
}
```

#### useLayoutEffect
**Kind**
hook

**Summary**
Runs an effect synchronously after DOM mutation and before the browser paints.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
```

**Guidance**
- Prefer `useEffect` unless you need layout measurement or synchronous DOM correction before paint.
- Keep work inside `useLayoutEffect` small because it blocks painting.
- Use it for measurement-driven positioning or visual adjustments that would otherwise flicker.

**Example**
Language: javascript

```js
import { useLayoutEffect, useRef, useState } from "react";

function MeasureElement() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  return <div ref={ref}>My width is: {width}px</div>;
}
```

#### useTransition
**Kind**
hook

**Summary**
Marks state updates as non-urgent transitions and exposes pending state.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useTransition(): [boolean, TransitionStartFunction];
```

**Guidance**
- Use the returned `startTransition` for updates whose results can lag behind urgent input or cursor movement.
- Read `isPending` to surface loading or in-progress UI during the transition.
- Keep urgent state such as the current input value outside the transition and defer the expensive downstream work.

**Example**
Language: javascript

```js
import { useState, useTransition } from "react";

function SearchComponent({ data }) {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const value = event.target.value;
    setInputValue(value);
    startTransition(() => {
      setQuery(value);
    });
  }

  return (
    <>
      <input value={inputValue} onChange={handleChange} />
      {isPending ? <p>Filtering...</p> : <List query={query} data={data} />}
    </>
  );
}
```

**Since**
18.0.0

#### startTransition
**Kind**
function

**Summary**
Triggers a transition outside of the `useTransition` hook API.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function startTransition(scope: () => void): void;
```

**Guidance**
- Use `startTransition` from event handlers or utility layers when a hook-local `isPending` value is unnecessary.
- Wrap only the non-urgent state updates inside the provided callback.
- If you need pending state for UI, prefer `useTransition` instead.

**Example**
Language: javascript

```js
import { startTransition } from "react";

function navigateTo(url, setHistory) {
  startTransition(() => {
    setHistory((previous) => [...previous, url]);
  });
}
```

**Since**
18.0.0

### Advanced Hooks
**Exports**
- useSyncExternalStore
- useId
- useDeferredValue

Hooks for external store subscriptions, stable hydration-safe IDs, and deferred value propagation.

#### useSyncExternalStore
**Kind**
hook

**Summary**
Subscribes to an external mutable store in a way that is safe for concurrent rendering.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useSyncExternalStore<Snapshot>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => Snapshot,
    getServerSnapshot?: () => Snapshot
): Snapshot;
```

**Guidance**
- Use it for libraries or integration layers that bridge React to external mutable stores or browser APIs.
- Ensure `subscribe` returns a cleanup function and `getSnapshot` returns a stable value unless the store actually changed.
- Prefer higher-level application hooks on top of this primitive for app-facing ergonomics.

**Example**
Language: javascript

```js
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

export default function OnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <span>{isOnline ? "Online" : "Offline"}</span>;
}
```

**Since**
18.0.0

#### useId
**Kind**
hook

**Summary**
Generates a stable unique ID that stays consistent across server and client renders.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useId(): string;
```

**Guidance**
- Use `useId` for relationships like `htmlFor`, `aria-labelledby`, and related accessibility attributes.
- Derive related IDs by suffixing the base ID instead of calling `useId` repeatedly for the same logical cluster.
- Do not use the generated value as a list key; keys should come from the data model.

**Example**
Language: javascript

```js
import { useId } from "react";

function InputField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
```

**Since**
18.0.0

#### useDeferredValue
**Kind**
hook

**Summary**
Defers propagation of a rapidly changing value so expensive work can lag behind urgent updates.

**Definition**
Language: typescript
Source: npm:@types/react@18.3.0/index.d.ts

```ts
function useDeferredValue<T>(value: T): T;
```

**Guidance**
- Use the immediate value for urgent UI feedback and the deferred value for expensive filtering, sorting, or rendering.
- Combine `useDeferredValue` with memoized calculations to keep heavy derivations scoped to the lagged value.
- Think of it as concurrency-aware deferral rather than time-based debouncing.

**Example**
Language: javascript

```js
import { useDeferredValue, useMemo, useState } from "react";

function Search({ items }) {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  const results = useMemo(() => {
    return items.filter((item) => item.includes(deferredText));
  }, [deferredText, items]);

  return (
    <>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <ResultsList results={results} />
    </>
  );
}
```

**Since**
18.0.0
