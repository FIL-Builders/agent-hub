# NEAR Twitter Contract Rust Documentation Pack

## Target
- Pack: `agents/near-twitter-contract-rs/0.4.0.md`
- Target date: 2026-03-13
- Repo anchor: `https://github.com/frol/near-twitter-example-rs`

## Source Inventory
- GitHub repository at `https://github.com/frol/near-twitter-example-rs`
- `agents/near-twitter-contract-rs/0.3.0.md` for contract extraction and coverage audit

## Decision Rules
- Distinguish write methods from view methods.
- Use predecessor account identity as the source of write-side authorization.
- Keep pagination bounded for collection reads.

## Common Confusions
- `like_tweet` returns an optional tweet, not guaranteed success.
- `delete_tweet` is authorization-sensitive.
- Author filtering is an O(n) contract-side scan in the example model.

## Failure Modes
- Clients treat `None` from lookups or likes as exceptional instead of expected absence.
- Non-authors attempt deletion and assume the contract is broken.
- Read methods are used without pagination limits.

## Coverage Map

### Writes
- `new`
- `post_tweet`
- `like_tweet`
- `delete_tweet`

### Reads
- `get_all_tweets`
- `get_tweet_by_id`
- `get_tweets_by_author`

## Must-Not-Regress Insights
- Preserve call-vs-view guidance.
- Preserve predecessor-account authorization guidance.
- Preserve bounded pagination guidance.
