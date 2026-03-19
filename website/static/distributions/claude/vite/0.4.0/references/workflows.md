# Vite Workflows

### Configure A Typed App Entry

1. Start with `defineConfig(...)`.
2. Add framework plugins explicitly.
3. Put aliasing in `resolve.alias`.
4. Keep `base` aligned with actual deployment path assumptions.
5. Use `loadEnv(...)` only when config-time logic needs raw env values.

### Diagnose Dev Vs Build Mismatches

1. Confirm whether the failure is in `vite`, `vite build`, or `vite preview`.
2. Check env exposure and mode-specific config first.
3. Review plugin ordering and whether the relevant hook runs in serve or build.
4. Re-check aliases and absolute path assumptions.
5. Treat SSR issues as a third category, not just "dev" or "build".

### Add A Narrow Plugin

1. Define the smallest possible `Plugin`.
2. Choose hook boundaries deliberately.
3. Limit file matching aggressively.
4. Avoid plugin logic that depends on framework runtime internals.
5. Test the plugin in serve and build separately.
