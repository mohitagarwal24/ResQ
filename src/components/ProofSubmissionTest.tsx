import { useState, useRef } from 'react';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { useWallet } from '@vechain/vechain-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Upload, Wallet, FileText } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Proof Submission Test Component
 * 
 * Simple component to test proof submission functionality
 */
export const ProofSubmissionTest = () => {
  const { account, connection } = useWallet();
  const { submitProof, status, isTransactionPending } = useContractTransactions();
  
  const [bountyId, setBountyId] = useState('1');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Check file type (images and documents)
      const allowedTypes = ['image/', 'application/pdf', 'text/', '.doc', '.docx'];
      const isAllowed = allowedTypes.some(type => 
        file.type.startsWith(type) || file.name.toLowerCase().includes(type)
      );
      
      if (!isAllowed) {
        toast.error('Please select an image, PDF, or document file');
        return;
      }
      
      setSelectedFile(file);
      toast.success('File selected successfully');
    }
  };

  const handleSubmitProof = async () => {
    if (!connection.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!bountyId) {
      toast.error('Please enter a bounty ID');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a proof file');
      return;
    }

    setIsProcessing(true);
    try {
      await submitProof({
        bountyId,
        proofFile: selectedFile
      });
      
      toast.success('Proof submission transaction initiated!');
      
      // Reset form on success
      setBountyId('1');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Proof submission failed:', error);
      toast.error('Proof submission failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Test Proof Submission
        </CardTitle>
        <CardDescription>
          Test proof submission functionality with IPFS upload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connection.isConnected ? (
          <Alert className="border-amber-200 bg-amber-50">
            <Wallet className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Please connect your wallet to test proof submission
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
          <Label htmlFor="proofFile">Proof File</Label>
          <Input
            id="proofFile"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="cursor-pointer"
          />
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
              <FileText className="h-4 w-4" />
              <span className="flex-1">{selectedFile.name}</span>
              <span className="text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmitProof}
          disabled={!connection.isConnected || !selectedFile || isProcessing || isTransactionPending}
          className="w-full flex items-center gap-2"
        >
          {(isProcessing || isTransactionPending) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {(isProcessing || isTransactionPending) ? 'Processing...' : 'Submit Proof'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Status:</strong> {status}</div>
          <div><strong>Supported Files:</strong> Images, PDF, Documents (max 10MB)</div>
          <div><strong>Process:</strong> File → IPFS → Blockchain</div>
        </div>
      </CardContent>
    </Card>
  );
};
