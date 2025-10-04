import { toast } from 'sonner';
import { CONTRACT_CONFIG, contractUtils } from '../config/contract';
import { getContractFunction } from '../utils/contractInterface';
// Using ethers.js compatible encoding for VeChain Kit
import { Interface } from 'ethers';

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

export interface ContractTransactionResult {
  txId: string;
  success: boolean;
  error?: string;
}

class ContractService {

  // Create bounty transaction clauses
  createBountyTransaction(params: CreateBountyParams): any[] {
    const goalAmountWei = contractUtils.vetToWei(params.goal);
    const createBountyABI = getContractFunction.createBounty();
    
    if (!createBountyABI) {
      throw new Error('createBounty function not found in ABI');
    }
    
    // Encode function data using ethers Interface
    const contractInterface = new Interface([createBountyABI]);
    const functionData = contractInterface.encodeFunctionData(
      'createBounty',
      [
        params.title,
        params.description,
        goalAmountWei, // Keep as string - ethers handles BigInt conversion
        params.location,
        params.organizerName,
        params.imageUrl || ''
      ]
    );
    
    return [{
      to: CONTRACT_CONFIG.address,
      value: '0x0',
      data: functionData,
      comment: `Create bounty: ${params.title} with goal of ${params.goal} VET (${goalAmountWei} Wei)`
    }];
  }

  // Donate transaction clauses
  donateTransaction(params: DonateParams): any[] {
    const amountWei = contractUtils.vetToWei(params.amount);
    const donateABI = getContractFunction.donate();
    
    if (!donateABI) {
      throw new Error('donate function not found in ABI');
    }
    
    // Encode function data using ethers Interface
    const contractInterface = new Interface([donateABI]);
    const functionData = contractInterface.encodeFunctionData(
      'donate',
      [params.bountyId] // Keep as string - ethers handles conversion
    );
    
    return [{
      to: CONTRACT_CONFIG.address,
      value: `0x${BigInt(amountWei).toString(16)}`,
      data: functionData,
      comment: `Donate ${params.amount} VET to bounty #${params.bountyId}`
    }];
  }

  // Submit proof transaction clauses
  submitProofTransaction(params: SubmitProofParams): any[] {
    const submitProofABI = getContractFunction.submitProof();
    
    if (!submitProofABI) {
      throw new Error('submitProof function not found in ABI');
    }
    
    // Encode function data using ethers Interface
    const contractInterface = new Interface([submitProofABI]);
    const functionData = contractInterface.encodeFunctionData(
      'submitProof',
      [BigInt(params.bountyId), params.ipfsHash] // Convert bountyId to BigInt
    );
    
    return [{
      to: CONTRACT_CONFIG.address,
      value: '0x0',
      data: functionData,
      comment: `Submit proof for bounty #${params.bountyId}`
    }];
  }

  // Release funds transaction clauses
  releaseFundsTransaction(bountyId: string, verified: boolean = true): any[] {
    const releaseFundsABI = getContractFunction.releaseFunds();
    
    if (!releaseFundsABI) {
      throw new Error('releaseFunds function not found in ABI');
    }
    
    // Encode function data using ethers Interface
    const contractInterface = new Interface([releaseFundsABI]);
    const functionData = contractInterface.encodeFunctionData(
      'releaseFunds',
      [BigInt(bountyId), verified] // Convert bountyId to BigInt
    );
    
    return [{
      to: CONTRACT_CONFIG.address,
      value: '0x0',
      data: functionData,
      comment: `Release funds for bounty #${bountyId} (${verified ? 'verified' : 'rejected'})`
    }];
  }

  // Legacy methods for backward compatibility (now return transaction clauses)
  async createBounty(params: CreateBountyParams, _walletAddress: string): Promise<any[]> {
    return this.createBountyTransaction(params);
  }

  async donate(params: DonateParams, _walletAddress: string): Promise<any[]> {
    return this.donateTransaction(params);
  }

  async submitProof(params: SubmitProofParams, _walletAddress: string): Promise<any[]> {
    return this.submitProofTransaction(params);
  }

  async releaseFunds(bountyId: string, _walletAddress: string): Promise<any[]> {
    return this.releaseFundsTransaction(bountyId);
  }

  // IPFS upload (keeping mock for now - can be replaced with real IPFS service)
  async uploadToIPFS(_file: File): Promise<string> {
    // Mock implementation - replace with real IPFS upload
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(2000);

    // Generate a realistic IPFS hash
    const hash = 'Qm' + Math.random().toString(36).substring(2, 48);
    toast.success('File uploaded to IPFS!');
    return hash;
  }

  // Utility method to extract bounty ID from transaction receipt
  extractBountyIdFromReceipt(receipt: any): string | null {
    try {
      // Look for BountyCreated event in the receipt
      const bountyCreatedEvent = receipt.outputs?.find((output: any) => 
        output.events?.some((event: any) => event.address === CONTRACT_CONFIG.address)
      );
      
      if (bountyCreatedEvent) {
        // Extract bounty ID from event data
        // This would need to be implemented based on the actual receipt structure
        return bountyCreatedEvent.events[0]?.topics?.[1] || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting bounty ID from receipt:', error);
      return null;
    }
  }
}

export const contractService = new ContractService();
