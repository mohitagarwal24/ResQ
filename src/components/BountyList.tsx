import { useEffect } from 'react';
import { useBountyStore } from '../store/bountyStore';
import { useContractBounties } from '../hooks/useContractRead';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Loader2, MapPin, User, Calendar } from 'lucide-react';

interface BountyListProps {
  showDonateButton?: boolean;
}

export const BountyList = ({ showDonateButton = true }: BountyListProps) => {
  const { 
    getAllBounties, 
    setContractBounties, 
    setUseContractData 
  } = useBountyStore();
  
  const { bounties: contractBounties, loading, error, refetch } = useContractBounties();
  const { donate, isTransactionPending } = useContractTransactions();

  // Update store with contract data when available
  useEffect(() => {
    if (contractBounties.length > 0) {
      setContractBounties(contractBounties);
    } else {
      setUseContractData(false);
    }
  }, [contractBounties, setContractBounties, setUseContractData]);

  // Get bounties from store (which now handles contract vs mock data)
  const bounties = getAllBounties();

  const handleDonate = async (bountyId: string, amount: number) => {
    try {
      await donate({ bountyId, amount });
      // Refetch bounties after successful donation
      if (contractBounties.length > 0) {
        refetch();
      }
    } catch (error) {
      console.error('Donation failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ProofPending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading bounties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading bounties: {error}</p>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (bounties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bounties available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bounties.map((bounty) => {
        const progress = (bounty.currentAmount / bounty.goalAmount) * 100;
        
        return (
          <Card key={bounty.id} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
            {bounty.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={bounty.imageUrl}
                  alt={bounty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">{bounty.title}</CardTitle>
                <Badge className={`text-xs ${getStatusColor(bounty.status)}`}>
                  {bounty.status}
                </Badge>
              </div>
              
              <CardDescription className="line-clamp-3">
                {bounty.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {bounty.currentAmount.toFixed(2)} / {bounty.goalAmount.toFixed(2)} VET
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progress.toFixed(1)}% funded
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{bounty.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{bounty.organizerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{bounty.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              {showDonateButton && bounty.status === 'Open' && (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      const amount = prompt('Enter donation amount in VET:');
                      if (amount && !isNaN(parseFloat(amount))) {
                        handleDonate(bounty.id, parseFloat(amount));
                      }
                    }}
                    disabled={isTransactionPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isTransactionPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Donate VET'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
