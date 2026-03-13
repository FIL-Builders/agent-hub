# Walrus Documentation Pack

## Target
- Pack: `agents/walrus/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current Walrus docs at `https://docs.wal.app/`

## Source Inventory
- Current Walrus docs at `https://docs.wal.app/`
- `agents/walrus/0.3.0.md` for coverage audit only

## Decision Rules
- Use publisher or daemon endpoints for writes and aggregator or daemon endpoints for reads.
- Treat `epochs`, `deletable`, and `send_object_to` as core write-path controls.
- Use `/v1/api` to inspect a concrete deployment before integrating tightly.

## Common Confusions
- Publisher and aggregator roles are not interchangeable.
- Blob IDs are the canonical identifiers, not gateway URLs.
- Browser serving restrictions are separate from storage semantics.

## Failure Modes
- Writes go to a read-only endpoint.
- Retention is too short because `epochs` was omitted or underestimated.
- Integrators assume the live deployment matches a previously cached API schema.

## Coverage Map

### Storage
- `walrus.blobs.put`
- `walrus.blobs.get`

### Introspection
- `walrus.api.get`

## Must-Not-Regress Insights
- Preserve the write-vs-read endpoint boundary.
- Preserve `epochs` and `deletable` semantics.
- Preserve `/v1/api` as the deployment-specific source of truth.
