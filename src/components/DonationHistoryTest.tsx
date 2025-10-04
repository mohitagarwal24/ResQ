import { useState } from 'react';
import { donationHistoryService } from '../services/donationHistoryService';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * Test component to debug donation history API calls
 */
export const DonationHistoryTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDonationHistory = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing donation history API...');
      const donations = await donationHistoryService.getDonationHistory('1');
      setResult(donations);
      console.log('Donation history result:', donations);
    } catch (err) {
      console.error('Donation history test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testAllDonations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing all donations API...');
      const donations = await donationHistoryService.getAllDonations();
      setResult(donations);
      console.log('All donations result:', donations);
    } catch (err) {
      console.error('All donations test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Donation History API Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testDonationHistory} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Bounty #1 Donations'}
          </Button>
          
          <Button 
            onClick={testAllDonations} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test All Donations'}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              Result ({Array.isArray(result) ? result.length : 'N/A'} donations):
            </h4>
            <pre className="text-sm text-green-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
