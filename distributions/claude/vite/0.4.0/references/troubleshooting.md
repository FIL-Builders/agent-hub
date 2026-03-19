# Vite Troubleshooting

### Env Variable Missing In Client Code

**Cause**
The variable is not exposed by the configured prefix or the code is mixing
config-time env loading with app-time `import.meta.env` usage.

**Fix**
Check `envPrefix`, confirm the variable is intentionally exposed, and keep
`loadEnv(...)` for config-time logic while using `import.meta.env` in app code.

### Works In Dev, Fails In Build

**Cause**
The dev server and production build do not execute the same pipeline in the
same way, so plugin timing, env handling, SSR assumptions, or asset resolution
may diverge.

**Fix**
Treat the build as its own debugging target and re-check plugin hooks, asset
paths, alias resolution, mode-specific config, and SSR assumptions.

### SSR Crash On Browser Global

**Cause**
Code that assumes browser globals is running during SSR evaluation or build-time
execution.

**Fix**
Re-check the server/client boundary and keep browser-only code behind explicit
client/runtime guards or framework-specific client entry points.

### Alias Works In One Tool But Not Another

**Cause**
The alias was configured for one tool boundary but not for another, such as
Vite config vs TypeScript path mapping vs runtime tooling.

**Fix**
Re-check which tool owns the failing resolution path and configure each alias
system explicitly instead of assuming one setting propagates everywhere.
