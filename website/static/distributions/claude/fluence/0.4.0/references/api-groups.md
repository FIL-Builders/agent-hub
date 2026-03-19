# Fluence API API Groups

### Marketplace Discovery
**Exports**
- marketplace.offers.search
- marketplace.basic_configurations.list
- marketplace.countries.list

Use these endpoints to constrain price, geography, and hardware before requesting a VM estimate or creation.

#### marketplace.offers.search
**Kind**
endpoint

**Summary**
Search available compute offers with optional hardware, country, and pricing filters.

**Definition**
Language: http
Source: https://api.fluence.dev/docs marketplace offers section

```http
POST /marketplace/offers
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "basicConfigurationId": "optional",
  "countryCodes": ["optional"],
  "hardware": {
    "cpu": { "min": 2 },
    "memory": { "min": 4096 },
    "storage": { "min": 50 }
  },
  "maxTotalPricePerEpochUsdc": "optional"
}
```

**Guidance**
- Start here when you need provider-side capacity discovery instead of guessing a machine shape.
- Use the same constraints later when estimating and creating a VM so pricing and availability remain coherent.
- Keep filters broad initially; over-constraining country or hardware is a common reason for empty results.

**Example**
Language: bash
Description: Search for offers that meet a basic hardware profile.

```bash
curl -sS https://api.fluence.dev/marketplace/offers \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"hardware":{"cpu":{"min":2},"memory":{"min":4096}}}'
```

#### marketplace.basic_configurations.list
**Kind**
endpoint

**Summary**
List Fluence-defined basic machine configurations that can be used as deployment baselines.

**Definition**
Language: http
Source: https://api.fluence.dev/docs marketplace basic configurations section

```http
GET /marketplace/basic_configurations
Authorization: Bearer <API_KEY>
```

**Guidance**
- Use this endpoint when you want a stable baseline configuration instead of hand-building hardware filters.
- Keep the returned configuration identifier as an input to later offer and estimate requests.
- Use this as a UI seed, not as proof that capacity exists in a specific region.

**Example**
Language: bash
Description: Fetch the built-in basic configurations.

```bash
curl -sS https://api.fluence.dev/marketplace/basic_configurations \
  -H "Authorization: Bearer $FLUENCE_API_KEY"
```

#### marketplace.countries.list
**Kind**
endpoint

**Summary**
List supported country filters for offer search and VM placement.

**Definition**
Language: http
Source: https://api.fluence.dev/docs marketplace countries section

```http
GET /marketplace/countries
Authorization: Bearer <API_KEY>
```

**Guidance**
- Use these values to build valid placement filters; do not invent country codes.
- Treat country selection as a capacity and compliance input, not a guarantee of price stability.
- Pair this endpoint with offers search, not as a standalone placement decision.

**Example**
Language: bash
Description: List supported country filters.

```bash
curl -sS https://api.fluence.dev/marketplace/countries \
  -H "Authorization: Bearer $FLUENCE_API_KEY"
```

### VM Lifecycle
**Exports**
- vms.estimate
- vms.create
- vms.patch
- vms.delete

These are the core deployment and lifecycle endpoints for Fluence virtual machines.

#### vms.estimate
**Kind**
endpoint

**Summary**
Estimate deposit and per-epoch price for a proposed VM configuration before creation.

**Definition**
Language: http
Source: https://api.fluence.dev/docs VM estimate section

```http
POST /vms/v3/estimate
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "instances": [
    {
      "name": "vm-1",
      "basicConfigurationId": "optional",
      "hardware": { "cpu": 2, "memory": 4096, "storage": 50 }
    }
  ]
}
```

**Guidance**
- Run this before `vms.create`; it is the safest preflight for budget and capacity assumptions.
- Use it to catch impossible hardware and storage combinations early.
- Treat the response as a planning artifact, not a reservation.

**Example**
Language: bash
Description: Estimate a single VM instance.

```bash
curl -sS https://api.fluence.dev/vms/v3/estimate \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instances":[{"name":"demo","hardware":{"cpu":2,"memory":4096,"storage":50}}]}'
```

#### vms.create
**Kind**
endpoint

