# TypeScript Documentation Pack

## Snapshot
- library name: typescript
- version or version range: ^5.9.3
- primary language: typescript
- homepage or canonical docs URL: https://www.typescriptlang.org/docs/
- short description: TypeScript is a typed superset of JavaScript centered on static analysis, type inference, narrowing, module resolution, and compiler configuration.
- source set summary: `npm:typescript@5.9.3` package contents, `lib.es5.d.ts` utility-type declarations, official handbook pages, official TSConfig reference pages, release notes for `satisfies`, and `parse/tsconfig.json` as a local config anchor

## What This Library Is For
TypeScript helps agents reason about static contracts in JavaScript codebases: generic relationships, narrowing, inferred types, module resolution, and compiler behavior. The highest-value tasks are fixing compiler errors, designing type-safe APIs, choosing the right `tsconfig` options, and avoiding false assumptions about what the type system can and cannot guarantee at runtime.

Major use cases:
- designing reusable generic functions and types
- debugging narrowing, inference, and assignability failures
- configuring project compilation and module resolution
- understanding what `tsconfig` options actually change

Scope and boundaries:
- this pack covers the TypeScript language, compiler behavior, and important `tsconfig` options
- this pack does not treat framework-specific helpers as TypeScript core surface
- this pack does not treat runtime validation libraries as part of TypeScript
- this pack keeps compiler behavior separate from Node.js runtime behavior and bundler behavior

## Installation And Setup
- install commands:
  - `npm install --save-dev typescript`
- environment prerequisites:
  - Node.js tooling capable of running `tsc`
  - a project with source files and a clear module/runtime target
- configuration prerequisites:
  - decide whether the project is type-check-only or also emits JavaScript
  - decide how modules are resolved in the actual runtime or bundler
  - prefer strictness settings that match the team’s tolerance for migration churn
- minimum setup example:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

## Core Concepts

### Type space versus runtime space
- TypeScript types disappear at runtime.
- A type annotation changes checking, not emitted JavaScript semantics.
- Runtime validation still needs runtime code.

### Inference as the default engine
- TypeScript often produces better results when it can infer from values and relationships.
- Over-annotating intermediate values can freeze types too early.
- Good generic APIs preserve inference rather than fighting it.

### Narrowing as proof, not assertion
- `unknown`, unions, discriminants, and type predicates all work by proving facts.
- Assertions bypass proof and should be the exception.
- Narrowing quality often decides whether a codebase stays maintainable.

### Compiler configuration is behavior
- `strict`, `moduleResolution`, `paths`, and `noEmit` are not cosmetic flags.
- They materially change error surfaces and how imports are interpreted.
- Config should follow the actual runtime and tooling model, not the other way around.

## Version Delta Audit
- prior version or prior pack target: no prior TypeScript pack exists in this repo
- current locked version: `^5.9.3`
- major changes that affect agent behavior:
  - modern TypeScript leans heavily on inference, narrowing, and strict-mode workflows
  - `satisfies` is part of the practical type-design toolbox and should be used instead of some historical assertion-heavy patterns
  - modern module-resolution choices must reflect the project’s actual environment, especially `bundler`, `node16`, or `nodenext`
- outdated assumptions that must not carry forward:
  - types do not provide runtime validation
  - path aliases do not magically change runtime resolution unless the runtime or bundler is configured for them
  - setting `module` alone is not enough to describe module resolution behavior
  - broad `as` assertions are not a substitute for proper narrowing

## Decision Rules
- Use generics when the output type depends on the input type.
- Avoid adding generic parameters that do not participate in a real relationship.
- Use `unknown` for untrusted values at the boundary, then narrow.
- Prefer type predicates or discriminated unions over repeated assertions.
- Use `satisfies` when you want to validate a value against a shape without widening away useful literal information.
- Use utility types like `Partial`, `Omit`, `ReturnType`, and `Awaited` when the built-in semantics match exactly; do not rebuild them ad hoc.
- Use `strict: true` unless migration constraints make that impossible.
- Choose `moduleResolution` to match the real execution environment or bundler.
- Use `paths` for compiler-side aliasing only when the rest of the toolchain agrees on the same aliases.
- Use `noEmit` for type-check-only workflows; do not assume it affects editor analysis only.

## Ecosystem Boundaries
- core TypeScript surface:
  - language constructs such as generics, `keyof`, conditional types, type predicates, and `satisfies`
  - built-in utility types from the standard library declarations
  - compiler options such as `strict`, `moduleResolution`, `paths`, and `noEmit`
- adjacent but separate surfaces:
  - Node.js runtime resolution and package execution behavior
  - bundler behavior from tools like Vite, Webpack, or esbuild
  - framework-specific type helpers from React, Next.js, Vue, etc.
  - runtime schema-validation libraries such as Zod or io-ts
