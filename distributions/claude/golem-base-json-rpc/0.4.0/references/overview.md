# Golem Base JSON-RPC Overview

## Snapshot

- Spec name: golem-base/json-rpc
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs
- Primary language: json-rpc
- Homepage: https://docs.golem-base.org/
- Source set: `parse/golem-base-json-rpc-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/golem-base-json-rpc/0.3.0.md` for contract extraction and coverage audit

**Tags**
- evm
- json-rpc
- storage
- rlp
- annotations
- ttl

## Purpose

This pack teaches an agent to use Golem Base DB-Chain at a senior-developer level: encode storage mutations correctly as RLP, send them to the right precompile address through Ethereum-style JSON-RPC, and retrieve stored entities through indexed metadata and free-form query endpoints without losing TTL or payload semantics.

## Guiding Principles

- Send all storage mutations to the precompile address, not to arbitrary contracts.
- Prefer indexed queries before broad free-form queries.
- Treat BTL as a block-based TTL value rather than a wall-clock duration.
- Use `ExtendItem` when only TTL changes.
- Decode Base64 values returned by query endpoints before using them.

## Boundary Notes

- The old `0.3.0` pack already had the right operational model. This `0.4.0` port preserves the mutation-precompile and query split and makes the RLP transaction model easier to retrieve from.
- The storage transaction format is best understood as a fixed four-array RLP tuple: creates, updates, deletes, and extends.
- The source set for this pack is the prior extracted docs corpus and the earlier pack’s high-signal contracts.

## FAQ

### Is BTL measured in seconds?
No. BTL is in blocks. Treat it as block-based TTL and convert to time only as an approximation.

### Can I send mutations to any contract address?
No. Storage mutations go to the Golem Base mutation precompile address.
