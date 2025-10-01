import { useState } from 'react';
import { BountyCard } from '../components/BountyCard';
import { useBountyStore } from '../store/bountyStore';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';

export const BountyBoardPage = () => {
  const { bounties } = useBountyStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBounties = bounties.filter((bounty) => {
    const matchesStatus = selectedStatus === 'all' || bounty.status === selectedStatus;
    const matchesSearch =
      searchQuery === '' ||
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.organizerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Active Relief Bounties</h1>
          <p className="text-muted-foreground">
            Support disaster relief efforts with transparent, verified donations
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, location, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>

          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="all" className="text-sm">
                All ({bounties.length})
              </TabsTrigger>
              <TabsTrigger value="Open" className="text-sm">
                Open ({bounties.filter((b) => b.status === 'Open').length})
              </TabsTrigger>
              <TabsTrigger value="ProofPending" className="text-sm">
                Proof Pending ({bounties.filter((b) => b.status === 'ProofPending').length})
              </TabsTrigger>
              <TabsTrigger value="Completed" className="text-sm">
                Completed ({bounties.filter((b) => b.status === 'Completed').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredBounties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bounties found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
