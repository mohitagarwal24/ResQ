export interface Bounty {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  location: string;
  organizerAddress: string;
  organizerName: string;
  imageUrl?: string;
  status: 'Open' | 'ProofPending' | 'Completed';
  proofIpfsHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  bountyId: string;
  donorAddress: string;
  amount: number;
  transactionHash?: string;
  createdAt: Date;
}
