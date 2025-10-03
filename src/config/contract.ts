import DonationBoardABI from '../abi/DonationBoard.json';

// Contract configuration
export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_DONATION_BOARD_ADDRESS as string,
  abi: DonationBoardABI,
} as const;

// Validate contract configuration
if (!CONTRACT_CONFIG.address) {
  throw new Error('VITE_DONATION_BOARD_ADDRESS environment variable is not set');
}

// Contract status enum mapping (matches Solidity enum)
export const CONTRACT_STATUS = {
  Open: 0,
  ProofPending: 1,
  Completed: 2,
} as const;

export const STATUS_LABELS = {
  [CONTRACT_STATUS.Open]: 'Open',
  [CONTRACT_STATUS.ProofPending]: 'ProofPending',
  [CONTRACT_STATUS.Completed]: 'Completed',
} as const;

// Utility functions for contract data conversion
export const contractUtils = {
  // Convert VET to Wei (18 decimals)
  vetToWei: (vet: number): string => {
    return (BigInt(Math.floor(vet * 1e18))).toString();
  },

  // Convert Wei to VET
  weiToVet: (wei: string | bigint): number => {
    const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
    return Number(weiValue) / 1e18;
  },

  // Format VET amount for display
  formatVET: (wei: string | bigint, decimals: number = 4): string => {
    const vet = contractUtils.weiToVet(wei);
    return vet.toFixed(decimals);
  },

  // Convert contract status number to string
  getStatusLabel: (status: number): string => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || 'Unknown';
  },

  // Convert timestamp to Date
  timestampToDate: (timestamp: string | number): Date => {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    return new Date(ts * 1000);
  },
};

export type ContractBounty = {
  id: bigint;
  title: string;
  description: string;
  goalAmountWei: bigint;
  currentAmountWei: bigint;
  location: string;
  organizer: string;
  organizerName: string;
  imageUrl: string;
  proofIpfsHash: string;
  status: number;
  createdAt: bigint;
  updatedAt: bigint;
};
