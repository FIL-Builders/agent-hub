# FastAPI API Groups

### Application And Routing
**Exports**
- FastAPI
- APIRouter
- HTTPException
- status

Core application and routing primitives for defining an API surface.

#### FastAPI
**Kind**
class

**Summary**
Main application class and top-level entrypoint for defining routes, metadata, and generated API docs.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/applications.py

```python
from fastapi import FastAPI

app = FastAPI(
    title: str = "FastAPI",
    summary: str | None = None,
    description: str | None = None,
    version: str = "0.1.0",
    openapi_url: str | None = "/openapi.json",
    docs_url: str | None = "/docs",
    redoc_url: str | None = "/redoc",
)
```

**Guidance**
- Use this once per application to set metadata, docs URLs, and shared behavior.
- Keep app-level metadata accurate because it shapes generated OpenAPI output.
- Prefer routers for feature grouping instead of accumulating every path operation directly on the app.

**Example**
Language: python
Description: Create an app with custom OpenAPI metadata.

```python
from fastapi import FastAPI

app = FastAPI(
    title="Inventory API",
    version="1.0.0",
    summary="Internal service for inventory operations",
)
```

#### APIRouter
**Kind**
class

**Summary**
Route grouping primitive for structuring path operations, shared tags, prefixes, and dependencies.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/routing.py

```python
router = APIRouter(
    prefix: str = "",
    tags: list[str] | None = None,
    dependencies: Sequence[Depends] | None = None,
)
```

**Guidance**
- Use routers to group related endpoints and apply shared prefix, tags, and dependencies.
- Keep router-level dependencies narrow so unrelated endpoints do not inherit unnecessary work.
- Include routers into the app instead of duplicating shared metadata on every route.

**Example**
Language: python
Description: Group user endpoints under a shared prefix and tag.

```python
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def list_users():
    return [{"id": 1, "name": "Ada"}]
```

#### HTTPException
**Kind**
class

**Summary**
Raise an HTTP error response from application code with status, detail, and optional headers.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/exceptions.py

```python
HTTPException(
    status_code: int,
    detail: object | None = None,
    headers: Mapping[str, str] | None = None,
)
```

**Guidance**
- Raise this for client-facing error conditions such as not found, forbidden, or invalid input state.
- Put structured information in `detail` when clients need machine-readable error context.
- Do not use this to hide unexpected server bugs that should be logged and fixed.

**Example**
Language: python
Description: Return a 404 when a resource is not present.

```python
from fastapi import HTTPException

def get_item_or_404(item_id: str):
    item = None
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
```

#### status
**Kind**
object

**Summary**
Named HTTP and WebSocket status-code constants re-exported for readable route and exception code.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/__init__.py

```python
from starlette import status as status
```

**Guidance**
- Use named status constants instead of magic numbers for readability.
- Keep HTTP and WebSocket codes distinct; they serve different protocol surfaces.
- Use this module together with `HTTPException` and decorator `status_code` configuration.

**Example**
Language: python
Description: Use a named status constant in a route declaration.

```python
from fastapi import FastAPI, status

app = FastAPI()

@app.post("/items", status_code=status.HTTP_201_CREATED)
async def create_item():
    return {"ok": True}
```

### Request Data And Validation
**Exports**
- Query
- Path
- Body
- Form
- File
- UploadFile

Helpers and types that tell FastAPI where request data comes from and how it should be validated or parsed.

#### Query
**Kind**
function

**Summary**
Declare query-parameter extraction, defaults, aliases, and validation metadata.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Query(
    default: Any = Undefined,
    *,
    alias: str | None = None,
    title: str | None = None,
    description: str | None = None,
    gt: float | None = None,
    ge: float | None = None,
    lt: float | None = None,
    le: float | None = None,
)
```

**Guidance**
- Use this when request data comes from the query string and needs explicit validation or metadata.
- Keep aliases, constraints, and descriptions aligned with the public API contract.
- Use it with type annotations; it complements them rather than replacing them.

**Example**
Language: python
Description: Constrain a positive page-size query parameter.

```python
from typing import Annotated
from fastapi import Query

Limit = Annotated[int, Query(ge=1, le=100, description="Page size")]
```

#### Path
**Kind**
function

**Summary**
Declare validation and metadata for required path parameters.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Path(
    default: Any = ...,
    *,
    alias: str | None = None,
    title: str | None = None,
    description: str | None = None,
    gt: float | None = None,
    ge: float | None = None,
    lt: float | None = None,
    le: float | None = None,
)
```

**Guidance**
- Use this when the parameter is part of the route path and needs explicit constraints or metadata.
- Remember that path parameters are always required, even though the helper accepts compatibility-oriented defaults.
- Keep route parameter names and aliases deliberate because they shape docs and extraction.

**Example**
Language: python
Description: Restrict a positive integer ID in the path.

```python
from typing import Annotated
from fastapi import Path

ItemId = Annotated[int, Path(ge=1, description="Positive item identifier")]
```

#### Body
**Kind**
function

