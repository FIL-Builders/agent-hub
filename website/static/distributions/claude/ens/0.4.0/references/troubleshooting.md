# ENS Troubleshooting

### Reverse Lookup Returns A Name But It Should Not Be Displayed
**Cause**
The address has a reverse record, but the name does not forward-resolve back to the same address on the relevant chain, so the primary-name relationship is invalid.

**Fix**
- Use `getName` and check `match`.
- If `match` is false, display the raw address.
- Correct the forward address record and reverse record together before treating the name as a primary name.

### Record Update Fails On A Resolver
**Cause**
The resolver does not support the requested interface, the wrong resolver address was assumed, or the connected account is not the effective manager.

**Fix**
- Call `getResolver` first and stop hardcoding assumptions.
- Check support with `getSupportedInterfaces`.
- Confirm manager or wrapper ownership state before writing.

### Registration Or Renewal Underpays
**Cause**
The task used a stale price quote or failed to include a safety buffer over `base + premium`.

**Fix**
- Re-run `getPrice` close to the write.
- Compute `base + premium` and add headroom before passing `value`.
- Keep commit timing and reveal timing explicit in registration flows.
