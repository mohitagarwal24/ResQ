import { useState, useEffect, useCallback } from 'react';
import { contractReadService } from '../services/contractReadService';
import { refreshService } from '../services/refreshService';
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
      console.log('Fetching bounties from deployed contract...');
      
      // Get real bounties from the contract
      const contractBounties = await contractReadService.getAllBounties();
      
      setBounties(contractBounties);
      console.log(`Successfully loaded ${contractBounties.length} bounties from contract`);
    } catch (err) {
      console.error('Error fetching bounties from contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounties from contract');
      
      // Fallback to empty array on error
      setBounties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount and register with refresh service
  useEffect(() => {
    fetchBounties();
    
    // Register with centralized refresh service
    refreshService.register('bounties', fetchBounties, 1); // High priority
    
    return () => {
      refreshService.unregister('bounties');
    };
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
      console.log(`Fetching bounty ${bountyId} from deployed contract...`);
      
      // Get real bounty from the contract
      const contractBounty = await contractReadService.getBounty(bountyId);
      
      setBounty(contractBounty);
      
      if (contractBounty) {
        console.log(`Successfully loaded bounty ${bountyId} from contract`);
      } else {
        console.log(`Bounty ${bountyId} not found in contract`);
      }
    } catch (err) {
      console.error(`Error fetching bounty ${bountyId} from contract:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounty from contract');
      setBounty(null);
    } finally {
      setLoading(false);
    }
  }, [bountyId]);

  // Auto-fetch when bountyId changes and register with refresh service
  useEffect(() => {
    if (bountyId) {
      fetchBounty();
      
      // Register with centralized refresh service using bounty-specific ID
      const refreshId = `bounty-${bountyId}`;
      refreshService.register(refreshId, fetchBounty, 2); // Medium priority
      
      return () => {
        refreshService.unregister(refreshId);
      };
    }
  }, [fetchBounty, bountyId]);

  return {
    bounty,
    loading,
    error,
    refetch: fetchBounty,
  };
};
