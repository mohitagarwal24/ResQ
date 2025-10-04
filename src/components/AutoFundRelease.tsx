import { useState, useEffect, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { Bounty } from '../types/bounty';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Target, 
  CheckCircle, 
  Coins,
  TrendingUp,
  AlertTriangle,
  Loader2,
  PartyPopper,
  Upload,
  FileImage
} from 'lucide-react';
import { toast } from 'sonner';

interface AutoFundReleaseProps {
  bounty: Bounty;
  onProofSubmitted?: () => void;
}

export const AutoFundRelease = ({ bounty, onProofSubmitted }: AutoFundReleaseProps) => {
  const { address } = useWallet();
  const { submitProof, isTransactionPending } = useContractTransactions();
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [, setShowCelebration] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const celebrationShownRef = useRef<Set<string>>(new Set());

  // Calculate progress
  const progress = (bounty.currentAmount / bounty.goalAmount) * 100;
  const isGoalReached = bounty.currentAmount >= bounty.goalAmount;
  const isOrganizer = address && address.toLowerCase() === bounty.organizerAddress.toLowerCase();

  // Show celebration when goal is reached (only once per bounty)
  useEffect(() => {
    if (isGoalReached && bounty.status === 'Open') {
      const celebrationKey = `${bounty.id}-goal-reached`;
      
      // Only show celebration if we haven't shown it for this bounty yet
      if (!celebrationShownRef.current.has(celebrationKey)) {
        setShowCelebration(true);
        toast.success('🎉 Goal reached! Now submit proof of relief to release funds!');
        celebrationShownRef.current.add(celebrationKey);
      }
    }
    
    // Clear celebration flag if bounty status changes away from Open
    if (bounty.status !== 'Open') {
      const celebrationKey = `${bounty.id}-goal-reached`;
      celebrationShownRef.current.delete(celebrationKey);
    }
  }, [isGoalReached, bounty.status, bounty.id]);

  // Handle proof submission when goal is reached
  const handleProofSubmission = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !address || !isOrganizer) {
      if (!address || !isOrganizer) {
        toast.error('Only the organizer can submit proof');
      }
      return;
    }

    if (!isGoalReached) {
      toast.error('Goal amount not yet reached');
      return;
    }

    setIsSubmittingProof(true);

    try {
      console.log(`Submitting proof for completed bounty ${bounty.id}...`);
      
      await submitProof({ bountyId: bounty.id, proofFile: file });

      toast.success('🎉 Proof submitted successfully! Awaiting verification...');

      // Call callback to refresh bounty data
      if (onProofSubmitted) {
        onProofSubmitted();
      }

    } catch (error) {
      console.error('Failed to submit proof:', error);
      toast.error('Failed to submit proof');
    } finally {
      setIsSubmittingProof(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Don't show if bounty is already completed or proof is pending
  if (bounty.status === 'Completed' || bounty.status === 'ProofPending') {
    return null;
  }

  return (
    <Card className={`border-2 ${isGoalReached ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isGoalReached ? (
            <>
              <PartyPopper className="h-5 w-5 text-green-600" />
              Goal Achieved! 🎉
            </>
          ) : (
            <>
              <Target className="h-5 w-5 text-blue-600" />
              Funding Progress
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isGoalReached 
            ? 'The funding goal has been reached! Submit proof of relief to release funds.'
            : 'Track progress towards the funding goal. Submit proof when goal is reached.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Funding Progress</span>
            <span className="text-muted-foreground">
              {progress.toFixed(1)}% Complete
            </span>
          </div>
          <Progress 
            value={Math.min(progress, 100)} 
            className={`h-3 ${isGoalReached ? 'bg-green-100' : 'bg-blue-100'}`}
          />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-green-600">
              {bounty.currentAmount.toFixed(2)} VET Raised
            </span>
            <span className="text-muted-foreground">
              Goal: {bounty.goalAmount.toFixed(2)} VET
            </span>
          </div>
        </div>

        {/* Goal Reached Alert */}
        {isGoalReached && bounty.status === 'Open' && (
          <Alert className="border-green-200 bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Congratulations!</strong> The funding goal has been reached! 
              {isOrganizer 
                ? ' Please submit proof of relief to release the funds.'
                : ' The organizer needs to submit proof of relief to release funds.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Coins className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-700">
              {bounty.currentAmount.toFixed(2)}
            </div>
            <div className="text-xs text-blue-600">VET Raised</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-700">
              {bounty.goalAmount.toFixed(2)}
            </div>
            <div className="text-xs text-green-600">VET Goal</div>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-700">
              {Math.max(0, bounty.goalAmount - bounty.currentAmount).toFixed(2)}
            </div>
            <div className="text-xs text-purple-600">VET Remaining</div>
          </div>
        </div>

        {/* Submit Proof Button (for organizer when goal is reached) */}
        {isGoalReached && bounty.status === 'Open' && isOrganizer && (
          <div className="pt-4 space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileImage className="h-4 w-4 text-amber-600" />
                <span className="font-semibold text-amber-800">Submit Proof of Relief</span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Upload images or documents showing the relief work completed with the donated funds.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleProofSubmission}
                className="hidden"
              />
              
              <Button
                onClick={handleFileButtonClick}
                disabled={isSubmittingProof || isTransactionPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isSubmittingProof ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Proof...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Proof of Relief
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Information for non-organizers */}
        {isGoalReached && bounty.status === 'Open' && !isOrganizer && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              The funding goal has been reached! The organizer needs to submit proof of relief 
              before funds can be released.
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Information */}
        {!isGoalReached && (
          <Alert className="border-blue-200 bg-blue-50">
            <Target className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>{Math.max(0, bounty.goalAmount - bounty.currentAmount).toFixed(2)} VET</strong> more 
              needed to reach the goal. Once reached, funds will be available for release to the organizer.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
