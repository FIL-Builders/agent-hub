# Docusaurus Troubleshooting

### Internal links or assets break after deployment
**Cause**
`url` or `baseUrl` is wrong, or page code hard-coded root-relative paths instead of using Docusaurus helpers.

**Fix**
- Verify `url` and `baseUrl` in config first.
- Replace hard-coded internal paths with `Link` or `useBaseUrl(...)`.
- Test with built output, not just the dev server.

### Browser-only code fails under SSR or hydration
**Cause**
The code assumes `window`, layout width, or theme state is stable before hydration.

**Fix**
- Handle `useWindowSize()` returning `"ssr"`.
- Move browser-only access behind effects or client guards.
- Keep plugin lifecycle logic out of runtime components.

### Plugin logic ended up inside page code
**Cause**
The task mixed build-time data generation with runtime React behavior.

**Fix**
- Move data loading to `loadContent`.
- Create routes or serialized data in `contentLoaded`.
- Keep page components focused on rendering already-prepared data.

### A solution proposes `@site/...` or swizzled files as upstream API
**Cause**
The answer confused local project code with stable Docusaurus package exports.

**Fix**
- Treat `@site/...` as project-local.
- Treat swizzled files as local copies with upgrade drift risk.
- Re-anchor the answer on real package exports or documented lifecycle methods.
