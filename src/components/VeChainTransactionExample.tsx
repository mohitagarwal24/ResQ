import { useState, useCallback, useMemo } from 'react';
import { 
  useWallet, 
  useSendTransaction, 
  useTransactionModal, 
  TransactionModal 
} from '@vechain/vechain-kit';
import { contractService } from '../services/contractService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

/**
 * VeChain Transaction Example Component
 * 
 * This component demonstrates the correct implementation of VeChain Kit v2
 * transaction patterns following the official documentation:
 * - https://docs.vechainkit.vechain.org/hooks/transactions
 * - https://docs.vechainkit.vechain.org/quickstart/send-transactions
 */
export const VeChainTransactionExample = () => {
  const { account, connection } = useWallet();
  
  // Form state
  const [bountyTitle, setBountyTitle] = useState('Emergency Relief Fund');
  const [bountyDescription, setBountyDescription] = useState('Help provide emergency relief to affected communities');
  const [bountyGoal, setBountyGoal] = useState('50');
  const [bountyLocation, setBountyLocation] = useState('Global');
  const [organizerName, setOrganizerName] = useState('Relief Organization');
  
  // Pre-compute clauses to avoid popup blocking (as per documentation)
  const clauses = useMemo(() => {
    if (!bountyTitle || !bountyGoal) return [];
    
    return contractService.createBountyTransaction({
      title: bountyTitle,
      description: bountyDescription,
      goal: parseFloat(bountyGoal) || 0,
      location: bountyLocation,
      organizerName: organizerName,
      imageUrl: 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
  }, [bountyTitle, bountyDescription, bountyGoal, bountyLocation, organizerName]);

  // Transaction hook with proper configuration
  const {
    sendTransaction,
    status,
    txReceipt,
    resetStatus,
    isTransactionPending,
    error,
  } = useSendTransaction({
    signerAccountAddress: account?.address ?? '',
    onTxConfirmed: () => {
      toast.success('Transaction confirmed on blockchain!');
    },
    onTxFailedOrCancelled: () => {
      toast.error('Transaction failed or was cancelled');
    },
  });

  // Transaction modal hook
  const {
    open: openTransactionModal,
    close: closeTransactionModal,
    isOpen: isTransactionModalOpen,
  } = useTransactionModal();

  // Transaction handler following documentation pattern
  const handleCreateBounty = useCallback(async () => {
    if (!connection.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (clauses.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Open modal first, then send transaction
      openTransactionModal();
      await sendTransaction(clauses);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }, [connection.isConnected, clauses, openTransactionModal, sendTransaction]);

  // Retry handler
  const handleTryAgain = useCallback(async () => {
    resetStatus();
    await sendTransaction(clauses);
  }, [resetStatus, sendTransaction, clauses]);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VeChain Kit v2 Transaction Example</CardTitle>
          <CardDescription>
            Demonstrates correct implementation patterns for blockchain transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-4">
            <Badge className={connection.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {connection.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Badge className={getStatusColor(status)}>
              Status: {status}
            </Badge>
          </div>

          {account?.address && (
            <div>
              <Label className="text-sm font-medium">Connected Address</Label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {account.address}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Bounty Transaction</CardTitle>
          <CardDescription>
            Fill out the form to create a new bounty on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Bounty Title *</Label>
              <Input
                id="title"
                value={bountyTitle}
                onChange={(e) => setBountyTitle(e.target.value)}
                placeholder="Enter bounty title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Amount (VET) *</Label>
              <Input
                id="goal"
                type="number"
                value={bountyGoal}
                onChange={(e) => setBountyGoal(e.target.value)}
                placeholder="Enter goal amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={bountyDescription}
              onChange={(e) => setBountyDescription(e.target.value)}
              placeholder="Describe the bounty purpose"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={bountyLocation}
                onChange={(e) => setBountyLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer Name</Label>
              <Input
                id="organizer"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder="Enter organizer name"
              />
            </div>
          </div>

          <Button
            onClick={handleCreateBounty}
            disabled={!connection.isConnected || isTransactionPending || clauses.length === 0}
            className="w-full flex items-center gap-2"
          >
            {isTransactionPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isTransactionPending ? 'Processing Transaction...' : 'Create Bounty'}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      {(error || txReceipt) && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction Result</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Transaction Error:</strong> {error.reason || 'Unknown error occurred'}
                  {error.type && <div className="text-sm mt-1">Type: {error.type}</div>}
                </AlertDescription>
              </Alert>
            )}

            {txReceipt && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-2">
                    <div><strong>Transaction Successful!</strong></div>
                    <div className="text-sm">
                      <div>Transaction ID: <code className="bg-green-100 px-1 rounded">{txReceipt.meta?.txID}</code></div>
                      <div>Block Number: {txReceipt.meta?.blockNumber}</div>
                      <div>Gas Used: {txReceipt.gasUsed}</div>
                    </div>
                    <a 
                      href={`https://explore-testnet.vechain.org/transactions/${txReceipt.meta?.txID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View on VeChain Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
          <CardDescription>
            Key patterns followed from VeChain Kit documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>✅ Pre-computed Clauses:</strong> Transaction clauses are computed using useMemo to avoid popup blocking
            </div>
            <div>
              <strong>✅ Proper Hook Usage:</strong> Using useSendTransaction with signerAccountAddress and callbacks
            </div>
            <div>
              <strong>✅ Transaction Modal:</strong> Integrated useTransactionModal for better UX
            </div>
            <div>
              <strong>✅ ABI Encoding:</strong> Using VeChain SDK Interface for proper function encoding
            </div>
            <div>
              <strong>✅ Error Handling:</strong> Comprehensive error handling with user feedback
            </div>
            <div>
              <strong>✅ Status Tracking:</strong> Real-time transaction status with proper UI states
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        status={status}
        txReceipt={txReceipt}
        txError={error}
        onTryAgain={handleTryAgain}
        uiConfig={{
          title: 'Create Bounty Transaction',
          description: `Creating "${bountyTitle}" with goal of ${bountyGoal} VET`,
          showShareOnSocials: true,
          showExplorerButton: true,
          isClosable: true,
        }}
      />
    </div>
  );
};
