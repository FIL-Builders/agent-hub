# TypeScript Workflows

### Write a generic helper that preserves inference
- Use this when a helper’s output type should track its input type or callback output automatically.
1. Identify the true type relationship between arguments and return value.
2. Encode that relationship with one or two focused generic parameters.
3. Let the compiler infer generic arguments from the call site.
4. Avoid `any` and broad assertions that erase the relationship.
- Common failure points:
  - adding unused generic parameters
  - annotating callback arguments too broadly
  - forcing explicit type arguments when inference was already sufficient

```ts
function groupBy<T, K extends PropertyKey>(
  values: readonly T[],
  getKey: (value: T) => K,
): Record<K, T[]> {
  return values.reduce((acc, value) => {
    const key = getKey(value);
    (acc[key] ??= []).push(value);
    return acc;
  }, {} as Record<K, T[]>);
}
```

### Debug a narrowing failure without assertions
- Use this when the compiler still sees a union or `unknown` where your code expects one branch.
1. Identify what branches the compiler still thinks are possible.
2. Add a discriminant check, `typeof`, `instanceof`, or a type predicate.
3. Move repeated narrowing logic into a reusable predicate when needed.
4. Remove unnecessary assertions after the proof exists.
- Common failure points:
  - checking a property that is not a stable discriminant
  - hiding the real problem with `as`
  - forgetting that `unknown` must be narrowed before use

```ts
type ApiResult =
  | { ok: true; data: { id: string } }
  | { ok: false; error: string };

function readId(result: ApiResult): string | undefined {
  return result.ok ? result.data.id : undefined;
}
```

### Configure a type-check-only project with path aliases
- Use this when a bundler or runtime handles output and TypeScript should focus on checking.
1. Enable `strict`.
2. Set `noEmit: true`.
3. Choose `moduleResolution` to match the real environment.
4. Add `paths` only when the runtime or bundler is configured for the same aliases.
- Common failure points:
  - editor imports resolving while runtime imports fail
  - mixing `paths` with an incompatible runtime resolution model
  - assuming `module` implies the right `moduleResolution`

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "noEmit": true
  }
}
```
