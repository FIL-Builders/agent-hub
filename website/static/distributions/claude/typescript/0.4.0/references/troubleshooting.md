# TypeScript Troubleshooting

### Property access fails on a union
**Cause**
- The branch has not narrowed to a shape that definitely owns the property.

**Fix**
- Inspect the union members, identify the missing proof, and add a discriminant check, `typeof`, `instanceof`, or a user-defined type predicate.

### Path aliases work in the editor but fail in the running app
**Cause**
- `paths` was configured in TypeScript but not mirrored in the runtime or bundler.

**Fix**
- Inspect emitted imports and runtime resolver configuration, then align the runtime alias configuration or stop using the alias.

### A generic helper returns a wide or useless type
**Cause**
- The type relationship is not encoded in both input and output positions.

**Fix**
- Inspect whether each generic parameter participates in a meaningful relationship, then simplify the signature so inference can re-derive the type arguments.

### Compiler errors changed after enabling strict mode
**Cause**
- Latent nullability, unchecked indexing, or incompatible function assumptions were previously hidden.

**Fix**
- Inspect which strict-mode rule category the error comes from, repair the actual type design, or add a narrow local escape hatch instead of disabling `strict`.
