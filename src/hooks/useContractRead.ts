import { useState, useEffect, useCallback } from 'react';
import { CONTRACT_CONFIG } from '../config/contract';
import { Bounty } from '../types/bounty';

// Hook for reading all bounties from the deployed contract using VeChain Thor API
export const useContractBounties = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBounties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use VeChain Thor API to call the contract
      const response = await fetch('https://testnet.vechain.org/accounts/' + CONTRACT_CONFIG.address, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clauses: [{
            to: CONTRACT_CONFIG.address,
            value: '0x0',
            data: '0x78bd7935' // getAllBounties() function selector
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bounties from contract');
      }

      const result = await response.json();
      
      if (result.reverted) {
        throw new Error('Contract call reverted');
      }

      // For now, since contract reading is complex, let's provide some sample data
      // This will be replaced with real contract data once ABI decoding is implemented
      const sampleBounties: Bounty[] = [
        {
          id: '1',
          title: 'Emergency Water Supplies - Flood Relief',
          description: 'Providing clean water access to 200 families affected by recent floods. Funds will be used to purchase and distribute water purification tablets and portable filters.',
          goalAmount: 2500,
          currentAmount: 1800,
          location: 'Kerala, India',
          organizerAddress: CONTRACT_CONFIG.address,
          organizerName: 'Kerala Relief Foundation',
          imageUrl: 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
          status: 'Open',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          title: 'Medical Supplies - Earthquake Response',
          description: 'Urgent medical supplies needed for earthquake victims. Funds will purchase first aid kits, medicines, and emergency medical equipment.',
          goalAmount: 5000,
          currentAmount: 3200,
          location: 'Turkey',
          organizerAddress: CONTRACT_CONFIG.address,
          organizerName: 'International Red Cross',
          imageUrl: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
          status: 'Open',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18')
        }
      ];
      
      setBounties(sampleBounties);
      console.log('Loaded sample bounties for testing. Real contract integration pending.');
    } catch (err) {
      console.error('Error fetching bounties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounties');
      setBounties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchBounties();
  }, [fetchBounties]);

  return {
    bounties,
    loading,
    error,
    refetch: fetchBounties,
  };
};

// Hook for reading a single bounty from contract
export const useContractBounty = (bountyId: string | null) => {
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBounty = useCallback(async () => {
    if (!bountyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, we'll fetch from the bounties list since individual bounty fetching
      // requires the same contract reading approach
      // This will be implemented when we have proper ABI decoding
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      setBounty(null); // Will be implemented with proper contract calls
    } catch (err) {
      console.error('Error fetching bounty:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounty');
      setBounty(null);
    } finally {
      setLoading(false);
    }
  }, [bountyId]);

  // Auto-fetch when bountyId changes
  useEffect(() => {
    if (bountyId) {
      fetchBounty();
    }
  }, [fetchBounty, bountyId]);

  return {
    bounty,
    loading,
    error,
    refetch: fetchBounty,
  };
};
