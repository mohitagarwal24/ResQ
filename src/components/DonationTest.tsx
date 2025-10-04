import { useState } from 'react';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { useWallet } from '@vechain/vechain-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Send, Wallet } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Donation Test Component
 * 
 * Simple component to test donation functionality
 */
export const DonationTest = () => {
  const { account, connection } = useWallet();
  const { donate, status, isTransactionPending } = useContractTransactions();
  
  const [bountyId, setBountyId] = useState('1');
  const [amount, setAmount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = async () => {
    if (!connection.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!bountyId || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const donationAmount = parseFloat(amount);
    if (donationAmount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    setIsProcessing(true);
    try {
      await donate({
        bountyId,
        amount: donationAmount
      });
      
      toast.success('Donation transaction initiated!');
      
      // Reset form on success
      setBountyId('1');
      setAmount('1');
    } catch (error) {
      console.error('Donation failed:', error);
      toast.error('Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Test Donation
        </CardTitle>
        <CardDescription>
          Test the donation functionality with the deployed contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connection.isConnected ? (
          <Alert className="border-amber-200 bg-amber-50">
            <Wallet className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Please connect your wallet to test donations
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-200 bg-green-50">
            <Wallet className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Connected: {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="bountyId">Bounty ID</Label>
          <Input
            id="bountyId"
            value={bountyId}
            onChange={(e) => setBountyId(e.target.value)}
            placeholder="Enter bounty ID (e.g., 1, 2, 3)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (VET)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter donation amount"
            min="0"
            step="0.01"
          />
        </div>

        <Button
          onClick={handleDonate}
          disabled={!connection.isConnected || isProcessing || isTransactionPending}
          className="w-full flex items-center gap-2"
        >
          {(isProcessing || isTransactionPending) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {(isProcessing || isTransactionPending) ? 'Processing...' : `Donate ${amount} VET`}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Status:</strong> {status}</div>
          <div><strong>Available Bounties:</strong></div>
          <div>• ID: 1 - Emergency Water Supplies</div>
          <div>• ID: 2 - Medical Supplies</div>
          <div>• ID: 3 - Debug Test Bounty</div>
        </div>
      </CardContent>
    </Card>
  );
};
