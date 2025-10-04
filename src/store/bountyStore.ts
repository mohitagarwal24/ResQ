import { create } from 'zustand';
import { Bounty, Donation } from '../types/bounty';

interface BountyStore {
  bounties: Bounty[];
  donations: Donation[];
  setBounties: (bounties: Bounty[]) => void;
  addBounty: (bounty: Bounty) => void;
  updateBounty: (id: string, updates: Partial<Bounty>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
  getBountyById: (id: string) => Bounty | undefined;
  getDonationsByBountyId: (bountyId: string) => Donation[];
}

export const useBountyStore = create<BountyStore>((set, get) => ({
  bounties: [],
  donations: [],

  setBounties: (bounties: Bounty[]) => {
    set({ bounties });
  },

  addBounty: (bounty: Bounty) => {
    set((state) => ({ bounties: [...state.bounties, bounty] }));
  },

  updateBounty: (id: string, updates: Partial<Bounty>) => {
    set((state) => ({
      bounties: state.bounties.map((bounty) =>
        bounty.id === id ? { ...bounty, ...updates, updatedAt: new Date() } : bounty
      )
    }));
  },

  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    set((state) => ({ donations: [...state.donations, newDonation] }));

    // Update bounty current amount
    const bounty = get().bounties.find((b) => b.id === donation.bountyId);
    if (bounty) {
      get().updateBounty(donation.bountyId, {
        currentAmount: bounty.currentAmount + donation.amount
      });
    }
  },

  getBountyById: (id: string) => {
    return get().bounties.find((bounty) => bounty.id === id);
  },

  getDonationsByBountyId: (bountyId: string) => {
    return get().donations.filter((donation) => donation.bountyId === bountyId);
  }
}));