**Summary**
Declare request-body parsing details such as embedding and media type.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Body(
    default: Any = Undefined,
    *,
    embed: bool | None = None,
    media_type: str = "application/json",
)
```

**Guidance**
- Use this when body parsing needs explicit structure or metadata beyond a plain typed parameter.
- Reach for `embed=True` when the request contract should wrap a single field inside an object.
- Keep body modeling explicit when multiple body-related parameters are involved.

**Example**
Language: python
Description: Embed a single body field under a named key.

```python
from typing import Annotated
from fastapi import Body

Payload = Annotated[dict[str, str], Body(embed=True)]
```

#### Form
**Kind**
function

**Summary**
Declare form-field extraction from `application/x-www-form-urlencoded` request bodies.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Form(
    default: Any = Undefined,
    *,
    media_type: str = "application/x-www-form-urlencoded",
)
```

**Guidance**
- Use this for HTML form submissions and OAuth-style form payloads.
- Do not confuse it with JSON body parsing; the request media type and OpenAPI contract differ.
- Keep form and file inputs explicit when a route mixes multiple input styles.

**Example**
Language: python
Description: Accept login credentials from a form post.

```python
from typing import Annotated
from fastapi import Form

Username = Annotated[str, Form()]
Password = Annotated[str, Form()]
```

#### File
**Kind**
function

**Summary**
Declare file-content extraction and OpenAPI metadata for multipart uploads.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
File(
    default: Any = Undefined,
    *,
    media_type: str = "multipart/form-data",
)
```

**Guidance**
- Use this when the uploaded file should be read into memory as bytes.
- Prefer `UploadFile` for larger payloads or streaming-friendly handling.
- Keep multipart expectations explicit in route design and testing.

**Example**
Language: python
Description: Accept a small file as raw bytes.

```python
from typing import Annotated
from fastapi import File

AvatarBytes = Annotated[bytes, File()]
```

#### UploadFile
**Kind**
class

**Summary**
Uploaded-file abstraction that gives access to filename, content type, and streaming-friendly file operations.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/__init__.py

```python
from .datastructures import UploadFile as UploadFile
```

**Guidance**
- Use this for larger files or when you want file-like access instead of loading everything into memory.
- Treat it as upload metadata plus an underlying file object, not as bytes.
- Make storage and cleanup decisions explicit in the route or background work.

**Example**
Language: python
Description: Read upload metadata and save the file elsewhere.

```python
from fastapi import UploadFile

async def handle_upload(file: UploadFile) -> dict[str, str]:
    return {"filename": file.filename, "content_type": file.content_type or "unknown"}
```

### Dependencies And Execution Model
**Exports**
- Depends
- Security
- async path operation
- def path operation
- BackgroundTasks
- Request

Core FastAPI request-lifecycle primitives for dependency injection and execution behavior.

#### Depends
**Kind**
function

**Summary**
Declare a request-time dependency that FastAPI resolves and optionally caches within the request.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Depends(
    dependency: Callable[..., Any] | None = None,
    *,
    use_cache: bool = True,
)
```

**Guidance**
- Use this for reusable request-scoped composition such as auth context, pagination parsing, or shared services.
- Leave caching on unless the same dependency must re-run multiple times in one request.
- Treat dependencies as part of the framework contract, not as hidden global service resolution.

**Example**
Language: python
Description: Reuse a current-user dependency in a route.

```python
from typing import Annotated
from fastapi import Depends

async def get_current_user() -> dict[str, str]:
    return {"username": "ada"}

CurrentUser = Annotated[dict[str, str], Depends(get_current_user)]
```

#### Security
**Kind**
function

**Summary**
Dependency helper like `Depends(...)` with OpenAPI-aware security scope semantics.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/param_functions.py

```python
Security(
    dependency: Callable[..., Any] | None = None,
    *,
    scopes: Sequence[str] | None = None,
    use_cache: bool = True,
)
```

**Guidance**
- Use this when a dependency participates in documented security scopes or auth semantics.
- Prefer it over plain `Depends(...)` when the security relationship should appear in generated OpenAPI.
- Do not use it for non-security dependencies just because it looks similar.

**Example**
Language: python
Description: Inject a security dependency with required scope metadata.

```python
from typing import Annotated
from fastapi import Security

async def get_current_user() -> dict[str, str]:
    return {"username": "ada"}

ScopedUser = Annotated[dict[str, str], Security(get_current_user, scopes=["items:read"])]
```

#### async path operation
**Kind**
workflow

**Summary**
`async def` route handlers integrate naturally with async IO and awaitable dependencies inside FastAPI's request lifecycle.

**Definition**
Language: python
Source: https://fastapi.tiangolo.com/async/

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

**Guidance**
- Use `async def` when the handler awaits async libraries or multiple non-blocking operations.
- Avoid putting blocking synchronous work directly inside an async handler.
- Keep dependencies and downstream libraries consistent with the chosen execution model.

**Example**
Language: python
Description: Await an async repository call in a path operation.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

#### def path operation
**Kind**
workflow

**Summary**
Synchronous route handlers are valid FastAPI path operations and are appropriate for synchronous code paths.

