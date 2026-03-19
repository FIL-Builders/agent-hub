# ethers Workflows

### Connect a browser wallet and send a transaction
1. Wrap `window.ethereum` in `BrowserProvider`.
2. Request account access and obtain a signer.
3. Build transaction values with `parseEther` or `parseUnits`.
4. Send the transaction and wait for confirmation when subsequent logic depends on it.

### Submit an ERC-20 transfer from a browser form
1. Wrap the injected provider in `BrowserProvider`.
2. Request accounts and obtain a signer.
3. Verify the active network matches the chain-specific token address you intend to use.
4. Normalize the recipient with `getAddress`.
5. Parse the user-entered amount with `parseUnits(value, tokenDecimals)`.
6. Instantiate a `Contract` with a minimal ERC-20 ABI and the signer.
7. Call `transfer(recipient, amount)` and wait for confirmation before showing success.
8. Invalidate cached signer and contract state on `accountsChanged` and `chainChanged`.

### Read from a contract in a backend or script
1. Create a `JsonRpcProvider` with an explicit endpoint.
2. Instantiate `Contract` with a minimal ABI and the provider.
3. Call view methods and format the returned values for presentation only when needed.

### Deploy a contract from a compiled artifact
1. Load ABI and bytecode from the same build artifact.
2. Create a signer-connected `ContractFactory`.
3. Call `deploy(...)`, then `waitForDeployment()`.
4. Persist the deployed address and relevant chain metadata together.
