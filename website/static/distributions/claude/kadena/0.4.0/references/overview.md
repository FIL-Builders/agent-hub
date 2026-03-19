# Kadena Pact Lang API Overview

## Snapshot

- Spec name: kadena/pact-lang-api
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: pact-lang-api^4.3.6
- Primary language: javascript
- Homepage: https://docs.kadena.io/
- Source set: current Kadena docs at `https://docs.kadena.io/`; `npm:pact-lang-api@4.3.6`; `parse/kadena-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/kadena/0.3.0.md` for coverage audit only

**Tags**
- kadena
- pact
- javascript
- chainweb
- sdk

## Purpose

This pack teaches an agent to use the Kadena `pact-lang-api` package at a senior-developer level: build transaction metadata correctly, submit writes and wait for their results, simulate reads safely, use capability-based wallet signing flows, and avoid the common timing and observation mistakes that make Pact integrations unreliable.

## Guiding Principles

- Use `Pact.fetch.local` for read-only evaluation and preflight simulation.
- Use `Pact.fetch.send` for state-changing transactions and always follow with `listen` or `poll`.
- Build metadata with `Pact.lang.mkMeta` using seconds-based timestamps.
- Construct capabilities with `Pact.lang.mkCap` instead of hard-coding loose signing assumptions.
- Prefer `Pact.wallet.sign` in end-user environments instead of handling raw private keys in the browser.

## Boundary Notes

- The old `0.3.0` pack already captured the right public helper model. This `0.4.0` port keeps that structure but makes the execution lifecycle easier to retrieve from.
- The package line has advanced from `^4.2.0` to `4.3.6`, but the high-value surfaces remain fetch, crypto, lang, and wallet helpers.
- Current docs and npm package are the version anchors. The old pack was used only for coverage audit and retained operational guidance.

## FAQ

### Should I always call local before send?
Not for every trivial path, but it is the safest default when debugging or when the cost of a failed write is meaningful.

### Is listen enough after send?
For one request key, usually yes. Use `poll` when you are tracking a batch of request keys together.

## External Resources

- Kadena docs: https://docs.kadena.io/
- pact-lang-api npm package: https://www.npmjs.com/package/pact-lang-api
