import { useState, useEffect, useCallback } from 'react';
import { contractReadService } from '../services/contractReadService';
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

  // Auto-fetch on mount and when contract data changes
  useEffect(() => {
    fetchBounties();
    
    // Listen for contract data changes (after transactions) with debounce
    let refreshTimeout: NodeJS.Timeout;
    const handleDataChange = () => {
      // Clear any existing timeout
      clearTimeout(refreshTimeout);
      // Debounce the refresh to avoid multiple rapid calls
      refreshTimeout = setTimeout(() => {
        console.log('Contract data changed, refreshing bounties...');
        fetchBounties();
      }, 1000); // Wait 1 second before refreshing
    };
    
    window.addEventListener('contractDataChanged', handleDataChange);
    
    return () => {
      window.removeEventListener('contractDataChanged', handleDataChange);
      clearTimeout(refreshTimeout);
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

  // Auto-fetch when bountyId changes and when contract data changes
  useEffect(() => {
    if (bountyId) {
      fetchBounty();
    }
    
    // Listen for contract data changes (after transactions) with debounce
    let refreshTimeout: NodeJS.Timeout;
    const handleDataChange = () => {
      if (bountyId) {
        // Clear any existing timeout
        clearTimeout(refreshTimeout);
        // Debounce the refresh to avoid multiple rapid calls
        refreshTimeout = setTimeout(() => {
          console.log(`Contract data changed, refreshing bounty ${bountyId}...`);
          fetchBounty();
        }, 1000); // Wait 1 second before refreshing
      }
    };
    
    window.addEventListener('contractDataChanged', handleDataChange);
    
    return () => {
      window.removeEventListener('contractDataChanged', handleDataChange);
      clearTimeout(refreshTimeout);
    };
  }, [fetchBounty, bountyId]);

  return {
    bounty,
    loading,
    error,
    refetch: fetchBounty,
  };
};
