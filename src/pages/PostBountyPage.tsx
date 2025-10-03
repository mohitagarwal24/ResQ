import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useBountyStore } from '../store/bountyStore';
import { useContractTransactions } from '../hooks/useContractTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PostBountyPage = () => {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { addBounty } = useBountyStore();
  const { createBounty, isTransactionPending, status } = useContractTransactions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    location: '',
    organizerName: '',
    imageUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.title || !formData.description || !formData.goalAmount || !formData.location || !formData.organizerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goalAmount = parseFloat(formData.goalAmount);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    try {
      await createBounty({
        title: formData.title,
        description: formData.description,
        goal: goalAmount,
        location: formData.location,
        organizerName: formData.organizerName,
        imageUrl: formData.imageUrl || undefined
      });

      // Add to local store for immediate UI update
      addBounty({
        title: formData.title,
        description: formData.description,
        goalAmount: goalAmount,
        location: formData.location,
        organizerAddress: address,
        organizerName: formData.organizerName,
        imageUrl: formData.imageUrl || undefined
      });

      if (status === 'success') {
        navigate('/bounties');
      }
    } catch (error) {
      console.error('Failed to create bounty:', error);
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Post a Relief Bounty</h1>
            <p className="text-muted-foreground">
              Create a verified funding request for disaster relief efforts
            </p>
          </div>

          {!address && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Please connect your wallet to post a bounty
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Bounty Details</CardTitle>
              <CardDescription>
                Provide information about your relief effort and funding needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Water Filters for Kerala Floods"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isTransactionPending}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the relief effort, what the funds will be used for, and expected impact..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isTransactionPending}
                    rows={6}
                    className="border-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalAmount">
                      Funding Goal (VET) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="goalAmount"
                      name="goalAmount"
                      type="number"
                      step="0.01"
                      placeholder="5000"
                      value={formData.goalAmount}
                      onChange={handleChange}
                      disabled={isTransactionPending}
                      className="border-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Kerala, India"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={isTransactionPending}
                      className="border-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizerName">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizerName"
                    name="organizerName"
                    placeholder="e.g., Kerala Relief Foundation"
                    value={formData.organizerName}
                    onChange={handleChange}
                    disabled={isTransactionPending}
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    disabled={isTransactionPending}
                    className="border-2"
                  />
                  <p className="text-xs text-slate-500">
                    Provide a relevant image URL for your relief effort
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isTransactionPending || !address}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                >
                  {isTransactionPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Bounty...
                    </>
                  ) : (
                    'Create Bounty'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
