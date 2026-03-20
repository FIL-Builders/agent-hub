# Walrus HTTP API API Groups

### Blob Writes
**Exports**
- walrus.blobs.put

Store immutable or deletable blobs via a publisher-capable endpoint.

#### walrus.blobs.put
**Kind**
endpoint

**Summary**
Upload a blob and receive a blob ID plus retention and object metadata.

**Definition**
Language: http
Source: https://docs.wal.app/ Walrus web API

```http
PUT /v1/blobs?epochs=<optional>&deletable=<optional>&send_object_to=<optional>
Content-Type: application/octet-stream

<raw request body>
```

**Guidance**
- Send writes to a publisher or daemon, not an aggregator-only endpoint.
- Increase `epochs` when retention needs to exceed the default single-epoch behavior.
- Use `deletable=true` only when deletion semantics are actually required by your application model.

**Example**
Language: bash
Description: Upload a blob for five epochs and direct the object to a Sui address.

```bash
curl -sS -X PUT \
  "https://publisher.example/v1/blobs?epochs=5&send_object_to=0xabc123" \
  --upload-file ./payload.bin
```

### Blob Reads
**Exports**
- walrus.blobs.get

Read blobs back from an aggregator-capable endpoint using their blob IDs.

#### walrus.blobs.get
**Kind**
endpoint

**Summary**
Fetch blob content by blob ID from an aggregator or daemon.

**Definition**
Language: http
Source: https://docs.wal.app/ Walrus web API

```http
GET /v1/blobs/{blobId}
```

**Guidance**
- Treat the blob ID as the durable content handle; do not build your model around a specific gateway URL.
- Use read endpoints on an aggregator or daemon, not the write publisher path by default.
- Surface browser header limitations separately if you are embedding the response in a web app.

**Example**
Language: bash
Description: Fetch a blob by ID.

```bash
curl -sS https://aggregator.example/v1/blobs/bafkrei...
```

### Deployment Introspection
**Exports**
- walrus.api.get

Inspect the live API description of the specific deployment you are integrating against.

#### walrus.api.get
**Kind**
endpoint

**Summary**
Return the machine-readable API description for the concrete Walrus deployment.

**Definition**
Language: http
Source: https://docs.wal.app/ Walrus web API

```http
GET /v1/api
```

**Guidance**
- Call this before hard-binding to a concrete deployment, especially in self-hosted or changing environments.
- Use it to verify supported parameters and schema details instead of assuming every deployment is identical.
- Keep this endpoint in tooling and diagnostics paths even if the application later uses cached schemas.

**Example**
Language: bash
Description: Fetch the live API description.

```bash
curl -sS https://aggregator.example/v1/api
```
