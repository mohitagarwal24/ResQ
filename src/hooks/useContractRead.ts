import { useState, useEffect, useCallback } from 'react';
import { useBountyStore } from '../store/bountyStore';
import { Bounty } from '../types/bounty';

// Hook for reading all bounties - simplified version that uses store data
// TODO: Implement real contract reading when VeChain SDK issues are resolved
export const useContractBounties = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { bounties: storeBounties } = useBountyStore();

  const fetchBounties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, simulate contract call with store data
      // This prevents the white screen while we resolve VeChain SDK issues
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setBounties(storeBounties);
    } catch (err) {
      console.error('Error fetching bounties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounties');
      setBounties(storeBounties); // Fallback to store data
    } finally {
      setLoading(false);
    }
  }, [storeBounties]);

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

// Hook for reading a single bounty - simplified version
export const useContractBounty = (bountyId: string | null) => {
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getBountyById } = useBountyStore();

  const fetchBounty = useCallback(async () => {
    if (!bountyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, use store data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      const foundBounty = getBountyById(bountyId);
      setBounty(foundBounty || null);
    } catch (err) {
      console.error('Error fetching bounty:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bounty');
      setBounty(null);
    } finally {
      setLoading(false);
    }
  }, [bountyId, getBountyById]);

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
