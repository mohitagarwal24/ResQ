import { useState } from 'react';
import { useWallet, TransactionModal } from '@vechain/vechain-kit';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { useContractBounties } from '../hooks/useContractRead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Wallet, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export const VeChainIntegration = () => {
  const { account, connection } = useWallet();
  const { 
    createBounty, 
    donate, 
    status, 
    txReceipt, 
    isTransactionPending,
    isTransactionModalOpen,
    closeTransactionModal,
    error,
    handleTryAgain
  } = useContractTransactions();
  
  const { bounties, loading: bountiesLoading, refetch } = useContractBounties();
  const [testBountyData] = useState({
    title: 'Test Emergency Relief',
    description: 'Testing VeChain Kit integration with real contract calls',
    goal: 10,
    location: 'Test Location',
    organizerName: 'Test Organizer',
    imageUrl: 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800'
  });
  
  const [lastClauses] = useState<any[]>([]);

  const handleCreateTestBounty = async () => {
    try {
      const result = await createBounty(testBountyData);
      if (result) {
        // Refetch bounties after creation
        setTimeout(() => refetch(), 2000);
      }
    } catch (error) {
      console.error('Failed to create test bounty:', error);
    }
  };

  const handleTestDonation = async (bountyId: string) => {
    try {
      const result = await donate({ bountyId, amount: 1 });
      if (result) {
        // Refetch bounties after donation
        setTimeout(() => refetch(), 2000);
      }
    } catch (error) {
      console.error('Failed to donate:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waitingConfirmation': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            VeChain Kit Integration Status
          </CardTitle>
          <CardDescription>
            Real-time wallet connection and blockchain interaction status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Connection Status</p>
              <Badge className={connection.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {connection.isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Network</p>
              <Badge variant="outline">VeChain Testnet</Badge>
            </div>
          </div>
          
          {account?.address && (
            <div>
              <p className="text-sm font-medium">Wallet Address</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {account.address}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium">Transaction Status</p>
            <Badge className={getStatusColor(status)}>
              {status || 'Ready'}
            </Badge>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Transaction Error: {error.reason || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}

          {txReceipt && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 flex items-center gap-2">
                Transaction successful! 
                <a 
                  href={`https://explore-testnet.vechain.org/transactions/${txReceipt.meta.txID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  View on Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contract Interaction Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Interaction Testing</CardTitle>
          <CardDescription>
            Test real blockchain transactions with the deployed DonationBoard contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleCreateTestBounty}
              disabled={!connection.isConnected || isTransactionPending}
              className="flex items-center gap-2"
            >
              {isTransactionPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Create Test Bounty
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Test Bounty Details:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Title: {testBountyData.title}</li>
              <li>Goal: {testBountyData.goal} VET</li>
              <li>Location: {testBountyData.location}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Contract Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Live Contract Data</CardTitle>
          <CardDescription>
            Real-time data from the VeChain blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bountiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading contract data...</span>
            </div>
          ) : bounties.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Found {bounties.length} bounties on the blockchain:
              </p>
              {bounties.slice(0, 3).map((bounty) => (
                <div key={bounty.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{bounty.title}</h4>
                    <Badge variant="outline">{bounty.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{bounty.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {bounty.currentAmount.toFixed(2)} / {bounty.goalAmount.toFixed(2)} VET
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleTestDonation(bounty.id)}
                      disabled={!connection.isConnected || isTransactionPending || bounty.status !== 'Open'}
                    >
                      Donate 1 VET
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No bounties found on the blockchain.</p>
              <p className="text-sm mt-2">Create a test bounty to see real contract data!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        status={status}
        txReceipt={txReceipt}
        txError={error}
        onTryAgain={() => {
          if (lastClauses.length > 0) {
            handleTryAgain(lastClauses);
          }
        }}
        uiConfig={{
          title: 'ResQ DAO Transaction',
          description: 'Processing your blockchain transaction...',
          showShareOnSocials: true,
          showExplorerButton: true,
          isClosable: true,
        }}
      />
    </div>
  );
};
