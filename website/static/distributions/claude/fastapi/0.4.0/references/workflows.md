# FastAPI Workflows

### Build A Typed CRUD Route
1. Create the app or router with `FastAPI` or `APIRouter`.
2. Define typed path parameters and request bodies with `Path`, `Query`, or `Body`.
3. Add a `response_model` so the response contract and docs stay aligned.
4. Use `HTTPException` and `status` constants to make error and success semantics explicit.

### Reuse Request-Time Logic With Dependencies
1. Write a dependency function that returns request-scoped context.
2. Inject it with `Depends(...)`.
3. Promote it to `Security(...)` if OpenAPI security scope semantics matter.
4. Reuse the dependency at router or route level instead of copying logic across handlers.

### Handle Post-Response Side Effects
1. Accept `BackgroundTasks` in the route signature.
2. Queue lightweight in-process work with `add_task(...)`.
3. Keep heavy or durable jobs out of `BackgroundTasks`.
