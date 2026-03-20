# Fluence API Overview

## Snapshot

- Spec name: fluence/api
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + api-v3
- Primary language: http
- Homepage: https://api.fluence.dev/docs
- Source set: current Fluence API docs at `https://api.fluence.dev/docs`; `parse/fluence-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/fluence/0.3.0.md` for coverage audit only

**Tags**
- fluence
- depin
- compute-marketplace
- rest
- vms
- ssh

## Purpose

This pack teaches an agent to use the Fluence public API at a senior-developer level: discover offers, estimate cost and capacity, create and mutate VM instances safely, manage SSH keys, and avoid the common lifecycle mistakes around open-port replacement and reserved funds.

## Guiding Principles

- Use discovery endpoints first so filters and pricing assumptions are valid before VM creation.
- Run `vms.estimate` before `vms.create` for any real deployment workflow.
- Treat `PATCH /vms/v3` as declarative replacement for `openPorts`, not merge semantics.
- Delete terminated or unused VMs explicitly so reserved funds are released.
- Keep SSH key management separate from VM lifecycle logic so deployments stay reproducible and auditable.

## Boundary Notes

- The old `0.3.0` pack already covered the core Fluence API surface well; the `0.4.0` port keeps the same operational model but makes the endpoint and workflow boundaries easier to retrieve from.
- The core developer surface remains marketplace discovery, VM lifecycle, and SSH-key management.
- Current docs are treated as authoritative for endpoint paths and product framing. The old pack was used only for coverage audit and retained operational guidance.

## FAQ

### Should I estimate before every create?
Yes. `vms.estimate` is the safest way to catch price, capacity, and configuration mismatches before reserving funds with `vms.create`.

### Does VM termination automatically release funds?
Not reliably enough to depend on it. Keep the deletion step explicit and call `vms.delete` with the affected VM IDs.

## External Resources

- Fluence API docs: https://api.fluence.dev/docs
