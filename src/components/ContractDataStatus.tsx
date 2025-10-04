import { useContractBounties } from '../hooks/useContractRead';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

/**
 * Contract Data Status Component
 * 
 * Shows real-time status of contract data loading for debugging
 */
export const ContractDataStatus = () => {
  const { bounties, loading, error } = useContractBounties();

  if (loading) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">
          Loading bounties from VeChain contract...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Contract Error:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center justify-between">
          <span>
            <strong>Contract Connected:</strong> Loaded {bounties.length} bounties from blockchain
          </span>
          <Database className="h-4 w-4" />
        </div>
      </AlertDescription>
    </Alert>
  );
};
