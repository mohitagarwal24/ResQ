## Architecture

### Overview
- Frontend: React + Vite + TypeScript (`src/`)
- Smart Contracts: Hardhat + Solidity (`contracts/`)
- Blockchain: VeChain Thor (testnet by default)
- Storage: IPFS via Pinata for proofs (optional)

### Key Modules
- `contracts/DonationBoard.sol`
  - Manages bounties: create, donate, submit proof, release funds
  - Events: `BountyCreated`, `Donated`, `ProofSubmitted`, `FundsReleased`

- `src/providers/VeChainKitProvider.tsx`
  - Configures VeChain Kit provider, network (testnet), fee delegation, login methods

- `src/contexts/WalletContext.tsx`
  - Wallet state and helpers for connecting and interacting

- `src/services/contractReadService.ts` and `src/services/contractService.ts`
  - Read and write helpers to the `DonationBoard` contract

- `src/services/ipfsService.ts`
  - Uploads files/JSON to IPFS via Pinata when `VITE_PINATA_JWT` is set; otherwise uses a mock implementation

### Data Flow
1. User connects a wallet (VeWorld/WalletConnect) via VeChain DApp Kit.
2. Organizer posts a bounty → transaction to `createBounty`.
3. Donor sends VET → `donate` increases escrow on the contract.
4. Organizer uploads proof to IPFS → stores the IPFS hash via `submitProof`.
5. Funds released via `releaseFunds` (demo verification flag; replace with oracle in production).

### Environments
- Testnet via `VITE_THOR_NODE_URL`
- Contract address via `VITE_DONATION_BOARD_ADDRESS`
- Fee delegation configured in `VeChainKitProviderWrapper`.


