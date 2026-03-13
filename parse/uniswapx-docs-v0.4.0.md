# UniswapX Documentation Pack

## Target
- Pack: `agents/uniswapx/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current Uniswap docs at `https://docs.uniswap.org/contracts/uniswapx/overview`

## Source Inventory
- Current UniswapX docs
- `agents/uniswapx/0.3.0.md` for coverage audit only

## Decision Rules
- Quote flows should echo `requestId` and `quoteId` unchanged.
- Use Orders API for open-order discovery and Reactor contracts for execution.
- Keep classic quoter HTTP behavior separate from onchain reactor execution.

## Common Confusions
- Declining to quote should return `204`, not a slow or malformed `200`.
- Orders discovery and execution are different stages and different interfaces.
- `executeWithCallback` is for specialized strategies, not the default direct fill path.

## Failure Modes
- Fillers drop request identifiers and lose reconciliation traceability.
- Onchain execution starts before approvals or order validation are complete.
- Integrations blur quote and reactor responsibilities.

## Coverage Map

### Quote API
- `quoter.quote`

### Orders API
- `orders.list`

### Reactor
- `IReactor.execute`
- `IReactor.executeWithCallback`

## Must-Not-Regress Insights
- Preserve `requestId` and `quoteId` echoing.
- Preserve the quote → discover → execute mental model.
- Preserve the distinction between direct execute and callback execution.
