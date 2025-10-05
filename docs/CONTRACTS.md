## Contracts

Primary contract: `contracts/DonationBoard.sol`

### API
- `createBounty(title, description, goalAmountWei, location, organizerName, imageUrl) → bountyId`
- `donate(bountyId) payable`
- `submitProof(bountyId, ipfsHash)` — organizer only
- `releaseFunds(bountyId, verified)` — organizer only (demo placeholder for verifier)
- `getAllBounties() view`

See additional details and deployment commands in `README_CONTRACTS.md`.


