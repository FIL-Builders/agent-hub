# FastAPI Troubleshooting

### Validation errors look wrong or incomplete
**Cause**
- The parameter source is not explicit enough, so FastAPI is parsing data from a different location than intended.
- The route's `response_model` no longer matches the returned data shape.

**Fix**
- Recheck whether the input should come from `Query`, `Path`, `Body`, `Form`, or `File`.
- Reconcile the returned value with the declared `response_model`.

### Dependency runs too often or not as expected
**Cause**
- `Depends(..., use_cache=False)` was set unintentionally or the dependency is being declared in more places than expected.
- A plain helper was modeled as a dependency, or a dependency was modeled as a plain helper, so request lifecycle semantics are off.

**Fix**
- Recheck `use_cache` and where the dependency is attached.
- Keep request-scoped composition in `Depends(...)` and move ordinary helper logic out of dependency injection.

### Async route feels wrong or blocks
**Cause**
- Blocking synchronous work is running inside an `async def` handler.
- The route style does not match the actual IO model of the called code.

**Fix**
- Move blocking work out of the async path or keep the handler synchronous.
- Align the handler style with the real execution behavior of dependencies and downstream libraries.

### Docs do not match runtime behavior
**Cause**
- `response_model`, `status_code`, `responses`, or `tags` drifted away from the route's actual behavior.
- Raised exceptions and declared responses no longer describe the same contract.

**Fix**
- Reconcile route decorator options with what the handler really returns and raises.
- Recheck generated docs after updating the response contract.
