# ENS Overview

## Snapshot

- Spec name: ens
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + ensjs^4.2.2
- Primary language: typescript
- Homepage: https://docs.ens.domains
- Source set: https://docs.ens.domains/web, https://docs.ens.domains/web/resolution, https://docs.ens.domains/web/reverse, https://docs.ens.domains/resolvers/interacting, https://docs.ens.domains/resolvers/public, https://docs.ens.domains/resolution/names, https://docs.ens.domains/registry/eth, https://docs.ens.domains/wrapper/overview, npm:@ensdomains/ensjs@4.2.2

**Tags**
- ens
- ethereum
- naming
- resolver
- registration
- typescript

## Purpose

This pack teaches an agent to use ENS for ordinary dapp integration, verified
primary-name handling, resolver-backed record management, `.eth`
registration and renewal, and wrapped-name operations, with ENSjs
`^4.2.2` as the default TypeScript integration path.

## Guiding Principles

- Start with ENSjs public and wallet clients for application work; drop to raw contracts only when the task genuinely escapes ENSjs coverage.
- Normalize names before manual hashing, comparison, or low-level protocol interaction.
- Treat reverse lookup results as untrusted display candidates until forward verification succeeds on the relevant chain.
- Do not hardcode public resolver behavior or addresses onto arbitrary names; resolve and capability-check first.
- Treat `.eth` registration as a commit-reveal workflow with timing and value-buffer requirements, not a single write.
- Keep wrapped and unwrapped name-management models distinct because wrapping changes ownership and fuse semantics.
- Treat resolver, registration, and wrapper flows as operationally chain-aware, even though ENS resolution starts from Ethereum Mainnet.

## Boundary Notes

- Source material: the current ENS documentation for dapp integration, address lookup, primary names, resolver interaction, public resolver behavior, name processing, ETH registrar behavior, and name wrapper overview, plus `npm:@ensdomains/ensjs@4.2.2` declarations as the ENSjs contract source.
- The pack is organized around the modern application path first: client setup, resolution and primary-name verification, registration, resolver writes, and wrapper operations.
- `agents/ens/0.3.0.md` was used only for coverage audit and to preserve still-valid low-level insights about normalization, capability checks, registration timing, and wrapper caution.
- Low-level registry, registrar, public resolver, and wrapper contracts remain part of the ecosystem boundary, but they are not treated as the default integration path for current TypeScript work.
- The ENS docs explicitly separate reverse records from verified primary names; that distinction is made first-class in this pack.
- Needs verification: `getName` in `ensjs@4.2.2` has a declaration/comment mismatch around nullability when no primary name is set. The pack treats `match` as the critical safety signal and records the mismatch here rather than inventing a stronger contract.

## FAQ

### Should I use ENSjs or direct contract calls?
Use ENSjs as the default path for application work. Use direct registry, resolver, registrar, or wrapper contracts only when the task truly escapes ENSjs coverage or needs a lower-level protocol operation.

### Can I trust a reverse record alone as a primary name?
No. The ENS docs make the two-way invariant explicit: reverse lookup must be validated by forward resolution on the relevant chain before the name is safe to display.

### Should I hardcode the public resolver?
No. The docs explicitly warn that custom resolvers exist. Resolve the configured resolver first and capability-check it before assuming support for a feature.

## External Resources

- ENS getting started: https://docs.ens.domains/web
- ENS address lookup: https://docs.ens.domains/web/resolution
- ENS primary names: https://docs.ens.domains/web/reverse
- ENS resolver interaction: https://docs.ens.domains/resolvers/interacting
- ENS public resolver: https://docs.ens.domains/resolvers/public
- ENS name processing: https://docs.ens.domains/resolution/names
- ENS ETH registrar: https://docs.ens.domains/registry/eth
- ENS name wrapper overview: https://docs.ens.domains/wrapper/overview
