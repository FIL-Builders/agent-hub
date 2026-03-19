# React Workflows

### Controlled input with optimized filtering (React 18+)
1. Use `useState` to keep the raw input value synchronized with the text field.
2. Pass that value through `useDeferredValue` to create a lagged query for heavy rendering work.
3. Use `useMemo` to derive the filtered list from the deferred value.
4. Render the immediate value in the input and the deferred results in the expensive list UI.

### Code-splitting a route or large component
1. Identify the route or component whose bundle cost is worth deferring.
2. Convert the target module to a default export if needed.
3. Load it through `lazy(() => import("./MyComponent"))`.
4. Wrap the render path in `Suspense`.
5. Choose a fallback that fits the scope of the delayed work.
