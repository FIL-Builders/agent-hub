# UniswapX Integrator APIs Workflows

### Fill An Order End To End
1. Implement `quoter.quote` and either return a quote or `204`.
2. Discover eligible open orders with `orders.list`.
3. Validate token and chain assumptions against the order.
4. Prepare approvals and execution state.
5. Call `IReactor.execute` or `IReactor.executeWithCallback` as appropriate.

### Keep Quote And Execution Reconciled
1. Preserve `requestId` and `quoteId` exactly from the quote phase.
2. Store them alongside any discovered order identifier.
3. Attach the execution transaction hash to the same reconciliation record after reactor execution.