- intentionally out of scope for this pack:
  - TypeScript compiler API internals
  - language service plugin authoring
  - framework-specific typing conventions beyond brief boundary notes

## Preconditions And Invariants
- Type relationships are static; runtime code must still enforce runtime facts.
- Generic parameters should encode real relationships, not just rename `any`.
- Narrowing only works if control flow or user-defined predicates actually establish evidence.
- `paths` changes compiler lookup, not emitted import specifiers.
- `moduleResolution` must agree with the project’s runtime or bundler to avoid confusing import errors.
- `noEmit` prevents JavaScript output but does not disable type-checking.

## Public Surface Area

### Type relationships

#### Generics
**Kind:** type

**Summary:** Generic parameters let one type or function express a relationship between multiple positions.

**Definition**
```ts
function identity<T>(value: T): T;
type Box<T> = { value: T };
```

**Guidance**
- Use when return types, callback types, or container shapes must track the input type.
- Avoid generics that do not influence any other type position.
- Good generic APIs preserve inference from arguments.

**Example**
```ts
function first<T>(values: readonly T[]): T | undefined {
  return values[0];
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/generics.html
- Contract is condensed from the handbook’s generic function model

#### keyof
**Kind:** other

**Summary:** `keyof` produces the union of valid property keys for a type.

**Definition**
```ts
type Keys<T> = keyof T;
```

**Guidance**
- Use to constrain property-name parameters or derive key unions.
- Combine with indexed access types for property-safe helpers.
- Remember that index signatures widen the resulting key union.

**Example**
```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
- Contract is the canonical operator form from the handbook

#### Conditional Types
**Kind:** type

**Summary:** Conditional types choose one type branch or another based on assignability.

**Definition**
```ts
type Result<T> = T extends SomeConstraint ? A : B;
```

**Guidance**
- Use for relationship-heavy helpers where the output depends on the input type.
- Watch for distributive behavior when the checked type is a naked type parameter.
- Prefer small, named conditional helpers over deeply nested one-off types.

**Example**
```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- Condensed from the handbook’s canonical conditional-type form

#### infer
**Kind:** other

**Summary:** `infer` introduces a type variable inside a conditional type so a type can be extracted from structure.

**Definition**
```ts
type ElementType<T> = T extends Array<infer U> ? U : T;
```

**Guidance**
- Use inside conditional types when you need to pull out a nested type.
- Keep inferred variables local to one focused helper to preserve readability.
- If inference becomes opaque, split the helper into smaller named types.

**Example**
```ts
type AsyncValue<T> = T extends Promise<infer U> ? U : T;
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- Pattern is derived from the handbook’s `infer` examples

#### satisfies
**Kind:** other

**Summary:** `satisfies` checks that a value conforms to a target type without forcing the value itself to widen to that type.

**Definition**
```ts
const routes = {
  home: "/",
  about: "/about",
} satisfies Record<string, `/${string}`>;
```

**Guidance**
- Use when you want shape validation while preserving specific literal inference.
- Prefer over broad assertions when defining config objects or constant maps.
- Remember it checks compatibility; it does not change runtime behavior.

**Example**
```ts
const palette = {
  primary: "#3178c6",
  danger: "#d14343",
} satisfies Record<string, `#${string}`>;
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
- Feature remains part of the current TypeScript 5.9 toolset

### Narrowing and soundness

#### unknown
**Kind:** type

**Summary:** `unknown` represents an untrusted value that must be narrowed before specific operations are allowed.

**Definition**
```ts
let value: unknown;
```

**Guidance**
- Use at trust boundaries such as JSON input, external messages, or unsafe APIs.
- Narrow with `typeof`, `instanceof`, discriminants, or user-defined predicates before use.
- Prefer over `any` when the value really is unknown.

**Example**
```ts
function parsePort(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  throw new Error("Expected a string or number");
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
- Usage model also reinforced by the narrowing handbook

#### Type Predicates
**Kind:** other

**Summary:** A user-defined type predicate tells the compiler what a successful runtime check proves.

**Definition**
```ts
function isFoo(value: unknown): value is Foo;
```

**Guidance**
- Use when the same narrowing logic is reused in multiple call sites.
- The predicate must accurately describe the runtime check; lying predicates create unsound code.
- Prefer small, composable predicates over one giant catch-all guard.

**Example**
```ts
type User = { id: string; name: string };

