# 1inch Workflows

### Classic executable swap planning
1. Lock the chain, token pair, wallet, and amount.
2. Discover or validate the route through the current swap docs surface.
3. Check allowance or attach permit if the input token requires authorization.
4. Request the executable transaction payload.
5. Submit through the chosen submission boundary: wallet or RPC by default, or 1inch Transaction API when the system explicitly wants that layer.

### Fusion order placement
1. Instantiate `FusionSDK` with `url`, `network`, and auth.
2. Request a quote with `getQuote(...)`.
3. Build the order with `createOrder(...)` or `placeOrder(...)`.
4. Submit the order with `submitOrder(...)` or `submitNativeOrder(...)`.
5. Monitor with `getOrderStatus(...)`, `getOrdersByMaker(...)`, or `WebSocketApi`.

### Fusion order debugging
1. Check whether `network`, `walletAddress`, and signer identity agree.
2. Inspect `OrderStatus` for allowance, permit, signature, expiration, or cancellation failures.
3. Re-check base-unit token amounts and any preset or custom preset assumptions.
