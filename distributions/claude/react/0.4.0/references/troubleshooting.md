# React Troubleshooting

### Warning: Each child in a list should have a unique key prop.
**Cause**
The rendered array is missing a stable `key`, or it uses a value that changes between renders.

**Fix**
Use a deterministic key from the underlying data model and place it on the outermost element returned by the map.

### Component re-renders even though it is wrapped in memo.
**Cause**
The parent passes new object, array, or callback references on each render.

**Fix**
Stabilize parent props with `useCallback` and `useMemo` when that stabilization prevents real re-render work.

### Stale state or props appear inside a callback or effect.
**Cause**
The callback or effect closed over outdated values because the dependency list is incomplete or the state update relied on a captured value.

**Fix**
Use functional state updates when the next value depends on the previous one and keep dependency arrays complete.
