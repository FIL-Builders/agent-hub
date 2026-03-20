# foc-cli Troubleshooting

### `wallet init` fails or commands complain that the private key was not found
**Cause**
- The CLI has no configured credentials, or the keystore path is wrong.

**Fix**
- Rerun `wallet init` with `--auto`, `--privateKey`, or `--keystore`; in agent mode, always pass one of those flags explicitly.

### `wallet fund` does not work
**Cause**
- It is Calibration-only.

**Fix**
- Keep the command on chain `314159`; for mainnet, fund the wallet and payment account through real assets instead of the faucet.

### Upload still fails after the wallet has tokens
**Cause**
- Wallet funds and Synapse payment-account funds are different layers.

**Fix**
- Run `wallet deposit <amount>` and then confirm with `wallet balance` or `wallet summary`.

### A workflow needs provider choice, but `upload` hides it
**Cause**
- `upload` is intentionally the high-level path.

**Fix**
- Use `provider list`, `dataset create`, or `dataset upload` when provider-specific control matters.

### `docs --prompt` returns different behavior than expected
**Cause**
- The command searches `llms.txt` and may auto-fetch the top match when only a few matches exist.

**Fix**
- If you need a specific page, rerun with `--url`; if you need deeper content, rerun with `--maxDepth 6`.

### Commands behave differently in a terminal vs an agent or MCP context
**Cause**
- The repo explicitly detects agent mode and suppresses interactive flows.

**Fix**
- In agent mode, use explicit flags, structured output, and schema introspection instead of relying on interactive prompts.
