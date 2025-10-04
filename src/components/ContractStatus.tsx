import { useState, useEffect, useCallback } from 'react';
import { contractReadService } from '../services/contractReadService';
import { refreshService } from '../services/refreshService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CONTRACT_CONFIG } from '../config/contract';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Database,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Contract Status Component
 * 
 */
export const ContractStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [bountyCount, setBountyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkContractStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Checking contract accessibility...');
      
      // Check if contract is accessible
      const accessible = await contractReadService.isContractAccessible();
      setIsConnected(accessible);
      
      if (accessible) {
        // Get bounty count
        const count = await contractReadService.getBountyCount();
        setBountyCount(count);
        
        toast.success('Contract connection verified!');
        console.log(`Contract accessible with ${count} bounties`);
      } else {
        setBountyCount(0);
        toast.error('Contract not accessible');
      }
      
      setLastChecked(new Date());
    } catch (err) {
      console.error('Contract status check failed:', err);
      setIsConnected(false);
      setBountyCount(0);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Contract status check failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check status on mount
  useEffect(() => {
    checkContractStatus();
  }, []);

  // Auto-refresh when contract data changes
  useEffect(() => {
    checkContractStatus();
    
    // Register with centralized refresh service
    refreshService.register('contract-status', checkContractStatus, 5); //Lowest priority
    
    return () => {
      refreshService.unregister('contract-status');
    };
  }, [checkContractStatus]);

  const getStatusColor = () => {
    if (isConnected === null) return 'bg-gray-100 text-gray-700';
    return isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };
  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isConnected === null) return <Database className="h-4 w-4" />;
    return isConnected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    if (isConnected === null) return 'Unknown';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Real Contract Status
        </CardTitle>
        <CardDescription>
          Live connection status to the deployed VeChain contract
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium">Contract Connection</div>
            <div className="text-xs text-muted-foreground">
              {CONTRACT_CONFIG.address}
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>

        {/* Bounty Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Total Bounties</div>
          <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {bountyCount}
          </div>
        </div>

        {/* Last Checked */}
        {lastChecked && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Last Checked</div>
            <div className="text-xs text-muted-foreground">
              {lastChecked.toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-medium">Connection Error:</div>
              <div className="text-sm">{error}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {isConnected && !error && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully connected to the deployed contract! All bounty data is now loaded from the blockchain.
            </AlertDescription>
          </Alert>
        )}

        {/* Refresh Button */}
        <Button
          onClick={checkContractStatus}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Checking...' : 'Refresh Status'}
        </Button>

        {/* Technical Details */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div><strong>Network:</strong> VeChain Testnet</div>
          <div><strong>API:</strong> Thor Node API</div>
          <div><strong>Data Source:</strong> {isConnected ? 'Real Contract' : 'Fallback Mode'}</div>
          <div><strong>Auto-refresh:</strong> After transactions</div>
        </div>
      </CardContent>
    </Card>
  );
};
