# FastAPI Documentation Pack

## Snapshot
- Library: fastapi
- Target version: ^0.135.1
- Generated: 2026-03-12
- Primary sources:
  - pypi:fastapi==0.135.1 package contents
  - https://fastapi.tiangolo.com/tutorial/
  - https://fastapi.tiangolo.com/tutorial/dependencies/
  - https://fastapi.tiangolo.com/async/
  - https://fastapi.tiangolo.com/tutorial/response-model/
  - https://fastapi.tiangolo.com/tutorial/background-tasks/
  - https://fastapi.tiangolo.com/tutorial/metadata/
  - https://fastapi.tiangolo.com/advanced/custom-response/
- Local inputs:
  - prompts/codex-generate-fastapi-agent-v0.4.1.md
  - prompts/codex-agent-pack-runbook-v0.4.0.md

## Version Delta Audit
- No earlier FastAPI pack exists in this repo, so this is a fresh pack.
- Current stale mental models to avoid:
  - treating FastAPI validation as arbitrary runtime validation detached from request parsing and docs generation
  - treating sync and async handlers as stylistic equivalents
  - treating generic Starlette or ASGI knowledge as sufficient without FastAPI response-model and dependency semantics
  - treating third-party auth or ORM integrations as FastAPI core API

## Ecosystem Boundary Audit
- Core FastAPI surface:
  - `FastAPI`, `APIRouter`, parameter helpers, dependencies, exceptions, background tasks, request/response modeling, OpenAPI generation
- Underlying framework surface:
  - Starlette request, response, middleware, WebSocket, and status internals
- Model layer surface:
  - Pydantic-powered request/response model validation and serialization semantics
- Out of scope unless explicitly requested:
  - SQLAlchemy/ORM patterns
  - Celery/task queues
  - auth libraries beyond FastAPI's own `Security(...)` integration surface

## Source Inventory By Role
- Contract source:
  - `fastapi/__init__.py`
  - `fastapi/applications.py`
  - `fastapi/routing.py`
  - `fastapi/param_functions.py`
  - `fastapi/background.py`
  - `fastapi/exceptions.py`
  - `fastapi/requests.py`
- Guidance source:
  - FastAPI tutorial, dependencies, async, response model, metadata, and background task docs
- Workflow source:
  - tutorial and advanced docs pages for request handling, dependencies, responses, and docs generation
- Migration source:
  - version-specific package contents and docs, no legacy repo baseline
- Cross-check only:
  - none

## Public Surface Inventory

### App And Routing
- `FastAPI`
- `APIRouter`
- `HTTPException`
- `status`

### Request Data And Validation
- `Query`
- `Path`
- `Body`
- `Form`
- `File`
- `UploadFile`

### Dependencies And Execution
- `Depends`
- `Security`
- `BackgroundTasks`
- `Request`
- async path operations
- sync path operations

### Response And OpenAPI Semantics
- `response_model`
- `status_code`
- `responses`
- `tags`

## Decision Rules
- Use `FastAPI()` to define the app and top-level docs/OpenAPI metadata.
- Use `APIRouter` to group related endpoints, tags, and shared dependencies.
- Use typed function parameters plus `Query`, `Path`, `Body`, `Form`, and `File` to tell FastAPI where data comes from and how it should be validated.
- Use `Depends(...)` for request-time composition, not for arbitrary service-locator patterns.
- Use `Security(...)` only when the dependency participates in security scopes/OpenAPI security semantics.
- Use `response_model` when output shape and generated docs must stay aligned even if handler internals return richer objects.
- Prefer `async def` only when the handler or called stack actually benefits from async IO. Use plain `def` when the work is synchronous.

## Failure Modes
- Returning data that does not match `response_model` and assuming FastAPI will silently pass it through.
- Putting blocking synchronous work inside `async def` handlers.
- Repeating dependency logic manually instead of using `Depends(...)` and sub-dependencies.
- Confusing Starlette response classes or middleware behavior with FastAPI request parsing and OpenAPI generation semantics.
- Assuming type hints alone are enough without parameter-source helpers or response-model configuration.

## Workflow Preconditions
- Decide sync vs async before wiring dependencies and downstream libraries.
- Decide whether the route should expose a response contract in OpenAPI.
- Decide whether validation belongs in request parsing, model validation, or custom application logic.

## Common Confusions
- FastAPI vs Starlette:
  - FastAPI adds request parsing, dependency injection, model-driven validation, and docs generation on top of Starlette.
- Type hints vs framework validation:
  - type hints help define the contract, but FastAPI also needs parameter-source context and response-model semantics.
- `Depends(...)` vs ordinary helper calls:
  - dependencies run inside FastAPI's request lifecycle and can be cached per request.
- `async def` vs `def`:
  - they are not interchangeable when the body performs blocking work.

## Do
- Use `APIRouter` to structure larger applications.
- Keep request and response models explicit for public APIs.
- Reuse dependencies and sub-dependencies instead of copy-pasting auth or parsing logic.
- Use `BackgroundTasks` only for small post-response work that still belongs in-process.

## Avoid
- Treating third-party ORM or auth examples as FastAPI core semantics.
- Putting CPU-heavy or blocking code directly in `async def` handlers.
- Assuming docs correctness without reviewing `response_model`, `status_code`, `responses`, and `tags`.
- Treating request parsing, response serialization, and OpenAPI generation as unrelated concerns.

## Common Workflows

### Build A Typed Route
1. Create the app or router.
2. Add a path operation with typed parameters.
3. Use `Query`, `Path`, `Body`, `Form`, or `File` where source metadata matters.
4. Add `response_model` if the response contract should be enforced and documented.

### Reuse Auth Or Shared Request Logic
1. Write a dependency function.
2. Inject it with `Depends(...)` or `Security(...)`.
3. Reuse it at router or route level.
4. Keep scope-aware security in `Security(...)`, not plain `Depends(...)`.

### Fix Response And Docs Drift
1. Check the route decorator for `response_model`, `status_code`, `responses`, and `tags`.
2. Confirm the returned data matches the declared response model.
3. Re-check the generated OpenAPI/docs output.

## References
- https://fastapi.tiangolo.com/tutorial/
- https://fastapi.tiangolo.com/tutorial/dependencies/
- https://fastapi.tiangolo.com/async/
- https://fastapi.tiangolo.com/tutorial/response-model/
- https://fastapi.tiangolo.com/tutorial/background-tasks/
- https://fastapi.tiangolo.com/tutorial/metadata/
- https://fastapi.tiangolo.com/advanced/custom-response/
