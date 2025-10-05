## Setup

### Prerequisites
- Node 18+
- Git
- VeChain testnet wallet (for deployment)

### Install Dependencies
```bash
npm i
```

### Environment Variables
Create `.env` in the project root:
```bash
# VeChain Network
VITE_THOR_NODE_URL=https://testnet.vechain.org

# Deployed Contract Address (update after deployment)
VITE_DONATION_BOARD_ADDRESS=0x84c279658b29de90f8edb14dd833be96d62a744e

# Privy Configuration (get from privy.io)
VITE_PRIVY_APP_ID=your-privy-app-id-here

# WalletConnect (optional)
VITE_WALLETCONNECT_PROJECT_ID=default-project-id

# IPFS Upload Service (optional - choose one)
VITE_PINATA_JWT=your-pinata-jwt-token

# Contract Deployment Keys
VITE_DEPLOYER_PRIVATE_KEY=0x...
VITE_MNEMONIC=word1 word2 ... word12
VITE_DERIVATION_COUNT=2
```

### Run Development Server
```bash
npm run dev
```

Open the app at `http://localhost:5173`.


