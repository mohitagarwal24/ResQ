import { Interface } from 'ethers';
import { CONTRACT_CONFIG, contractUtils } from '../config/contract';
import { getContractFunction } from '../utils/contractInterface';
import { Bounty } from '../types/bounty';

/**
 * Contract Reading Service
 * 
 * Handles reading data from the deployed VeChain contract using Thor API
 */
class ContractReadService {
  private readonly thorNodeUrl = 'https://testnet.vechain.org';

  /**
   * Make a contract call using VeChain Thor API
   */
  private async callContract(functionName: string, params: any[] = []): Promise<any> {
    const functionABI = getContractFunction[functionName as keyof typeof getContractFunction]();
    
    if (!functionABI) {
      throw new Error(`Function ${functionName} not found in ABI`);
    }

    // Encode function data
    const contractInterface = new Interface([functionABI]);
    const data = contractInterface.encodeFunctionData(functionName, params);

    // Make the contract call using the correct Thor API endpoint
    const response = await fetch(`${this.thorNodeUrl}/accounts/${CONTRACT_CONFIG.address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: '0x0',
        data: data,
        caller: '0x0000000000000000000000000000000000000000'
      })
    });

    if (!response.ok) {
      throw new Error(`Contract call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.reverted) {
      throw new Error('Contract call reverted');
    }

    // Decode the response
    if (result.data && result.data !== '0x') {
      try {
        const decoded = contractInterface.decodeFunctionResult(functionName, result.data);
        return decoded;
      } catch (error) {
        console.error('Failed to decode contract response:', error);
        throw new Error('Failed to decode contract response');
      }
    }

    return result;
  }

  /**
   * Get all bounties from the contract
   */
  async getAllBounties(): Promise<Bounty[]> {
    try {
      console.log('Fetching all bounties from contract...');
      
      const result = await this.callContract('getAllBounties');
      
      if (!result || !Array.isArray(result[0])) {
        console.log('No bounties found or invalid response format');
        return [];
      }

      const bounties: Bounty[] = [];
      const bountyArray = result[0]; // getAllBounties returns tuple[]

      for (let i = 0; i < bountyArray.length; i++) {
        const bounty = bountyArray[i];
        
        // Skip empty bounties (bounties that haven't been created)
        if (!bounty || !bounty[1] || bounty[1] === '') { // bounty[1] is title
          continue;
        }

        const transformedBounty: Bounty = {
          id: bounty[0]?.toString() || i.toString(), // bounty[0] is id
          title: bounty[1] || '', // bounty[1] is title
          description: bounty[2] || '', // bounty[2] is description
          goalAmount: contractUtils.weiToVet(bounty[3]?.toString() || '0'), // bounty[3] is goalAmountWei
          currentAmount: contractUtils.weiToVet(bounty[4]?.toString() || '0'), // bounty[4] is currentAmountWei
          location: bounty[5] || '', // bounty[5] is location
          organizerAddress: bounty[6] || CONTRACT_CONFIG.address, // bounty[6] is organizer
          organizerName: bounty[7] || 'Unknown', // bounty[7] is organizerName
          imageUrl: bounty[8] || '', // bounty[8] is imageUrl
          status: this.mapContractStatus(Number(bounty[10]) || 0), // bounty[10] is status (skip proofIpfsHash at [9])
          createdAt: new Date(Number(bounty[11] || 0) * 1000), // bounty[11] is createdAt
          updatedAt: new Date(Number(bounty[12] || 0) * 1000) // bounty[12] is updatedAt
        };

        bounties.push(transformedBounty);
      }

      console.log(`Successfully fetched ${bounties.length} bounties from contract`);
      return bounties;
    } catch (error) {
      console.error('Error fetching bounties from contract:', error);
      throw error;
    }
  }

  /**
   * Get a specific bounty by ID
   */
  async getBounty(bountyId: string): Promise<Bounty | null> {
    try {
      console.log(`Fetching bounty ${bountyId} from contract...`);
      
      const result = await this.callContract('getBounty', [bountyId]);
      
      if (!result || !result[0]) {
        console.log(`Bounty ${bountyId} not found`);
        return null;
      }

      const bounty = result[0]; // Single bounty tuple

      // Check if bounty exists (has a title)
      if (!bounty[1] || bounty[1] === '') { // bounty[1] is title
        return null;
      }

      const transformedBounty: Bounty = {
        id: bounty[0]?.toString() || bountyId, // bounty[0] is id
        title: bounty[1] || '', // bounty[1] is title
        description: bounty[2] || '', // bounty[2] is description
        goalAmount: contractUtils.weiToVet(bounty[3]?.toString() || '0'), // bounty[3] is goalAmountWei
        currentAmount: contractUtils.weiToVet(bounty[4]?.toString() || '0'), // bounty[4] is currentAmountWei
        location: bounty[5] || '', // bounty[5] is location
        organizerAddress: bounty[6] || CONTRACT_CONFIG.address, // bounty[6] is organizer
        organizerName: bounty[7] || 'Unknown', // bounty[7] is organizerName
        imageUrl: bounty[8] || '', // bounty[8] is imageUrl
        status: this.mapContractStatus(Number(bounty[10]) || 0), // bounty[10] is status (skip proofIpfsHash at [9])
        createdAt: new Date(Number(bounty[11] || 0) * 1000), // bounty[11] is createdAt
        updatedAt: new Date(Number(bounty[12] || 0) * 1000) // bounty[12] is updatedAt
      };

      console.log(`Successfully fetched bounty ${bountyId} from contract`);
      return transformedBounty;
    } catch (error) {
      console.error(`Error fetching bounty ${bountyId} from contract:`, error);
      throw error;
    }
  }

  /**
   * Get the total number of bounties
   */
  async getBountyCount(): Promise<number> {
    try {
      // If the contract has a bountyCount function, use it
      // Otherwise, we'll get all bounties and count them
      const bounties = await this.getAllBounties();
      return bounties.length;
    } catch (error) {
      console.error('Error getting bounty count:', error);
      return 0;
    }
  }

  /**
   * Map contract status number to string
   */
  private mapContractStatus(status: number): 'Open' | 'ProofPending' | 'Completed' {
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'ProofPending';
      case 2:
        return 'Completed';
      default:
        return 'Open'; // Default to Open for unknown status
    }
  }

  /**
   * Check if contract is accessible
   */
  async isContractAccessible(): Promise<boolean> {
    try {
      // Try to get bounty count as a simple contract call
      await this.getBountyCount();
      return true;
    } catch (error) {
      console.error('Contract is not accessible:', error);
      return false;
    }
  }
}

// Export singleton instance
export const contractReadService = new ContractReadService();
