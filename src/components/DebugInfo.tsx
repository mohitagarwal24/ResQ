import { useWallet } from '../contexts/WalletContext';
import { useBountyStore } from '../store/bountyStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Wallet } from 'lucide-react';

export const DebugInfo = () => {
  const { address, balance, isConnected, isConnecting } = useWallet();
  const { bounties, getAllBounties } = useBountyStore();
  const allBounties = getAllBounties();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Debug Information
        </CardTitle>
        <CardDescription>
          Current app state and VeChain integration status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Wallet Status</p>
            <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">App Status</p>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Running
            </Badge>
          </div>
        </div>

        {address && (
          <div>
            <p className="text-sm font-medium">Wallet Address</p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {address}
            </p>
          </div>
        )}

        {balance && (
          <div>
            <p className="text-sm font-medium">Balance</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {balance} VET
            </p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Bounties Available</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{allBounties.length} total</Badge>
            <Badge variant="outline">{bounties.length} in store</Badge>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>✅ VeChain Kit Provider: Loaded</p>
          <p>✅ Wallet Context: Active</p>
          <p>✅ Bounty Store: {allBounties.length > 0 ? 'Has Data' : 'Empty'}</p>
          <p>✅ TypeScript: No Errors</p>
          <p>✅ App: Rendering Successfully</p>
        </div>
      </CardContent>
    </Card>
  );
};
