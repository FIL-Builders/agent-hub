# NEAR Twitter Contract RS Overview

## Snapshot

- Spec name: near/twitter-contract-rs
- Spec version: 0.4.0
- Generated: 2026-03-13
- Library version: current-docs + near-sdk-rs-family
- Primary language: rust
- Homepage: https://github.com/frol/near-twitter-example-rs
- Source set: GitHub repository at `https://github.com/frol/near-twitter-example-rs`; `parse/near-twitter-contract-rs-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/near-twitter-contract-rs/0.3.0.md` for contract extraction and coverage audit

**Tags**
- near
- rust
- smart-contracts
- example
- twitter
- blockchain

## Purpose

This pack teaches an agent to work with the NEAR Twitter-like Rust contract at a senior-developer level: initialize state correctly, create and like tweets through write methods, enforce author-only deletion, and use paginated view methods without assuming indexed query performance.

## Guiding Principles

- Distinguish paid write calls from free view methods.
- Treat `env::predecessor_account_id()` as the write-side identity source.
- Keep write methods simple and strongly typed.
- Bound pagination on collection reads.
- Handle optional returns as normal control flow, not exceptional failures.

## Boundary Notes

- The old `0.3.0` pack already exposed the contract’s high-value public methods. This `0.4.0` port preserves that and makes write and view boundaries easier to retrieve from.
- This is a concrete example contract pack rather than a generalized NEAR SDK pack, so the symbol set is the contract’s public API.
- The GitHub example repository and prior extracted contracts serve as the source anchor here.

## FAQ

### Should clients assume get_tweets_by_author is cheap at scale?
No. In the example contract it is an in-contract filter over stored data, so bounded pagination still matters.

### Is like_tweet guaranteed to return a tweet?
No. It returns an `Option<Tweet>` and can yield `None` when the target ID is missing.

## External Resources

- Example repository: https://github.com/frol/near-twitter-example-rs
