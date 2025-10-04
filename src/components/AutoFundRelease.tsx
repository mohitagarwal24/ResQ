import { useState, useEffect } from 'react';
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
  PartyPopper
} from 'lucide-react';
import { toast } from 'sonner';

interface AutoFundReleaseProps {
  bounty: Bounty;
  onFundRelease?: () => void;
}

export const AutoFundRelease = ({ bounty, onFundRelease }: AutoFundReleaseProps) => {
  const { address } = useWallet();
  const { releaseFunds, isTransactionPending } = useContractTransactions();
  const [isReleasing, setIsReleasing] = useState(false);
  const [, setShowCelebration] = useState(false);

  // Calculate progress
  const progress = (bounty.currentAmount / bounty.goalAmount) * 100;
  const isGoalReached = bounty.currentAmount >= bounty.goalAmount;
  const isOrganizer = address && address.toLowerCase() === bounty.organizerAddress.toLowerCase();

  // Show celebration when goal is reached
  useEffect(() => {
    if (isGoalReached && bounty.status === 'Open') {
      setShowCelebration(true);
      toast.success('🎉 Goal reached! Funds are ready for release!');
    }
  }, [isGoalReached, bounty.status]);

  // Auto-release funds if goal is reached and bounty is still open
  const handleAutoRelease = async () => {
    if (!address || !isOrganizer) {
      toast.error('Only the organizer can release funds');
      return;
    }

    if (!isGoalReached) {
      toast.error('Goal amount not yet reached');
      return;
    }

    setIsReleasing(true);

    try {
      console.log(`Auto-releasing funds for completed bounty ${bounty.id}...`);
      
      // Release funds with verified=true since goal was reached
      await releaseFunds(bounty.id, true);

      toast.success('🎉 Funds successfully released to organizer!');

      // Call callback to refresh bounty data
      if (onFundRelease) {
        onFundRelease();
      }

    } catch (error) {
      console.error('Failed to release funds:', error);
      toast.error('Failed to release funds');
    } finally {
      setIsReleasing(false);
    }
  };

  // Don't show if bounty is already completed
  if (bounty.status === 'Completed') {
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
            ? 'The funding goal has been reached! Funds can now be released.'
            : 'Track progress towards the funding goal. Funds will be auto-released when reached.'
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
                ? ' You can now release the funds to complete this bounty.'
                : ' The organizer can now release the funds.'
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

        {/* Release Funds Button (for organizer when goal is reached) */}
        {isGoalReached && bounty.status === 'Open' && isOrganizer && (
          <div className="pt-4">
            <Button
              onClick={handleAutoRelease}
              disabled={isReleasing || isTransactionPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isReleasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Releasing Funds...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Release Funds ({bounty.currentAmount.toFixed(2)} VET)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Information for non-organizers */}
        {isGoalReached && bounty.status === 'Open' && !isOrganizer && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              The funding goal has been reached! The organizer can now release the funds 
              to complete this relief effort.
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
