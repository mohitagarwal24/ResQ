import { CONTRACT_CONFIG, contractUtils } from '../config/contract';

export interface Donation {
  id: string;
  bountyId: string;
  donorAddress: string;
  amount: number; // in VET
  amountWei: string;
  blockNumber: number;
  transactionHash: string;
  timestamp: Date;
}

class DonationHistoryService {
  private readonly eventApiUrl = 'https://event.api.vechain.energy';
  private readonly network = 'test'; // Use 'test' for testnet

  /**
   * Get donation history for a specific bounty by reading contract events
   */
  async getDonationHistory(bountyId: string): Promise<Donation[]> {
    try {
      console.log(`Fetching donation history for bounty ${bountyId}...`);

      // Define the Donated event signature
      const eventDefinition = 'event Donated(uint256 indexed id, address indexed donor, uint256 amountWei)';
      
      // Create filter parameters for the specific bounty
      const filterParams = new URLSearchParams({
        id: bountyId, // Filter by bounty ID
        offset: '0',
        limit: '100'
      });

      // Build the URL using VeChain Energy API
      const url = `${this.eventApiUrl}/${this.network}/${CONTRACT_CONFIG.address}/${encodeURIComponent(eventDefinition)}?${filterParams}`;
      
      console.log('Fetching from URL:', url);

      // Get logs from VeChain Energy API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch donation events: ${response.status} - ${errorText}`);
      }

      const logs = await response.json();
      const donations: Donation[] = [];

      // Process the returned logs
      if (Array.isArray(logs)) {
        for (let i = 0; i < logs.length; i++) {
          const log = logs[i];
          
          try {
            // VeChain Energy API returns decoded data directly
            const donation: Donation = {
              id: `${log.meta?.blockNumber || i}-${log.meta?.txIndex || 0}-${i}`,
              bountyId: log.id?.toString() || bountyId,
              donorAddress: log.donor || '',
              amountWei: log.amountWei?.toString() || '0',
              amount: contractUtils.weiToVet(log.amountWei?.toString() || '0'),
              blockNumber: log.meta?.blockNumber || 0,
              transactionHash: log.meta?.txID || '',
              timestamp: new Date((log.meta?.blockTimestamp || 0) * 1000)
            };

            donations.push(donation);
          } catch (decodeError) {
            console.warn('Failed to process donation event:', decodeError, log);
          }
        }
      }

      // Sort by timestamp (newest first)
      donations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      console.log(`Found ${donations.length} donations for bounty ${bountyId}`);
      return donations;

    } catch (error) {
      console.error(`Error fetching donation history for bounty ${bountyId}:`, error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get all donations across all bounties
   */
  async getAllDonations(): Promise<Donation[]> {
    try {
      console.log('Fetching all donation history...');

      // Define the Donated event signature
      const eventDefinition = 'event Donated(uint256 indexed id, address indexed donor, uint256 amountWei)';
      
      // Create filter parameters for all donations
      const filterParams = new URLSearchParams({
        offset: '0',
        limit: '1000' // Get last 1000 donations
      });

      // Build the URL using VeChain Energy API
      const url = `${this.eventApiUrl}/${this.network}/${CONTRACT_CONFIG.address}/${encodeURIComponent(eventDefinition)}?${filterParams}`;
      
      console.log('Fetching all donations from URL:', url);

      // Get logs from VeChain Energy API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch donation events: ${response.status} - ${errorText}`);
      }

      const logs = await response.json();
      const donations: Donation[] = [];

      // Process the returned logs
      if (Array.isArray(logs)) {
        for (let i = 0; i < logs.length; i++) {
          const log = logs[i];
          
          try {
            // VeChain Energy API returns decoded data directly
            const donation: Donation = {
              id: `${log.meta?.blockNumber || i}-${log.meta?.txIndex || 0}-${i}`,
              bountyId: log.id?.toString() || '0',
              donorAddress: log.donor || '',
              amountWei: log.amountWei?.toString() || '0',
              amount: contractUtils.weiToVet(log.amountWei?.toString() || '0'),
              blockNumber: log.meta?.blockNumber || 0,
              transactionHash: log.meta?.txID || '',
              timestamp: new Date((log.meta?.blockTimestamp || 0) * 1000)
            };

            donations.push(donation);
          } catch (decodeError) {
            console.warn('Failed to process donation event:', decodeError, log);
          }
        }
      }

      donations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      console.log(`Found ${donations.length} total donations`);
      return donations;

    } catch (error) {
      console.error('Error fetching all donation history:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get donation statistics for a bounty
   */
  async getDonationStats(bountyId: string): Promise<{
    totalDonations: number;
    totalAmount: number;
    uniqueDonors: number;
    averageDonation: number;
  }> {
    try {
      const donations = await this.getDonationHistory(bountyId);
      
      const totalDonations = donations.length;
      const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
      const uniqueDonors = new Set(donations.map(d => d.donorAddress)).size;
      const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

      return {
        totalDonations,
        totalAmount,
        uniqueDonors,
        averageDonation
      };
    } catch (error) {
      console.error(`Error calculating donation stats for bounty ${bountyId}:`, error);
      return {
        totalDonations: 0,
        totalAmount: 0,
        uniqueDonors: 0,
        averageDonation: 0
      };
    }
  }
}

export const donationHistoryService = new DonationHistoryService();
