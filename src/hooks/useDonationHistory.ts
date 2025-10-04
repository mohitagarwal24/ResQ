import { useState, useEffect, useCallback } from 'react';
import { donationHistoryService, Donation } from '../services/donationHistoryService';
import { refreshService } from '../services/refreshService';

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

  // Register with centralized refresh service
  useEffect(() => {
    if (bountyId) {
      const refreshId = `donations-${bountyId}`;
      refreshService.register(refreshId, fetchDonations, 3); // Lower priority
      
      return () => {
        refreshService.unregister(refreshId);
      };
    }
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

  // Register with centralized refresh service
  useEffect(() => {
    if (bountyId) {
      const refreshId = `donation-stats-${bountyId}`;
      refreshService.register(refreshId, fetchStats, 4); // Lowest priority
      
      return () => {
        refreshService.unregister(refreshId);
      };
    }
  }, [bountyId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
