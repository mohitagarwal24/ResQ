import { useDonationHistory, useDonationStats } from '../hooks/useDonationHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Loader2, 
  Heart, 
  Users, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Coins
} from 'lucide-react';

interface DonationHistoryProps {
  bountyId: string;
}

export const DonationHistory = ({ bountyId }: DonationHistoryProps) => {
  const { donations, loading: donationsLoading, error: donationsError } = useDonationHistory(bountyId);
  const { stats, loading: statsLoading } = useDonationStats(bountyId);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const getVeChainExplorerUrl = (txHash: string) => {
    return `https://explore-testnet.vechain.org/transactions/${txHash}`;
  };

  if (donationsLoading && donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Donation History
          </CardTitle>
          <CardDescription>Real-time donation tracking from blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading donation history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (donationsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Donation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Error loading donation history: {donationsError}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Donation History
        </CardTitle>
        <CardDescription>
          Real-time donation tracking from VeChain blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donation Statistics */}
        {!statsLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Coins className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{stats.totalDonations}</div>
              <div className="text-xs text-blue-600">Total Donations</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {stats.totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">Total VET</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">{stats.uniqueDonors}</div>
              <div className="text-xs text-purple-600">Unique Donors</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Heart className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {stats.averageDonation.toFixed(2)}
              </div>
              <div className="text-xs text-orange-600">Avg VET</div>
            </div>
          </div>
        )}

        <Separator />

        {/* Donation List */}
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No donations yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Be the first to support this relief effort!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Recent Donations ({donations.length})
            </h4>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-emerald-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {formatAddress(donation.donorAddress)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {donation.amount.toFixed(2)} VET
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{donation.timestamp.toLocaleString()}</span>
                        
                        <a
                          href={getVeChainExplorerUrl(donation.transactionHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <span>{formatTransactionHash(donation.transactionHash)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-600">
                      +{donation.amount.toFixed(2)} VET
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Block #{donation.blockNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {donationsLoading && donations.length > 0 && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Updating...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
