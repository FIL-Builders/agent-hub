# TypeScript Overview

## Snapshot

- Spec name: typescript
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^5.9.3
- Primary language: typescript
- Homepage: https://www.typescriptlang.org/docs/
- Source set: npm:typescript@5.9.3 standard library declarations, official handbook pages, official TSConfig reference pages, TypeScript release notes for `satisfies`, parse/tsconfig.json as a local config anchor, and parse/typescript-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- typescript
- type-system
- compiler
- tsconfig
- generics
- module-resolution
- inference

## Purpose

This pack teaches an agent to use TypeScript 5.9 effectively for generic API design, narrowing, inference, utility types, module-resolution debugging, and `tsconfig` decisions while keeping language semantics, compiler behavior, and runtime behavior clearly separated.

## Guiding Principles

- Treat TypeScript as a static-analysis and type-modeling system, not as runtime validation.
- Use generics only when they express a real relationship between inputs and outputs.
- Prefer narrowing and discriminated unions over repeated assertions.
- Use `unknown` at trust boundaries and convert it into specific types with proof.
- Let inference do work before adding explicit annotations that may over-constrain a design.
- Match `moduleResolution` and path aliasing to the real runtime or bundler instead of assuming compiler settings alone solve import problems.
- Prefer `strict: true` unless there is a deliberate migration reason not to.

## Boundary Notes

- Source material: official TypeScript handbook pages for generics, `keyof`, conditional types, narrowing, and the `satisfies` operator; official TSConfig reference pages for `strict`, `moduleResolution`, `paths`, and `noEmit`; and `npm:typescript@5.9.3:package/lib/lib.es5.d.ts` for utility-type contracts.
- Coverage is intentionally centered on high-value TypeScript language and compiler behavior rather than the compiler API or language-service internals.
- The pack treats language constructs, utility types, and compiler options as first-class primitives because they are the most useful surfaces for agent task performance in ordinary TypeScript repos.
- `parse/tsconfig.json` was used only as a small local anchor for config examples, not as the primary contract source.
- The strongest boundary in this pack is between type-system guarantees and runtime guarantees; many real task failures come from collapsing those two.

## FAQ

### Should I use `any` or `unknown` for external input?
Use `unknown` unless you deliberately want to opt out of checking. `unknown` keeps the boundary honest and forces narrowing.

### Does `paths` rewrite imports in emitted JavaScript?
No. It changes TypeScript’s lookup behavior. The runtime or bundler still needs matching alias support.

### Is `satisfies` the same as `as`?
No. `satisfies` checks compatibility while preserving specific inference. `as` asserts a type without proof.

### Should I annotate every intermediate variable?
No. Prefer inference unless an explicit annotation improves clarity, constrains a public contract, or prevents unintended widening.

## External Resources

- Generics handbook: https://www.typescriptlang.org/docs/handbook/2/generics.html
- keyof handbook: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
- Conditional types handbook: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- Narrowing handbook: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
- TSConfig reference: https://www.typescriptlang.org/tsconfig