function isUser(value: unknown): value is User {
  return !!value &&
    typeof value === "object" &&
    "id" in value &&
    "name" in value;
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
- Contract is the canonical predicate signature form from the handbook

#### Discriminated Unions
**Kind:** type

**Summary:** A discriminated union uses a shared literal field to make branching and exhaustiveness checking reliable.

**Definition**
```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };
```

**Guidance**
- Use a single stable discriminant such as `kind`, `type`, or `status`.
- Prefer discriminants over structurally ambiguous unions when control flow matters.
- Exhaustive `switch` statements are easier to maintain than chains of assertions.

**Example**
```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
- Condensed from the handbook’s narrowing model

### Built-in utility types

#### Partial
**Kind:** type

**Summary:** `Partial<T>` makes every property on `T` optional.

**Definition**
```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

**Guidance**
- Use for patch-style updates or builder APIs, not for fully validated domain objects.
- Remember that optional properties can still be present with `undefined`.
- Avoid using `Partial<T>` as a blanket substitute for domain-specific input models.

**Example**
```ts
type User = { id: string; name: string; email: string };
type UserPatch = Partial<User>;
```

**Source Notes**
- Source: `npm:typescript@5.9.3:package/lib/lib.es5.d.ts`
- Exact declaration from the standard library

#### Omit
**Kind:** type

**Summary:** `Omit<T, K>` removes a set of keys from `T`.

**Definition**
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

**Guidance**
- Use when you want a type that mirrors another one except for known exclusions.
- Keep omitted-key lists small and explicit to preserve readability.
- Prefer `Omit` over hand-written copies that drift from the source type.

**Example**
```ts
type User = { id: string; name: string; passwordHash: string };
type PublicUser = Omit<User, "passwordHash">;
```

**Source Notes**
- Source: `npm:typescript@5.9.3:package/lib/lib.es5.d.ts`
- Exact declaration from the standard library

#### ReturnType
**Kind:** type

**Summary:** `ReturnType<T>` extracts the return type of a function type.

**Definition**
```ts
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
```

**Guidance**
- Use to derive result types from existing function signatures without duplication.
- Prefer when the function signature is the single source of truth.
- Avoid applying it to overly broad function unions if the result becomes unreadable.

**Example**
```ts
function buildConfig() {
  return { strict: true, noEmit: true };
}

type BuildConfig = ReturnType<typeof buildConfig>;
```

**Source Notes**
- Source: `npm:typescript@5.9.3:package/lib/lib.es5.d.ts`
- Exact declaration from the standard library

#### Awaited
**Kind:** type

**Summary:** `Awaited<T>` recursively unwraps promise-like values the same way `await` does.

**Definition**
```ts
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ?
    F extends ((value: infer V, ...args: infer _) => any) ? Awaited<V> : never :
  T;
```

**Guidance**
- Use for helpers that need the resolved value type of async or promise-like inputs.
- Remember that `Awaited<T>` is recursive and models nested promise unwrapping.
- Prefer it over hand-written promise-unwrapping helpers when the built-in behavior matches your need.

**Example**
```ts
async function loadUser() {
  return { id: "u1", name: "Ada" };
}

type LoadedUser = Awaited<ReturnType<typeof loadUser>>;
```

**Source Notes**
- Source: `npm:typescript@5.9.3:package/lib/lib.es5.d.ts`
- Exact declaration from the standard library

### Compiler configuration

#### strict
**Kind:** config

**Summary:** `strict` enables the main family of TypeScript strictness checks as a bundle.

**Definition**
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Guidance**
- Use as the default baseline unless a migration plan requires staged adoption.
- Expect more precise errors around nullability, function parameters, and unchecked assumptions.
- Document any strictness opt-outs explicitly instead of silently weakening the whole project.

**Example**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true
  }
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/tsconfig#strict
- Configuration semantics summarized from the TSConfig reference

#### moduleResolution
**Kind:** config

**Summary:** `moduleResolution` chooses how the compiler interprets import specifiers and package lookup rules.

**Definition**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

**Guidance**
- Match this option to the real environment: bundler, Node.js ESM/CJS compatibility, or hybrid package rules.
- Do not assume that `module` alone selects the right module-resolution strategy.
- Many confusing import errors come from a mismatch between compiler assumptions and the actual runtime or bundler.

**Example**
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/tsconfig#moduleResolution
- Guidance summarized from the TSConfig reference

#### paths
**Kind:** config

**Summary:** `paths` remaps import specifiers for compiler lookup relative to `baseUrl` or project structure.

**Definition**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Guidance**
- Use only when the rest of the toolchain or runtime understands the same aliases.
- Remember that `paths` affects TypeScript resolution, not emitted import rewriting.
- Keep aliases simple and project-wide to reduce debugging overhead.

**Example**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/tsconfig#paths
- TSConfig reference; behavior summarized for agent use

#### noEmit
**Kind:** config

