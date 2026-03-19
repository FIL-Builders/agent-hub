# NEAR Twitter Contract RS API Groups

### Write Methods
**Exports**
- new
- post_tweet
- like_tweet
- delete_tweet

State-changing contract methods.

#### new
**Kind**
function

**Summary**
Initialize contract state after deployment.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
#[init]
pub fn new() -> Self
```

**Guidance**
- Call this once immediately after deployment.
- Keep initialization minimal and derive defaults inside the contract when possible.
- Treat `#[init]` semantics as part of the deployment contract.

**Example**
Language: bash
Description: Initialize the deployed contract.

```bash
near call <contract.testnet> new '{}' --accountId <deployer.testnet>
```

#### post_tweet
**Kind**
function

**Summary**
Create a new tweet authored by the predecessor account.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn post_tweet(&mut self, text: String) -> Tweet
```

**Guidance**
- Do not accept the author as an input field; derive it from predecessor identity.
- Keep text-length constraints explicit in real deployments.
- Log or otherwise surface creation events if downstream indexing matters.

**Example**
Language: bash
Description: Post a tweet from the CLI.

```bash
near call <contract.testnet> post_tweet '{"text":"Hello from CLI!"}' --accountId alice.testnet
```

#### like_tweet
**Kind**
function

**Summary**
Increment a tweet’s like counter and return the updated tweet if it exists.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn like_tweet(&mut self, tweet_id: u64) -> Option<Tweet>
```

**Guidance**
- Treat `None` as the normal result for a missing tweet ID.
- Do not assume the example contract prevents duplicate likes by the same account.
- Keep client handling explicit for absent IDs.

**Example**
Language: bash
Description: Like a tweet by ID.

```bash
near call <contract.testnet> like_tweet '{"tweet_id": 42}' --accountId bob.testnet
```

#### delete_tweet
**Kind**
function

**Summary**
Delete a tweet, subject to author-only authorization.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn delete_tweet(&mut self, tweet_id: u64)
```

**Guidance**
- Compare tweet ownership to `env::predecessor_account_id()` before deleting.
- Keep authorization failures explicit so they are diagnosable.
- Treat deletion as a write path with gas and storage implications.

**Example**
Language: bash
Description: Delete a tweet as its author.

```bash
near call <contract.testnet> delete_tweet '{"tweet_id": 42}' --accountId alice.testnet
```

### View Methods
**Exports**
- get_all_tweets
- get_tweet_by_id
- get_tweets_by_author

Read-only access to stored tweets.

#### get_all_tweets
**Kind**
function

**Summary**
Return a paginated slice of all tweets.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn get_all_tweets(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<Tweet>
```

**Guidance**
- Keep `limit` small and bounded.
- Use this for simple pagination, not as an indexed search API.
- Prefer view semantics in clients for reads instead of write calls.

**Example**
Language: bash
Description: Fetch the first page of tweets.

```bash
near view <contract.testnet> get_all_tweets '{"from_index": 0, "limit": 5}'
```

#### get_tweet_by_id
**Kind**
function

**Summary**
Fetch a single tweet by numeric ID.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn get_tweet_by_id(&self, tweet_id: u64) -> Option<Tweet>
```

**Guidance**
- Handle `None` or `null` as a normal “not found” outcome.
- Keep numeric ID handling safe in clients that do not natively like 64-bit integers.
- Use this when a single tweet lookup is required rather than filtering all tweets.

**Example**
Language: bash
Description: Fetch a single tweet by ID.

```bash
near view <contract.testnet> get_tweet_by_id '{"tweet_id": 42}'
```

#### get_tweets_by_author
**Kind**
function

**Summary**
Return a paginated slice of tweets by author account ID.

**Definition**
Language: rust
Source: agents/near-twitter-contract-rs/0.3.0.md coverage audit

```rust
pub fn get_tweets_by_author(
    &self,
    author_id: AccountId,
    from_index: Option<u64>,
    limit: Option<u64>,
) -> Vec<Tweet>
```

**Guidance**
- Keep limits bounded because the example implementation filters in-contract.
- Treat this as an example-friendly read path, not a highly optimized index.
- Move heavy analytics or global search off-chain in real systems.

**Example**
Language: bash
Description: Fetch tweets by author.

```bash
near view <contract.testnet> get_tweets_by_author '{"author_id":"alice.testnet","from_index":0,"limit":10}'
```