**Summary**
Create one or more Fluence VMs from a fully specified configuration.

**Definition**
Language: http
Source: https://api.fluence.dev/docs VM creation section

```http
POST /vms/v3
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "instances": [
    {
      "name": "demo",
      "hostname": "demo",
      "osImage": "default-or-custom-image",
      "sshKeys": ["key-id"],
      "openPorts": [22, 80]
    }
  ]
}
```

**Guidance**
- Create only after a successful estimate and capacity shortlist.
- Keep SSH key identifiers and open ports explicit in the request payload.
- Treat the returned VM identifiers as durable lifecycle handles for patch and delete operations.

**Example**
Language: bash
Description: Create a VM with two open ports.

```bash
curl -sS https://api.fluence.dev/vms/v3 \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instances":[{"name":"demo","hostname":"demo","sshKeys":["key-id"],"openPorts":[22,80]}]}'
```

#### vms.patch
**Kind**
endpoint

**Summary**
Patch mutable VM properties, including the full desired `openPorts` set.

**Definition**
Language: http
Source: https://api.fluence.dev/docs VM patch section

```http
PATCH /vms/v3
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "vmIds": ["vm-id"],
  "openPorts": [22, 80, 443]
}
```

**Guidance**
- Always send the complete desired port list; omitted ports are removed.
- Use this for post-create exposure changes, not for cost estimation.
- Review the current state first if multiple operators may have changed ports out-of-band.

**Example**
Language: bash
Description: Add HTTPS while preserving SSH and HTTP.

```bash
curl -sS -X PATCH https://api.fluence.dev/vms/v3 \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vmIds":["vm-id"],"openPorts":[22,80,443]}'
```

#### vms.delete
**Kind**
endpoint

**Summary**
Delete one or more VMs and release reserved funds for those instances.

**Definition**
Language: http
Source: https://api.fluence.dev/docs VM delete section

```http
DELETE /vms/v3
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "vmIds": ["vm-id"]
}
```

**Guidance**
- Use this to finalize termination and release reserved balance.
- Do not assume a provider-terminated VM has already been cleaned up for billing purposes.
- Keep VM identifiers durably stored so deletion is possible even after a process restart.

**Example**
Language: bash
Description: Delete an unneeded VM.

```bash
curl -sS -X DELETE https://api.fluence.dev/vms/v3 \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vmIds":["vm-id"]}'
```

### SSH Keys
**Exports**
- ssh_keys.list
- ssh_keys.create

Reusable SSH credentials for later VM creation and access control.

#### ssh_keys.list
**Kind**
endpoint

**Summary**
List SSH keys available to the current Fluence account.

**Definition**
Language: http
Source: https://api.fluence.dev/docs SSH keys section

```http
GET /ssh/v2/keys
Authorization: Bearer <API_KEY>
```

**Guidance**
- Fetch this before VM creation if you need to reconcile key identifiers in automation.
- Keep SSH key inventory separate from VM state so credentials can be rotated independently.
- Use this endpoint to avoid hard-coding stale key IDs in deployment pipelines.

**Example**
Language: bash
Description: List registered SSH keys.

```bash
curl -sS https://api.fluence.dev/ssh/v2/keys \
  -H "Authorization: Bearer $FLUENCE_API_KEY"
```

#### ssh_keys.create
**Kind**
endpoint

**Summary**
Register a new SSH public key for later VM access.

**Definition**
Language: http
Source: https://api.fluence.dev/docs SSH key creation section

```http
POST /ssh/v2/keys
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "name": "workstation",
  "publicKey": "ssh-ed25519 AAAA..."
}
```

**Guidance**
- Create reusable SSH keys before VM creation so deployment payloads remain stable.
- Store the returned key identifier and label together; labels alone are not enough for automation.
- Keep keys environment-specific so test and production fleets do not share credentials accidentally.

**Example**
Language: bash
Description: Register an SSH public key.

```bash
curl -sS https://api.fluence.dev/ssh/v2/keys \
  -H "Authorization: Bearer $FLUENCE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"workstation","publicKey":"ssh-ed25519 AAAA..."}'
```
