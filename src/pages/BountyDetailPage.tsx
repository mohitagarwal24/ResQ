import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useContractBounty } from '../hooks/useContractRead';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { DonationHistory } from '../components/DonationHistory';
import { ProofVerification } from '../components/ProofVerification';
import { AutoFundRelease } from '../components/AutoFundRelease';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { MapPin, User, Calendar, ArrowLeft, Loader as Loader2, CircleCheck as CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const BountyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address } = useWallet();
  const { bounty, loading, error, refetch } = useContractBounty(id || null);
  const { donate } = useContractTransactions();

  // Donations are now loaded from blockchain events via DonationHistory component

  console.log(`BountyDetailPage: Loading bounty ${id} from contract...`);

  const [donationAmount, setDonationAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Loading bounty from contract...</h2>
        </div>
      </div>
    );
  }

  if (error || !bounty) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {error ? 'Error loading bounty' : 'Bounty not found'}
          </h2>
          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}
          <div className="space-x-2">
            <Button onClick={() => navigate('/bounties')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bounties
            </Button>
            {error && (
              <Button onClick={refetch} variant="default">
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = (bounty.currentAmount / bounty.goalAmount) * 100;
  const isOrganizer = address && address === bounty.organizerAddress;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ProofPending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDonate = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsDonating(true);

    try {
      await donate({ bountyId: bounty.id, amount });
      setDonationAmount('');
      // Don't manually refetch - the contractDataChanged event will handle it
      toast.success('Donation successful!');
    } catch (error) {
      console.error('Failed to donate:', error);
      toast.error('Failed to process donation');
    } finally {
      setIsDonating(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <Button
          onClick={() => navigate('/bounties')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bounties
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              {bounty.imageUrl && (
                <div className="aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={bounty.imageUrl}
                    alt={bounty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{bounty.title}</CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{bounty.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{bounty.organizerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(bounty.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(bounty.status)}>
                    {bounty.status === 'ProofPending' ? 'Proof Pending' : bounty.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {bounty.description}
                  </p>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Organizer Information</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Organization:</span>{' '}
                        <span className="font-medium">{bounty.organizerName}</span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="text-slate-600">Wallet:</span>{' '}
                        <span className="text-slate-900">{bounty.organizerAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {bounty.proofIpfsHash && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Proof of Relief</h3>
                      <Alert className="border-emerald-200 bg-emerald-50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <AlertDescription className="text-emerald-800">
                          Proof has been submitted and Verified.
                          <div className="mt-2 text-xs font-mono break-all">
                            IPFS Hash: {bounty.proofIpfsHash}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Proof Verification Component (for organizers when proof is pending) */}
            <ProofVerification 
              bounty={bounty} 
              onVerificationComplete={refetch}
            />

            {/* Auto Fund Release Component (when goal is reached) */}
            <AutoFundRelease 
              bounty={bounty} 
              onProofSubmitted={refetch}
            />

            {/* Real Donation History from Blockchain */}
            <DonationHistory bountyId={bounty.id} />
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-emerald-200 sticky top-24">
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Raised</span>
                    <span className="font-bold text-slate-900 text-lg">
                      {bounty.currentAmount.toLocaleString()} VET
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-600">Goal</span>
                    <span className="font-semibold text-slate-700">
                      {bounty.goalAmount.toLocaleString()} VET
                    </span>
                  </div>
                  <Progress value={progress} className="h-3 mb-2" />
                  <div className="text-xs text-slate-500 text-right">
                    {progress.toFixed(1)}% of goal
                  </div>
                </div>

                <Separator />

                {bounty.status === 'Open' && !isOrganizer && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="donationAmount">Donation Amount (VET)</Label>
                      <Input
                        id="donationAmount"
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        disabled={isDonating || !address}
                        className="border-2"
                      />
                    </div>
                    <Button
                      onClick={handleDonate}
                      disabled={isDonating || !address || !donationAmount}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                    >
                      {isDonating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Donate Now'
                      )}
                    </Button>
                    {!address && (
                      <p className="text-xs text-center text-slate-500">
                        Connect your wallet to donate
                      </p>
                    )}
                  </div>
                )}

                {/* Proof submission is now handled by AutoFundRelease component */}

                {bounty.status === 'ProofPending' && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800 text-sm">
                      Proof is being verified. Funds will be released upon approval.
                    </AlertDescription>
                  </Alert>
                )}

                {bounty.status === 'Completed' && (
                  <Alert className="border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 text-sm">
                      Relief verified and funds released! Thank you to all donors.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
