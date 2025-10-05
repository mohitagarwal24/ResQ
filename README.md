## ResQ — Proof-of-Relief Donation Board (VeChain)

ResQ is a decentralized donation board for disaster relief built on VeChain. Organizers post verifiable relief bounties, donors fund them in VET, organizers submit proof of relief to IPFS, and funds are released once verified.

### Tech Stack
- React + Vite + TypeScript
- VeChain DApp Kit (`@vechain/vechain-kit`, `@vechain/dapp-kit-react`) with fee delegation
- Hardhat + Solidity (`contracts/DonationBoard.sol`)
- IPFS via Pinata for proof storage

### Quick Start
1) Prereqs
- Node 18+
- VeChain Testnet account with VET/VTHO (for deployment); end-users benefit from fee delegation

2) Install
```bash
npm i
```

3) Configure environment — create `.env` in the repo root:
```bash
# VeChain Network
VITE_THOR_NODE_URL=https://testnet.vechain.org

# Deployed Contract Address (update after deployment)
VITE_DONATION_BOARD_ADDRESS=0x84c279658b29de90f8edb14dd833be96d62a744e

# Privy Configuration (get from privy.io)
VITE_PRIVY_APP_ID=your-privy-app-id-here

# WalletConnect (optional)
VITE_WALLETCONNECT_PROJECT_ID=default-project-id

# IPFS Upload Service
VITE_PINATA_JWT=your-pinata-jwt-token

# Contract Deployment Keys
VITE_DEPLOYER_PRIVATE_KEY=0x...
VITE_MNEMONIC=word1 word2 ... word12
VITE_DERIVATION_COUNT=2
```

4) Deploy contract to testnet (optional if you already have an address like you can use the one I deployed which is 0x2e7a9ad2c68a6431c6741d800f7f2efbcafd4b39)
```bash
npx hardhat compile
npm run deploy:contracts
```
Copy the printed address into `.env` as `VITE_DONATION_BOARD_ADDRESS`.

5) Run the app
```bash
npm run dev
```

### How It Works
- Post bounty: organizer sets title, description, location, goal, and image.
- Donate: anyone can donate VET to the bounty escrow.
- Submit proof: organizer uploads proof (e.g., images/JSON) to IPFS.
- Release funds: organizer calls release with a verification flag.

### Key Scripts
- `npm run dev` — start web app
- `npm run build` — build frontend
- `npm run deploy:contracts` — deploy Solidity contract to VeChain testnet (only if you want your own donationboard contract)

### Documentation
- Setup: `docs/SETUP.md`
- Deployment: `docs/DEPLOYMENT.md`
- Architecture: `docs/ARCHITECTURE.md`
- VeChain integration: `docs/VECHAIN.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
- Contract details: `README_CONTRACTS.md`

### Security & Notes
- The `verified` flag in `releaseFunds` is a demo placeholder; do not rely on organizer-provided verification in production.
- Always protect private keys and never commit secrets. Use `.env` and a secrets manager.

### License
MIT


