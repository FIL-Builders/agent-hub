# Walrus HTTP API Overview

## Snapshot

- Spec name: walrus/http-api
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs
- Primary language: http
- Homepage: https://docs.wal.app/
- Source set: current Walrus docs at `https://docs.wal.app/`; `parse/walrus-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/walrus/0.3.0.md` for coverage audit only

**Tags**
- storage
- sui
- walrus
- http
- blob

## Purpose

This pack teaches an agent to use the Walrus HTTP API at a senior-developer level: write blobs through publisher-capable endpoints, read blobs through aggregator-capable endpoints, set retention and deletion behavior correctly, and introspect a live deployment before binding tightly to its exact HTTP surface.

## Guiding Principles

- Use publisher or daemon endpoints for writes and aggregator or daemon endpoints for reads.
- Treat blob IDs as the canonical handles for retrieval and follow-on integration.
- Set `epochs`, `deletable`, and `send_object_to` deliberately on writes instead of relying on defaults blindly.
- Use `/v1/api` to inspect the exact parameters and schemas on the concrete deployment you are targeting.
- Keep browser-serving caveats separate from storage semantics; content-type restrictions do not change blob identity.

## Boundary Notes

- The old `0.3.0` pack captured the most important Walrus operational boundaries already. The `0.4.0` port preserves those boundaries and makes them easier to retrieve during HTTP-integration tasks.
- The current authoritative surface is the live HTTP docs and the deployment-specific `/v1/api` description.
- This pack keeps writes, reads, and introspection as distinct groups because production integrations often mix them up.

## FAQ

### Should I store gateway URLs instead of blob IDs?
No. Store blob IDs. The endpoint used to serve the content can change, while the blob ID is the durable content handle.

### Do I need /v1/api if I already read the docs?
Yes, when integrating against a concrete deployment. `/v1/api` is the live source of truth for that deployment’s exposed schema.

## External Resources

- Walrus docs: https://docs.wal.app/
