## DonationBoard Solidity Contract and Deployment (VeChain Testnet)

### Prereqs
- Node 18+
- Funded testnet account private key (VET/VTHO on VeChain testnet)
- Thor RPC URL (testnet): set `VITE_THOR_NODE_URL`

### Env
Create `.env` in repo root:

```
DEPLOYER_PRIVATE_KEY=0x...
VITE_THOR_NODE_URL=https://testnet.vechain.org
```

(You can keep your frontend `.env` vars in the same file.)

### Install
```
npm i
```

### Compile
```
npx hardhat compile
```

### Deploy (testnet)
```
npm run deploy:contracts
```
This runs `hardhat run scripts/deploy.ts --network vechainTest`.

- Copy the printed address into your frontend `.env` as `VITE_DONATION_BOARD_ADDRESS`.
- Export ABI for frontend: after compile, copy `artifacts/contracts/DonationBoard.sol/DonationBoard.json`'s `abi` array to `src/abi/DonationBoard.json`.

### Contract API
- createBounty(title, description, goalAmountWei, location, organizerName, imageUrl) returns bountyId
- donate(bountyId) payable: send VET
- submitProof(bountyId, ipfsHash) only organizer; sets status ProofPending
- releaseFunds(bountyId, verified) only organizer; transfers escrow and marks Completed
- getAllBounties() view returns array

Note: `verified` is a placeholder for an oracle/AI verifier. Replace with a trusted validation mechanism in production.

### Local Development with Thor Solo (optional)
- Run a Thor Solo node and set `VITE_THOR_NODE_URL` to the local endpoint.
- Fund your deployer account on the local chain.


