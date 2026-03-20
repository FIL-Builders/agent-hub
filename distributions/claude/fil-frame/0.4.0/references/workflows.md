# FIL-Frame Workflows

### Deploy, verify, and sync frontend ABIs
1. Deploy `DealClient` and `DealInfo` through the Hardhat deploy scripts.
2. On Filecoin networks, rerun with `VERIFY=true` so the deploy scripts invoke `verify-contract`.
3. Let `99_generateTsAbis.ts` regenerate frontend ABI artifacts after deployment.
4. Only then wire the resulting contract addresses and ABI outputs into the Next.js app.

### Upload through Lighthouse and submit a deal
1. Upload the file through the Lighthouse route or hook so the app receives `pieceCid`, `pieceSize`, `carLink`, and `carSize`.
2. Seed a review form with `getDefaultDealInputs`.
3. Build the final nested request with `createDealObject`.
4. Submit `makeDealProposal` through the generated contract ABI or `makeDealFunction`.
