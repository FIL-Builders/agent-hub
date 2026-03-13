# Hedera Documentation Pack

## Target
- Pack: `agents/hedera/0.4.0.md`
- Target date: 2026-03-12
- Package anchor: `@hashgraph/sdk@2.80.0`
- Supporting anchor: `@hashgraph/hedera-local@2.39.4`
- Docs anchor: current Hedera docs surface at `docs.hedera.com`

## Source Inventory
- Official Hedera docs for quickstart, transactions, queries, tokens, consensus service, smart contracts, mirror node REST, and local development.
- `npm:@hashgraph/sdk@2.80.0` TypeScript declarations for concrete JavaScript SDK contracts.
- `npm:@hashgraph/hedera-local@2.39.4` for local-network context only.
- `agents/hedera/0.3.0.md` for coverage audit only.

## Version Delta Audit
- The old pack was effectively `hedera/mirror-node-rest`, centered on indexed REST endpoints.
- The new pack must represent Hedera as a full developer platform:
  - consensus-node client setup and transaction submission
  - query and receipt flows
  - token and topic workflows
  - smart-contract query and execute flows
  - mirror-node REST and simulation boundaries
- Main stale-risk areas:
  - treating mirror-node reads as the write path
  - flattening Hedera account IDs, aliases, and EVM addresses into one identifier model
  - flattening Hedera smart-contract behavior into generic Ethereum assumptions
  - ignoring current branding drift where docs increasingly use `Hiero` but package anchors still use `@hashgraph/*`

## Ecosystem Boundaries

### Consensus Nodes And SDK
- Use the JavaScript SDK for signed transactions, free or paid queries, receipts, and records.
- Consensus-node writes are the source of truth for transaction acceptance and receipt status.
- Receipt and record queries are the right place to confirm write outcomes.

### Mirror Node REST
- Use mirror-node REST for indexed, read-oriented views of accounts, tokens, contracts, and transactions.
- Mirror-node REST is not the write path.
- Mirror-node visibility can lag consensus.

### Mirror-Node Contract Simulation
- `POST /api/v1/contracts/call` and SDK mirror-node contract query helpers simulate reads.
- Use them for view-like contract behavior and gas-style estimation, not state mutation.

### Local Development
- `Client.forLocalNode()` and local-network tooling are appropriate for deterministic local testing.
- Local-node defaults must not be presented as production mainnet or testnet behavior.

## Decision Rules
- If you need to submit or pay for a transaction, use the SDK.
- If you need authoritative status for a submitted transaction, use receipt or record queries, then treat mirror-node indexing as asynchronous follow-up.
- If you need indexed ledger views for UI or reporting, use mirror-node REST.
- If you need read-only contract evaluation without state mutation, use `ContractCallQuery` or mirror-node contract simulation depending on the workflow and required environment.
- If you are dealing with HTS, remember association and account capability rules before transfer.
- If you are dealing with HCS, separate topic submission from topic consumption through mirror-node streaming.

## Common Confusions
- `Client` is the ordinary JavaScript SDK entrypoint even though upstream branding increasingly says `Hiero`.
- `Client.forTestnet()` and related constructors are SDK network presets, not mirror-node REST endpoints.
- `TransactionReceiptQuery` answers whether a write succeeded; mirror-node REST answers when indexed data is visible.
- `ContractCallQuery` is a consensus-node query path; `POST /api/v1/contracts/call` is a mirror-node simulation path.
- Hedera IDs, aliases, and EVM addresses are related but not interchangeable in every context.

## Failure Modes
- Submitted write succeeds, but mirror-node read still returns old data: consensus and indexing are on different timelines.
- HBAR or token transfer fails due to missing receiver signature or missing token association.
- Topic reads appear missing when querying the wrong time window or mirror source.
- Contract integration fails because the workflow assumes generic Ethereum RPC behavior instead of Hedera SDK or mirror-node semantics.
- Setup confusion from docs/package branding drift causes incorrect imports or package selection.

## Coverage Map

### Setup And Identity
- `Client`
- `Client.forTestnet`
- `Client.forLocalNode`
- `Client.setOperator`
- `PrivateKey.fromStringECDSA`

### Accounts And Receipts
- `AccountCreateTransaction`
- `TransferTransaction`
- `AccountBalanceQuery`
- `AccountInfoQuery`
- `TransactionReceiptQuery`

### Tokens
- `TokenCreateTransaction`
- `TokenAssociateTransaction`
- `TokenInfoQuery`

### Topics
- `TopicMessageSubmitTransaction`
- `TopicMessageQuery`
- `GET /api/v1/topics/{topicId}/messages`

### Smart Contracts
- `ContractCallQuery`
- `ContractExecuteTransaction`
- `MirrorNodeContractCallQuery`
- `POST /api/v1/contracts/call`

### Mirror Node Indexed Reads
- `GET /api/v1/accounts/{idOrAliasOrEvmAddress}`
- `GET /api/v1/tokens/{tokenId}`
- `GET /api/v1/transactions/{transactionId}`

## Must-Not-Regress Insights
- Preserve the old pack’s strong mirror-node guidance around deterministic reads, pagination, and delayed visibility.
- Preserve the distinction between contract simulation and state-changing writes.
- Preserve tinybar awareness and explicit ID formats.
- Do not regress on the warning that indexed views are not immediate proof of transaction success.
