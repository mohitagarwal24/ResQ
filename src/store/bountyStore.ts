import { create } from 'zustand';
import { Bounty, Donation } from '../types/bounty';

interface BountyStore {
  bounties: Bounty[];
  donations: Donation[];
  addBounty: (bounty: Omit<Bounty, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount' | 'status'>) => void;
  updateBounty: (id: string, updates: Partial<Bounty>) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
  getBountyById: (id: string) => Bounty | undefined;
  getDonationsByBountyId: (bountyId: string) => Donation[];
}

const mockBounties: Bounty[] = [
  {
    id: '1',
    title: 'Water Filters for Kerala Floods',
    description: 'Providing clean water access to 500 families affected by devastating floods in Kerala. Funds will be used to purchase and distribute portable water filtration systems.',
    goalAmount: 5000,
    currentAmount: 3200,
    location: 'Kerala, India',
    organizerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    organizerName: 'Kerala Relief Foundation',
    imageUrl: 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Open',
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: '2',
    title: 'Emergency Medical Supplies - Haiti',
    description: 'Urgent need for medical supplies following earthquake. Funding will cover antibiotics, bandages, and emergency surgical equipment for field hospitals.',
    goalAmount: 10000,
    currentAmount: 8500,
    location: 'Port-au-Prince, Haiti',
    organizerAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    organizerName: 'Doctors Without Borders',
    imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'ProofPending',
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-25')
  },
  {
    id: '3',
    title: 'Shelter Materials - Turkey Earthquake',
    description: 'Building temporary shelters for 200 displaced families. Materials include weatherproof tents, thermal blankets, and portable heaters for winter conditions.',
    goalAmount: 7500,
    currentAmount: 7500,
    location: 'Gaziantep, Turkey',
    organizerAddress: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    organizerName: 'Turkish Red Crescent',
    imageUrl: 'https://images.pexels.com/photos/6995242/pexels-photo-6995242.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Completed',
    proofIpfsHash: 'QmXxx123...',
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-28')
  },
  {
    id: '4',
    title: 'Food Packages - Somalia Drought',
    description: 'Distributing 1000 emergency food packages to communities affected by severe drought. Each package contains rice, lentils, oil, and nutritional supplements.',
    goalAmount: 4000,
    currentAmount: 1200,
    location: 'Mogadishu, Somalia',
    organizerAddress: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148',
    organizerName: 'World Food Programme',
    imageUrl: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Open',
    createdAt: new Date('2025-09-25'),
    updatedAt: new Date('2025-09-25')
  }
];

const mockDonations: Donation[] = [
  {
    id: 'd1',
    bountyId: '1',
    donorAddress: '0x123...abc',
    amount: 500,
    transactionHash: '0xabc123...',
    createdAt: new Date('2025-09-21')
  },
  {
    id: 'd2',
    bountyId: '1',
    donorAddress: '0x456...def',
    amount: 1000,
    transactionHash: '0xdef456...',
    createdAt: new Date('2025-09-22')
  },
  {
    id: 'd3',
    bountyId: '1',
    donorAddress: '0x789...ghi',
    amount: 1700,
    transactionHash: '0xghi789...',
    createdAt: new Date('2025-09-24')
  },
  {
    id: 'd4',
    bountyId: '2',
    donorAddress: '0xabc...123',
    amount: 2500,
    transactionHash: '0x123abc...',
    createdAt: new Date('2025-09-19')
  },
  {
    id: 'd5',
    bountyId: '2',
    donorAddress: '0xdef...456',
    amount: 6000,
    transactionHash: '0x456def...',
    createdAt: new Date('2025-09-23')
  }
];

export const useBountyStore = create<BountyStore>((set, get) => ({
  bounties: mockBounties,
  donations: mockDonations,

  addBounty: (bounty) => {
    const newBounty: Bounty = {
      ...bounty,
      id: Date.now().toString(),
      currentAmount: 0,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({ bounties: [...state.bounties, newBounty] }));
  },

  updateBounty: (id, updates) => {
    set((state) => ({
      bounties: state.bounties.map((bounty) =>
        bounty.id === id ? { ...bounty, ...updates, updatedAt: new Date() } : bounty
      )
    }));
  },

  addDonation: (donation) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    set((state) => ({ donations: [...state.donations, newDonation] }));

    const bounty = get().bounties.find((b) => b.id === donation.bountyId);
    if (bounty) {
      get().updateBounty(donation.bountyId, {
        currentAmount: bounty.currentAmount + donation.amount
      });
    }
  },

  getBountyById: (id) => {
    return get().bounties.find((bounty) => bounty.id === id);
  },

  getDonationsByBountyId: (bountyId) => {
    return get().donations.filter((donation) => donation.bountyId === bountyId);
  }
}));
