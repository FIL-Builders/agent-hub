# Fluence Documentation Pack

## Target
- Pack: `agents/fluence/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current Fluence public API docs at `https://api.fluence.dev/docs`
- API anchor: `/marketplace/*`, `/vms/v3`, and `/ssh/v2/keys`

## Source Inventory
- Current Fluence API docs at `https://api.fluence.dev/docs`
- `agents/fluence/0.3.0.md` for coverage audit only

## Version Delta Audit
- The old pack already tracked the `v3` VM API shape well.
- Main stale-risk areas are product framing and endpoint emphasis rather than raw path drift.
- The current pack should preserve VM-estimate, create, patch, delete, and SSH-key management as the primary workflow.

## Ecosystem Boundaries

### Marketplace Discovery
- Offer search and discovery endpoints are for placement decisions and filtering.
- Discovery is not deployment and should not be treated as a reservation.

### VM Lifecycle
- Estimate, create, patch, and delete are the authoritative lifecycle operations.
- Open ports are declarative and full-replacement when patched.

### SSH Keys
- SSH key endpoints manage reusable credentials and should stay separate from VM creation logic.

## Decision Rules
- Start with marketplace discovery and pricing estimate before attempting creation.
- Treat `PATCH /vms/v3` as replace-all for `openPorts`.
- Delete terminated or abandoned VMs explicitly to release funds.
- Keep SSH key creation separate from VM creation so deployments stay reproducible.

## Common Confusions
- `estimate` predicts deposit and epoch price; it does not allocate capacity.
- `PATCH /vms/v3` does not merge port rules.
- A VM record can persist after runtime termination until explicit deletion.

## Failure Modes
- VM creation fails because hardware or country filters are too narrow.
- Operators accidentally remove port `22` by patching only the new port instead of the full set.
- Funds remain reserved because the VM was not deleted after termination.

## Coverage Map

### Marketplace
- `marketplace.offers.search`
- `marketplace.basic_configurations.list`
- `marketplace.countries.list`

### VM Lifecycle
- `vms.estimate`
- `vms.create`
- `vms.patch`
- `vms.delete`

### SSH Keys
- `ssh_keys.list`
- `ssh_keys.create`

## Must-Not-Regress Insights
- Preserve the old pack’s strong guidance that `PATCH /vms/v3` replaces the entire port list.
- Preserve the estimate-before-create workflow.
- Preserve explicit deletion guidance for fund release.
