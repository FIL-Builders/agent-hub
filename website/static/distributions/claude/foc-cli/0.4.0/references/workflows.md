# foc-cli Workflows

### First-time testnet setup
1. Run `npx foc-cli wallet init --auto`.
2. Run `npx foc-cli wallet fund`.
3. Run `npx foc-cli wallet deposit 1`.
4. Confirm state with `npx foc-cli wallet balance` or `wallet summary`.

### Recommended single-file upload
1. Make sure the wallet is initialized and the payment account is funded.
2. Run `npx foc-cli upload ./myfile.pdf`.
3. If redundancy or CDN behavior matters, add `--copies` and `--withCDN`.
4. Use the returned piece and dataset scanner URLs for follow-up inspection.

### Batch upload
1. Estimate or top up funding first if needed.
2. Run `npx foc-cli multi-upload ./a.pdf,./b.pdf`.
3. Review the returned per-provider copy results, dataset IDs, and transaction explorer URLs.

### Manual provider-driven dataset workflow
1. Run `npx foc-cli provider list`.
2. Create a dataset with `npx foc-cli dataset create <providerId>`.
3. Or use `npx foc-cli dataset upload <path> <providerId>` to create and upload in one step.
4. Inspect with `dataset details` or `piece list`.

### Inspect funding runway before a larger upload
1. Run `npx foc-cli wallet costs --extraBytes <n> --extraRunway <months>`.
2. If `alreadyCovered` is false, deposit more with `wallet deposit`.
3. Re-run `wallet summary` to confirm runway.

### Search the docs surface
1. Run `npx foc-cli docs --prompt "upload storage"` for topic search.
2. If you need a specific page, rerun with `--url`.
3. Use `--maxDepth 6` when default filtering hides details you need.
