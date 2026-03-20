# 1inch Troubleshooting

### Quote looked valid but nothing executable was submitted
**Cause**
The integration stopped at route or quote discovery instead of moving into executable transaction building or Fusion order submission.

**Fix**
- Keep quote discovery and executable transaction or order submission as separate explicit stages.
- For classic flow, request the executable transaction payload after the quote stage.
- For Fusion flow, move from quote retrieval into `createOrder(...)` and `submitOrder(...)`.

### Fusion order stays pending or never fills
**Cause**
Normal auction lifecycle delay, missing balance, missing allowance, wrong permit, or another order-state constraint is preventing completion.

**Fix**
- Inspect `getOrderStatus(...)`, especially `status`, `fills`, and failure-oriented statuses.
- Re-check maker balance, allowance, permit validity, and any preset or custom-preset assumptions.
- Keep pending orders under monitoring instead of assuming they should settle immediately.

### Wrong-chain or signer mismatch
**Cause**
`network`, wallet identity, signer configuration, and chain-specific token addresses are not aligned.

**Fix**
- Lock the chain before quote or order generation.
- Recreate signer-bound objects when account or chain changes.
- Validate that the configured network and token addresses match the intended settlement chain.

### Hardcoded spender or route assumptions caused failure
**Cause**
The integration assumed one static spender, router, or route model across chains or across classic and Fusion flows.

**Fix**
- Use the current 1inch docs surface for the live chain-specific flow.
- Keep classic and Fusion guidance separate instead of sharing one hardcoded execution model.
- Avoid teaching or generating cross-chain constants unless a current authoritative source explicitly pins them.
