## Troubleshooting

### Cannot connect wallet
- Ensure `VITE_WALLETCONNECT_PROJECT_ID` is set.
- Testnet only: network type is `test` in `VeChainKitProviderWrapper`.

### Deployment fails (Hardhat)
- Check `VITE_THOR_NODE_URL` is reachable.
- Ensure `DEPLOYER_PRIVATE_KEY` has testnet VET/VTHO.

### IPFS upload failing
- Set `VITE_PINATA_JWT` for Pinata; otherwise, the app falls back to mock uploads.

### Contract calls revert
- Verify `VITE_DONATION_BOARD_ADDRESS` matches your deployed address.
- Ensure you are on VeChain testnet.

### UI not loading
- Run `npm run dev` and open the correct port (default 5173).
- Check browser console for module import errors.


