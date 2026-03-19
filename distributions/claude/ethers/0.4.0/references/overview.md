# ethers Overview

## Snapshot

- Spec name: ethers
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^6.16.0
- Primary language: javascript
- Homepage: https://docs.ethers.org/v6/
- Source set: npm:ethers@6.16.0 TypeScript declarations, official ethers v6 API docs, and the prior AgentHub ethers pack for coverage audit only

**Tags**
- ethereum
- blockchain
- sdk
- javascript
- typescript

## Purpose

This pack teaches an agent to use ethers v6 for Ethereum-compatible providers, wallets, contract interaction, ABI work, unit conversion, address handling, and signature-oriented workflows in production-style JavaScript and TypeScript codebases.

## Guiding Principles

- Prefer explicit providers and signers over hidden defaults in production code.
- Treat `bigint` and `BigNumberish` values as integer-domain data and avoid JavaScript floating-point arithmetic for on-chain amounts.
- Keep private keys, mnemonics, and API keys out of source control and logs.
- Use `Contract` for normal contract calls and events, and reach for `Interface` or `AbiCoder` only when lower-level ABI control is required.
- Normalize addresses with `getAddress` when correctness matters and use `isAddress` only as a boolean filter.
- Use `keccak256` for bytes-like data and `id` for UTF-8 strings.
- Wait for transaction confirmation or deployment finality when subsequent logic depends on chain state changes.

## Boundary Notes

- Source material: `npm:ethers@6.16.0` TypeScript declarations as the primary contract source, plus the official ethers v6 API documentation at `https://docs.ethers.org/v6/`.
- Coverage follows a practical dapp and backend mental model: providers, wallets and signatures, contracts and ABI, then address, units, and hashing utilities.
- Definitions are compressed to the primary developer-facing surface for each symbol while keeping the cited contract intact.
- Coverage was audited against `agents/ethers/0.2.0.md`, but the previous generated pack was not used as the primary contract source.
- The public docs site is versioned as `v6` rather than by patch release, so the exact package source is pinned through `npm:ethers@6.16.0`.

## FAQ

### When should I use `getDefaultProvider` instead of constructing a provider directly?
Use `getDefaultProvider` for quick scripts and prototypes. Use explicit provider classes when backend selection, rate limits, pricing, or failover behavior matter.

### Should I use `AbiCoder` or `Interface` for contract work?
Use `Interface` when you already have ABI semantics such as functions and events. Use `AbiCoder` when you need raw tuple or primitive encoding outside a contract-oriented context.

### What is the safest default for on-chain numeric values in ethers v6?
Treat them as integers in `bigint` form and convert at the edges with `parseEther`, `formatEther`, `parseUnits`, and `formatUnits`.

### Why does an ERC-20 `transfer` not give me a boolean success value in app code?
Because a write call in ethers returns a transaction response for submission. The application should treat success as a confirmation concern and await `tx.wait(...)` when later logic depends on the state change.

### When is it safe to hardcode token decimals like `6`?
Only when the application is intentionally specific to that token or a tightly controlled token set. In generic ERC-20 flows, source decimals from the token contract or trusted metadata.

## External Resources

- Official Documentation: https://docs.ethers.org/v6/
- Providers API: https://docs.ethers.org/v6/api/providers/
- Wallet API: https://docs.ethers.org/v6/api/wallet/
- Contracts API: https://docs.ethers.org/v6/api/contract/
- ABI API: https://docs.ethers.org/v6/api/abi/
- Address API: https://docs.ethers.org/v6/api/address/
- Hashing API: https://docs.ethers.org/v6/api/hashing/
- Utilities API: https://docs.ethers.org/v6/api/utils/
- npm Package: https://www.npmjs.com/package/ethers/v/6.16.0
