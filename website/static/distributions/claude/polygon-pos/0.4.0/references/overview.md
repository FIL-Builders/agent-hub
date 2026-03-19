# Polygon PoS Overview

## Snapshot

- Spec name: polygon-pos
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + @maticnetwork/maticjs^3.9.6 + @maticnetwork/maticjs-ethers^1.1.0
- Primary language: javascript
- Homepage: https://docs.polygon.technology/tools/matic-js/get-started/
- Source set: official Polygon docs for PoS building, Polygon Portal, and matic.js setup and POS client usage; `npm:@maticnetwork/maticjs@3.9.6`; `npm:@maticnetwork/maticjs-ethers@1.1.0`; `parse/polygon-pos-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/polygon-pos/0.3.0.md` for coverage audit only

**Tags**
- polygon
- polygon-pos
- bridge
- maticjs
- ethers
- portal
- deposits
- exits

## Purpose

This pack teaches an agent to use Polygon PoS as an application and bridge platform: initialize `matic.js` correctly, keep parent-chain Ethereum and child-chain Polygon PoS providers separate, deposit assets onto PoS, start withdrawals from PoS, wait for checkpoint or exit readiness before finalizing on Ethereum, and avoid the common network and bridge-model confusions that produce broken answers.

## Guiding Principles

- Keep parent-chain Ethereum and child-chain Polygon PoS contexts explicit at all times.
- Treat deposits and withdrawals as asymmetric workflows with different confirmation and completion semantics.
- Use `POSClient` as the default programmatic bridge entrypoint for PoS application work.
- Keep Portal UX and matic.js APIs separate as user-facing and programmatic layers.
- Treat `withdrawStart` as burn initiation on Polygon PoS, not final withdrawal completion.
- Keep current POL migration context explicit when interpreting current docs and examples.

## Boundary Notes

- The old `0.3.0` pack was focused on Heimdall-v2 operator and node APIs. That is valuable architecture context, but it is not the ordinary app-facing surface for most Polygon PoS work.
- This pack recenters Polygon PoS around `matic.js`, bridge flows, and provider separation, which is where practical dapp integration mistakes usually happen.
- Official docs still contain some pages under revision, especially older bridge walkthroughs. The pack therefore prefers current matic.js API contracts and current Portal or PoS docs over legacy step-by-step articles when they conflict.
- Current Polygon docs explicitly state that Polygon PoS is transitioning from MATIC to POL for gas and staking context. Package names and older examples still use legacy Matic naming, so the pack keeps that mismatch explicit.
- `agents/polygon-pos/0.3.0.md` was used only for coverage audit and broad architecture context, not as the contract source.

## FAQ

### Is Polygon PoS withdrawal complete after `withdrawStart`?
No. `withdrawStart` burns on Polygon PoS and begins the withdrawal workflow. Final completion happens later on the parent side after checkpointing and exit submission.

### Should I use Portal or `matic.js`?
Use Portal for official bridge UX and user guidance. Use `matic.js` for application code, automation, and programmatic bridge workflows.

### Why does the package still say `matic` when docs talk about POL and Polygon?
The package naming is legacy. Current docs explicitly discuss Polygon PoS and the MATIC-to-POL transition, while the programmatic package surface still uses `matic.js`.

## External Resources

- Polygon PoS Overview: https://docs.polygon.technology/pos
- Building On PoS: https://docs.polygon.technology/pos/get-started/building-on-polygon/
- Matic.js Get Started: https://docs.polygon.technology/tools/matic-js/get-started/
- POS Client Docs: https://docs.polygon.technology/tools/matic-js/pos/client/
- Polygon Portal Docs: https://docs.polygon.technology/pos/how-to/bridging/ethereum-polygon/portal-ui/
