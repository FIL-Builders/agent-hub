# ethers Troubleshooting

### Invalid checksum or address parsing errors
**Cause**
`getAddress` throws when mixed-case input has the wrong checksum, and ENS names are not raw addresses.

**Fix**
Use `isAddress` for a boolean pre-check, normalize with `getAddress`, and resolve ENS names through a provider before treating them as addresses.

### Contract writes fail even though reads work
**Cause**
The `Contract` instance is connected only to a provider, so it cannot sign state-changing methods.

**Fix**
Reconnect the contract with a signer-backed runner before sending writes.

### Token transfer fails on the wrong network
**Cause**
The wallet is connected to a different chain than the token address or assumptions used by the application.

**Fix**
Compare the active chain from the provider with the expected chain before constructing the token contract, and block the write path until the wallet is on the correct network.

### User-entered token amount is rejected or behaves unexpectedly
**Cause**
The input has more decimals than the token supports, was parsed through floating-point code, or came from an input mode that allowed malformed numeric strings.

**Fix**
Keep the raw value as text, validate it before conversion, and use `parseUnits` with the correct token decimals instead of `Number`, `parseFloat`, or `parseEther`.

### Message verification returns the wrong signer
**Cause**
The signed payload representation differs from what is being verified, such as raw bytes versus a UTF-8 string.

**Fix**
Make the signed challenge explicit, keep encoding consistent across signer and verifier, and use `verifyMessage` only for EIP-191 personal-sign flows.
