# FIL-Frame Troubleshooting

### `piece_cid` or proposal submission is rejected
- Symptom: the proposal reverts or providers ignore it.
**Cause**
A display CID or wrong byte encoding was passed instead of raw CommP bytes, or the `piece_size` does not match the uploaded artifact.

**Fix**
Convert the CommP CID into the byte representation expected by the contract and keep `piece_size` aligned with the upload result before calling `makeDealProposal`.

### Filfox verification fails on Calibration or Filecoin
- Symptom: deploy succeeds but explorer verification fails.
**Cause**
The wrong verifier flow was used, or deployment metadata under `deployments/solcInputs` is missing or mismatched for the target network.

**Fix**
Use `verify-contract` on Filecoin networks, and only use the ordinary Hardhat verifier on non-Filecoin networks after confirming the deployment metadata is present.

### Lighthouse metadata never appears
- Symptom: upload route returns an error after polling.
**Cause**
Data Depot did not finish creating the CAR metadata in time, or the helper never found a matching uploaded file entry.

**Fix**
Inspect the Lighthouse API key, file naming, and polling window before assuming the Filecoin contract layer is broken, and retry the upload path independently of the onchain flow.

### Frontend writes break after redeploy
- Symptom: the UI no longer matches the deployed contract shape.
**Cause**
The generated ABI artifacts or contract addresses are stale after redeploying the contracts.

**Fix**
Rerun the deploy flow so `generateTsAbis` refreshes the typed contract definitions consumed by the frontend, then update the deployed addresses used by the app.
