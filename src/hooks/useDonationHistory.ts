import { useState, useEffect, useCallback } from 'react';
import { donationHistoryService, Donation } from '../services/donationHistoryService';

export const useDonationHistory = (bountyId: string | null) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    if (!bountyId) {
      setDonations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching donation history for bounty ${bountyId}...`);
      const donationHistory = await donationHistoryService.getDonationHistory(bountyId);
      setDonations(donationHistory);
      console.log(`Successfully loaded ${donationHistory.length} donations for bounty ${bountyId}`);
    } catch (err) {
      console.error('Error fetching donation history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch donation history');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, [bountyId]);

  // Auto-fetch when bountyId changes
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Listen for contract data changes (after transactions)
  useEffect(() => {
    const handleDataChange = () => {
      if (bountyId) {
        console.log(`Contract data changed, refreshing donations for bounty ${bountyId}...`);
        fetchDonations();
      }
    };

    window.addEventListener('contractDataChanged', handleDataChange);

    return () => {
      window.removeEventListener('contractDataChanged', handleDataChange);
    };
  }, [bountyId, fetchDonations]);

  return {
    donations,
    loading,
    error,
    refetch: fetchDonations,
  };
};

export const useDonationStats = (bountyId: string | null) => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    uniqueDonors: 0,
    averageDonation: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!bountyId) {
      setStats({
        totalDonations: 0,
        totalAmount: 0,
        uniqueDonors: 0,
        averageDonation: 0
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const donationStats = await donationHistoryService.getDonationStats(bountyId);
      setStats(donationStats);
    } catch (err) {
      console.error('Error fetching donation stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch donation stats');
    } finally {
      setLoading(false);
    }
  }, [bountyId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Listen for contract data changes
  useEffect(() => {
    const handleDataChange = () => {
      if (bountyId) {
        fetchStats();
      }
    };

    window.addEventListener('contractDataChanged', handleDataChange);

    return () => {
      window.removeEventListener('contractDataChanged', handleDataChange);
    };
  }, [bountyId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