**Summary:** `noEmit` tells TypeScript to type-check without writing JavaScript, declaration, or source-map output.

**Definition**
```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

**Guidance**
- Use for repos where another tool handles transpilation or bundling and `tsc` is only a checker.
- Prefer this in editor-driven or CI type-check workflows when emitted output would be thrown away.
- Do not expect it to reduce the semantic scope of checking; it only affects file emission.

**Example**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true
  }
}
```

**Source Notes**
- Source: https://www.typescriptlang.org/tsconfig#noEmit
- TSConfig reference; behavior summarized for agent use

## Common Workflows

### Preserve inference in a generic helper
- when to use it:
  - when a helper’s output should stay coupled to its input type
- ordered steps:
  - model the relationship with a small number of generic parameters
  - let parameters infer from values instead of forcing explicit type arguments
  - avoid `any` and broad assertions that erase the relationship
- example:

```ts
function mapValues<T, R>(
  values: readonly T[],
  mapper: (value: T, index: number) => R,
): R[] {
  return values.map(mapper);
}
```

- common failure points:
  - adding a generic parameter that does not constrain anything
  - annotating the callback too broadly and losing inference

### Debug a narrowing failure
- when to use it:
  - when the compiler refuses property access on a union or `unknown`
- ordered steps:
  - identify what the compiler still considers possible
  - add evidence with `typeof`, discriminants, or a type predicate
  - remove unnecessary assertions after the proof exists
- example:

```ts
type ApiResult =
  | { ok: true; data: { id: string } }
  | { ok: false; error: string };

function readId(result: ApiResult): string | undefined {
  return result.ok ? result.data.id : undefined;
}
```

- common failure points:
  - checking a property that is not a stable discriminant
  - asserting first and losing the chance for the compiler to verify the branch

### Configure type-check-only builds
- when to use it:
  - when another tool emits JavaScript and `tsc` should only enforce correctness
- ordered steps:
  - enable `strict`
  - set `noEmit: true`
  - choose `moduleResolution` to match the real bundler or runtime
  - add `paths` only if the rest of the toolchain agrees
- example:

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

- common failure points:
  - mixing runtime aliases with compiler-only aliases
  - assuming the default module resolution matches the actual toolchain

## Common Confusions
- `satisfies` checks compatibility without widening; `as` asserts without proof.
- `unknown` is safe until narrowed; `any` opts out of checking.
- `module` chooses emit format assumptions; `moduleResolution` chooses import lookup behavior.
- `paths` helps the compiler find modules but does not rewrite runtime imports by itself.
- type predicates provide proof; return-type annotations alone do not narrow arbitrary values.

## Deprecated And Compatibility Surface
- no major TypeScript language surface in this pack is deprecated, but older assertion-heavy patterns should not be treated as preferred design.
- `as` remains legal and sometimes necessary, but it is compatibility-oriented for cases where narrowing or better modeling is unavailable.
- older module-resolution assumptions such as “Node-style resolution is always correct” are compatibility habits, not universal defaults.

## Pitfalls And Troubleshooting

### Property access fails on a union
- likely cause:
  - the branch has not narrowed to a shape that definitely contains the property
- how to verify:
  - inspect the union members and identify the missing proof
- fix:
  - add a discriminant check, `typeof`, `instanceof`, or a type predicate

### Path aliases work in the editor but fail at runtime
- likely cause:
  - `paths` was configured in TypeScript but not mirrored in the bundler or runtime
- how to verify:
  - inspect emitted import specifiers and runtime resolver configuration
- fix:
  - align the bundler/runtime alias configuration or stop using the alias

### A generic helper returns `unknown` or a wide type
- likely cause:
  - the generic relationship is not encoded clearly enough for inference
- how to verify:
  - inspect whether type parameters appear in both input and output positions
- fix:
  - redesign the signature so the compiler can infer the real relationship

## Best Practices
- start with inference, then add annotations only where they clarify or constrain meaning
- keep generic APIs small and relationship-focused
- prefer proof-based narrowing over assertions
- model compiler options around the actual runtime or bundler
- keep `tsconfig` aliases and runtime aliases aligned

## References
- https://www.typescriptlang.org/docs/handbook/2/generics.html
- https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator
- https://www.typescriptlang.org/tsconfig#strict
- https://www.typescriptlang.org/tsconfig#moduleResolution
- https://www.typescriptlang.org/tsconfig#paths
- https://www.typescriptlang.org/tsconfig#noEmit
- `npm:typescript@5.9.3:package/lib/lib.es5.d.ts`
- `parse/tsconfig.json`

## Open Questions
- Needs verification: whether a future follow-up pack should cover the compiler API and language service as a separate TypeScript subsystem instead of expanding this core language/compiler pack.
