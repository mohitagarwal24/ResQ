import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { Bounty } from '../types/bounty';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, CheckCircle, XCircle, ExternalLink, FileText, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProofVerificationProps {
  bounty: Bounty;
  onVerificationComplete?: () => void;
}

export const ProofVerification = ({ bounty, onVerificationComplete }: ProofVerificationProps) => {
  const { address } = useWallet();
  const { releaseFunds, isTransactionPending } = useContractTransactions();
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if current user is the organizer
  const isOrganizer = address && address.toLowerCase() === bounty.organizerAddress.toLowerCase();

  // Only show for organizers and when proof is pending
  if (!isOrganizer || bounty.status !== 'ProofPending') {
    return null;
  }

  const handleVerifyProof = async (verified: boolean) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsVerifying(true);

    try {
      console.log(`${verified ? 'Approving' : 'Rejecting'} proof for bounty ${bounty.id}...`);
      
      await releaseFunds(bounty.id, verified);

      toast.success(
        verified 
          ? 'Proof approved! Funds have been released.' 
          : 'Proof rejected. Bounty is now open for new submissions.'
      );

      // Call callback to refresh bounty data
      if (onVerificationComplete) {
        onVerificationComplete();
      }

    } catch (error) {
      console.error('Failed to verify proof:', error);
      toast.error('Failed to process proof verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const getIpfsUrl = (hash: string) => {
    // Remove 'ipfs://' prefix if present
    const cleanHash = hash.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
  };

  // Extract proof hash from bounty data
  const proofHash = bounty.proofIpfsHash || '';
  
  // Debug logging to help track proof hash
  if (import.meta.env.DEV) {
    console.log(`[ProofVerification] Bounty ${bounty.id} proof hash:`, proofHash);
  }

  // Don't show verification UI if there's no proof hash
  if (!proofHash) {
    return (
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            No Proof Submitted Yet
          </CardTitle>
          <CardDescription>
            Waiting for proof of relief work to be submitted...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-600" />
          Proof Verification Required
        </CardTitle>
        <CardDescription>
          As the organizer, you need to verify the submitted proof of relief work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert for organizer */}
        <Alert className="border-orange-200 bg-orange-100">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Action Required:</strong> A proof of relief work has been submitted. 
            Please review the evidence and decide whether to approve or reject it.
          </AlertDescription>
        </Alert>

        {/* Bounty Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Bounty Title</div>
            <div className="font-semibold">{bounty.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Raised</div>
            <div className="font-semibold text-green-600">
              {bounty.currentAmount.toFixed(2)} VET
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Goal Amount</div>
            <div className="font-semibold">
              {bounty.goalAmount.toFixed(2)} VET
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {bounty.status}
            </Badge>
          </div>
        </div>

        {/* Proof Information */}
        <div className="p-4 bg-white rounded-lg border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submitted Proof
          </h4>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Proof Document
              </div>
              <a
                href={getIpfsUrl(proofHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <span>View Proof on IPFS</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                IPFS Hash
              </div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {proofHash}
              </code>
            </div>
          </div>
        </div>

        {/* Verification Instructions */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Verification Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Review the submitted proof document carefully</li>
            <li>• Verify that the relief work matches the bounty description</li>
            <li>• Check for authentic evidence (photos, receipts, testimonials)</li>
            <li>• Ensure the work was completed in the specified location</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleVerifyProof(true)}
            disabled={isVerifying || isTransactionPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve & Release Funds
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleVerifyProof(false)}
            disabled={isVerifying || isTransactionPending}
            variant="destructive"
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Proof
              </>
            )}
          </Button>
        </div>

        {/* Warning about fund release */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Important:</strong> If you approve the proof, all raised funds 
            ({bounty.currentAmount.toFixed(2)} VET) will be immediately transferred to your wallet. 
            This action cannot be undone.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
