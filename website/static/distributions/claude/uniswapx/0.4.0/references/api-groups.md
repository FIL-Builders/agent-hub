# UniswapX Integrator APIs API Groups

### Quote Service
**Exports**
- quoter.quote

Last-look quote generation for fillers or integrated quoting systems.

#### quoter.quote
**Kind**
endpoint

**Summary**
Generate or decline a UniswapX quote request using the quoter HTTP contract.

**Definition**
Language: http
Source: UniswapX quoter docs and prior pack coverage

```http
POST /quote
Content-Type: application/json

{
  "requestId": "uuid",
  "swapper": "0x...",
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amount": "string",
  "type": "EXACT_INPUT"
}
```

**Guidance**
- Echo `requestId` and `quoteId` unchanged in successful responses.
- Return `204` quickly if you decline to quote.
- Validate chain IDs, token addresses, and amount strings before performing pricing logic.

**Example**
Language: json
Description: Minimal quote request payload.

```json
{
  "requestId": "8a1f1f34-4d31-4cf9-9a63-df3d2ef70001",
  "swapper": "0x1111111111111111111111111111111111111111",
  "tokenIn": "0xaaa...",
  "tokenOut": "0xbbb...",
  "amount": "1000000",
  "type": "EXACT_INPUT"
}
```

### Orders Discovery
**Exports**
- orders.list

Read-side order discovery used before execution.

#### orders.list
**Kind**
endpoint

**Summary**
List open or filtered orders from the UniswapX orders API.

**Definition**
Language: http
Source: UniswapX orders API docs and prior pack coverage

```http
GET /v2/orders?orderStatus=open&chainId=1&limit=20
```

**Guidance**
- Use this to discover candidate fills and reconcile quoter activity.
- Keep filtering explicit by `orderStatus` and `chainId`.
- Treat the Orders API as a read surface, not as the place where execution happens.

**Example**
Language: bash
Description: Fetch open mainnet orders.

```bash
curl -sS "https://api.uniswap.org/v2/orders?orderStatus=open&chainId=1&limit=20"
```

### Reactor Execution
**Exports**
- IReactor.execute
- IReactor.executeWithCallback

Onchain fill execution after order validation and token-approval preparation.

#### IReactor.execute
**Kind**
function

**Summary**
Execute an order directly through the UniswapX reactor.

**Definition**
Language: solidity
Source: UniswapX reactor docs and prior pack coverage

```solidity
interface IReactor {
  function execute(bytes calldata order) external;
}
```

**Guidance**
- Use this for ordinary direct execution after the order and allowances are ready.
- Validate token approvals and route state before broadcasting the transaction.
- Keep execution metadata keyed by `quoteId` or `requestId` so the HTTP and onchain phases stay linked.

**Example**
Language: solidity
Description: Execute a prepared order directly.

```solidity
IReactor(reactor).execute(order);
```

#### IReactor.executeWithCallback
**Kind**
function

**Summary**
Execute an order through the reactor with callback data for more specialized strategies.

**Definition**
Language: solidity
Source: UniswapX reactor docs and prior pack coverage

```solidity
interface IReactor {
  function executeWithCallback(bytes calldata order, bytes calldata data) external;
}
```

**Guidance**
- Use this only when your strategy needs callback-driven execution behavior.
- Keep callback payload construction explicit and audited; it adds complexity beyond the direct fill path.
- Do not use it as a default substitute for `execute`.

**Example**
Language: solidity
Description: Route a prepared order through callback execution.

```solidity
IReactor(reactor).executeWithCallback(order, data);
```
