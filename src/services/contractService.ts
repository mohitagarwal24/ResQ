import { toast } from 'sonner';

export interface CreateBountyParams {
  title: string;
  description: string;
  goal: number;
  location: string;
  organizerName: string;
  imageUrl?: string;
}

export interface DonateParams {
  bountyId: string;
  amount: number;
}

export interface SubmitProofParams {
  bountyId: string;
  ipfsHash: string;
}

class ContractService {
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async createBounty(_params: CreateBountyParams, _walletAddress: string): Promise<string> {
    await this.mockDelay(1500);

    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    toast.success('Bounty created successfully!');
    return txHash;
  }

  async donate(params: DonateParams, _walletAddress: string): Promise<string> {
    await this.mockDelay(2000);

    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    toast.success(`Donated ${params.amount} VET successfully!`);
    return txHash;
  }

  async submitProof(_params: SubmitProofParams, _walletAddress: string): Promise<string> {
    await this.mockDelay(1500);

    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    toast.success('Proof submitted successfully!');
    return txHash;
  }

  async releaseFunds(_bountyId: string, _walletAddress: string): Promise<string> {
    await this.mockDelay(2000);

    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    toast.success('Funds released to organizer!');
    return txHash;
  }

  async uploadToIPFS(_file: File): Promise<string> {
    await this.mockDelay(2000);

    const hash = 'Qm' + Math.random().toString(36).substring(2, 48);
    toast.success('File uploaded to IPFS!');
    return hash;
  }
}

export const contractService = new ContractService();
