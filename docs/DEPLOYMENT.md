## Deployment

This project ships with Hardhat for contract deployment on VeChain testnet and Vite for the frontend.

### 1. Prepare Environment
```
VITE_THOR_NODE_URL=https://testnet.vechain.org
DEPLOYER_PRIVATE_KEY=0x...
```
To get the private key from mnemonic you can use vechain sdk.
There is a script for that too in /scripts, you just have to put mnemonic in .env and set the number of accounts associated with that wallet. Then run:
```bash
npm run gen:pk
```
Paste your desired private key into .env for deployment.

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Deploy to VeChain Testnet
```bash
npm run deploy:contracts
```
This runs the deployment script and prints the `DonationBoard` contract address.

### 4. Configure Frontend
Add the contract address to `.env`:
```
VITE_DONATION_BOARD_ADDRESS=0xDeployedAddress
```

### 5. Start Frontend
```bash
npm run dev
```

### Contract Docs
See `README_CONTRACTS.md` for the contract API and details.