**Definition**
Language: python
Source: https://fastapi.tiangolo.com/async/

```python
@app.get("/healthz")
def healthcheck():
    return {"ok": True}
```

**Guidance**
- Use plain `def` when the implementation and dependencies are synchronous.
- Do not convert everything to `async def` by habit if the called code is blocking and sync.
- Keep the handler style aligned with the actual IO model of the code underneath it.

**Example**
Language: python
Description: Keep a simple synchronous endpoint synchronous.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/healthz")
def healthcheck():
    return {"ok": True}
```

#### BackgroundTasks
**Kind**
class

**Summary**
Collection of in-process tasks executed after the response is sent.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/background.py

```python
class BackgroundTasks:
    def add_task(self, func: Callable[..., Any], *args, **kwargs) -> None: ...
```

**Guidance**
- Use this for small follow-up work that should happen after the response without blocking it.
- Keep tasks lightweight and in-process; use a real external queue for durable or heavy background work.
- Make file IO and retry behavior explicit because task failure semantics differ from route-return semantics.

**Example**
Language: python
Description: Queue a small post-response side effect.

```python
from fastapi import BackgroundTasks

def write_log_line(message: str) -> None:
    with open("audit.log", "a", encoding="utf-8") as f:
        f.write(message + "\n")

async def enqueue(background_tasks: BackgroundTasks) -> dict[str, bool]:
    background_tasks.add_task(write_log_line, "request completed")
    return {"queued": True}
```

#### Request
**Kind**
class

**Summary**
Request object re-export used when a route or dependency needs raw request access beyond typed parameter extraction.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/requests.py

```python
from starlette.requests import Request as Request
```

**Guidance**
- Use this when route logic needs raw headers, client info, or request state that does not belong in typed parameter extraction.
- Prefer typed parameters and dependencies first; reach for `Request` when lower-level access is actually needed.
- Keep in mind that this is a Starlette request object exposed through FastAPI.

**Example**
Language: python
Description: Inspect a header directly from the request.

```python
from fastapi import Request

async def read_request_id(request: Request) -> dict[str, str | None]:
    return {"request_id": request.headers.get("x-request-id")}
```

### Path Operation Configuration And OpenAPI
**Exports**
- response_model
- status_code
- responses
- tags

Decorator-level configuration that shapes runtime serialization behavior and generated OpenAPI output.

#### response_model
**Kind**
config

**Summary**
Path operation option that declares the response contract for serialization, filtering, validation, and generated OpenAPI schema.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/routing.py

```python
@router.get("/items/{item_id}", response_model=ItemOut)
async def read_item(item_id: int):
    ...
```

**Guidance**
- Use it when the public response shape should be enforced and documented even if internal objects contain more data.
- Keep it aligned with what the handler really returns; mismatches are contract errors, not harmless details.
- Prefer explicit response models for public APIs and reusable clients.

**Example**
Language: python
Description: Filter internal fields out of the returned object.

```python
from pydantic import BaseModel

class UserOut(BaseModel):
    username: str

@router.get("/users/{user_id}", response_model=UserOut)
async def read_user(user_id: int):
    return {"username": "ada", "password": "secret"}
```

#### status_code
**Kind**
config

**Summary**
Path operation option that sets the documented and returned success status code for the route.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/routing.py

```python
@router.post("/items", status_code=201)
async def create_item():
    ...
```

**Guidance**
- Use it to make the route's success semantics explicit in both runtime behavior and docs.
- Prefer named constants from `status` for readability when possible.
- Do not rely on default codes when the route's contract should communicate creation or no-content semantics clearly.

**Example**
Language: python
Description: Return a clear creation status for a POST endpoint.

```python
from fastapi import status

@router.post("/items", status_code=status.HTTP_201_CREATED)
async def create_item():
    return {"created": True}
```

#### responses
**Kind**
config

**Summary**
Path operation option that adds explicit OpenAPI response metadata beyond the default success contract.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/routing.py

```python
@router.get(
    "/items/{item_id}",
    responses={404: {"description": "Not found"}},
)
async def read_item(item_id: int):
    ...
```

**Guidance**
- Use this to document non-default responses and additional OpenAPI details.
- Keep it aligned with actual runtime behavior and raised exceptions.
- Do not use it as a substitute for consistent error handling.

**Example**
Language: python
Description: Document a not-found response explicitly.

```python
@router.get("/items/{item_id}", responses={404: {"description": "Item not found"}})
async def read_item(item_id: int):
    ...
```

#### tags
**Kind**
config

**Summary**
Path operation or router option that groups endpoints in generated API docs.

**Definition**
Language: python
Source: pypi:fastapi==0.135.1:fastapi/routing.py

```python
router = APIRouter(tags=["items"])
```

**Guidance**
- Use tags to organize docs by feature area or client-facing domain.
- Keep router-level and route-level tags intentional so docs do not become noisy or misleading.
- Treat tags as documentation structure, not authorization or runtime behavior.

**Example**
Language: python
Description: Group related endpoints in the generated docs.

```python
from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])
```
