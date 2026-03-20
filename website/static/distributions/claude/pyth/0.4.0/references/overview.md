# Pyth Overview

## Snapshot

- Spec name: pyth
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + client^2.22.1 + hermes^3.1.0 + pyth-sdk-solidity^4.3.1 + entropy-sdk-solidity^2.2.1 + express-relay-js^0.29.0 + pyth-lazer-sdk^6.0.0
- Primary language: typescript
- Homepage: https://docs.pyth.network
- Source set: official Pyth docs, `npm:@pythnetwork/client@2.22.1`, `npm:@pythnetwork/hermes-client@3.1.0`, `npm:@pythnetwork/pyth-sdk-solidity@4.3.1`, `npm:@pythnetwork/entropy-sdk-solidity@2.2.1`, `npm:@pythnetwork/express-relay-js@0.29.0`, `npm:@pythnetwork/pyth-lazer-sdk@6.0.0`, and `agents/pyth/0.3.0.md` for coverage audit only

**Tags**
- pyth
- oracle
- price-feeds
- hermes
- entropy
- express-relay
- lazer
- evm
- typescript

## Purpose

This pack teaches an agent to use the current Pyth developer surface correctly across off-chain price delivery, on-chain verification and consumption, lower-level Pythnet account access, Entropy randomness, Express Relay auction flows, and Lazer low-latency delivery without collapsing those surfaces into one generic oracle model.

## Guiding Principles

- Treat update delivery, on-chain verification, and on-chain price consumption as separate decisions.
- Prefer Hermes for ordinary off-chain price retrieval unless the integration explicitly needs lower-level Pythnet account access.
- Compute update fees and Entropy request fees for the exact payload or gas profile you are about to submit.
- Guard freshness explicitly; `unsafe` price reads are only acceptable when the caller also performs its own publish-time checks.
- Keep Entropy, Express Relay, and Lazer as separate product surfaces with separate operational constraints.
- Treat asynchronous status handling as mandatory for Express Relay and long-lived stream management as mandatory for Lazer.
- Use chain-correct deployment addresses and feed IDs instead of assuming a feed, contract, or provider identifier is portable across environments.

## Boundary Notes

- Source material: official Pyth docs plus the current package anchors `@pythnetwork/client@2.22.1`, `@pythnetwork/hermes-client@3.1.0`, `@pythnetwork/pyth-sdk-solidity@4.3.1`, `@pythnetwork/entropy-sdk-solidity@2.2.1`, `@pythnetwork/express-relay-js@0.29.0`, and `@pythnetwork/pyth-lazer-sdk@6.0.0`.
- The pack is organized around the current ordinary developer path first: Hermes delivery and EVM verification. Lower-level Pythnet account access, Entropy, Express Relay, and Lazer follow as separate surfaces.
- Coverage was audited against `agents/pyth/0.3.0.md`, but the older pack was not used as an authoritative definition source.
- The prior pack contained older Express Relay method names that are not present in `@pythnetwork/express-relay-js@0.29.0`; the package types take precedence here.
- `@pythnetwork/client` remains covered because it is still a real surface, but its own README recommends Hermes for most use cases.
- `Needs verification`: the exact public docs shape for some Express Relay and hosted Lazer operational flows can move faster than the package-level TypeScript contracts, so environment-specific endpoint, entitlement, and workflow details should be checked when integrating a production system.

## FAQ

### Should a new integration start with Hermes or `@pythnetwork/client`?
Start with Hermes unless you explicitly need direct Pythnet or Solana account access. The `@pythnetwork/client` README itself says Hermes is recommended for most use cases.

### Is fetching an update from Hermes enough to trust it on-chain?
No. Hermes delivers update payloads. On-chain trust comes from the verification or parsing path in the relevant `IPyth` contract methods.

### Is Entropy part of the same API surface as price feeds?
No. Entropy is the randomness product surface and should be modeled separately from price-feed delivery and verification.

### Is Express Relay just another way to fetch Pyth prices?
No. Express Relay is an opportunity, quote, and bidding surface, not a generic price-feed retrieval API.

### When should I use Lazer instead of Hermes?
Use Lazer when the integration explicitly needs its low-latency stream model and can handle the additional operational and entitlement complexity. Use Hermes for ordinary price-feed delivery.

## External Resources

- Docs: https://docs.pyth.network
- Client package: https://www.npmjs.com/package/@pythnetwork/client/v/2.22.1
- Hermes client package: https://www.npmjs.com/package/@pythnetwork/hermes-client/v/3.1.0
- Solidity SDK package: https://www.npmjs.com/package/@pythnetwork/pyth-sdk-solidity/v/4.3.1
- Entropy Solidity SDK package: https://www.npmjs.com/package/@pythnetwork/entropy-sdk-solidity/v/2.2.1
- Express Relay JS package: https://www.npmjs.com/package/@pythnetwork/express-relay-js/v/0.29.0
- Lazer SDK package: https://www.npmjs.com/package/@pythnetwork/pyth-lazer-sdk/v/6.0.0
