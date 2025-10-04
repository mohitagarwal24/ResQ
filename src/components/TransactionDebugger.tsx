import { useState, useCallback } from 'react';
import { useWallet } from '@vechain/vechain-kit';
import { contractService } from '../services/contractService';
import { CONTRACT_CONFIG } from '../config/contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Transaction Debugger Component
 * 
 * This component helps debug transaction revert issues by:
 * 1. Showing the exact transaction clauses being generated
 * 2. Validating contract address and ABI
 * 3. Testing different parameter combinations
 * 4. Providing detailed error information
 */
export const TransactionDebugger = () => {
  const { account, connection } = useWallet();
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);

  // Test parameters
  const [testParams, setTestParams] = useState({
    title: 'Debug Test Bounty',
    description: 'Testing transaction encoding and parameters',
    goal: '5',
    location: 'Test Location',
    organizerName: 'Debug Tester',
    imageUrl: 'https://example.com/image.jpg'
  });

  const debugTransactionClauses = useCallback(() => {
    setIsDebugging(true);
    setDebugResult(null);

    try {
      // Generate transaction clauses
      const clauses = contractService.createBountyTransaction({
        title: testParams.title,
        description: testParams.description,
        goal: parseFloat(testParams.goal),
        location: testParams.location,
        organizerName: testParams.organizerName,
        imageUrl: testParams.imageUrl
      });

      const result = {
        success: true,
        clauses,
        contractAddress: CONTRACT_CONFIG.address,
        walletAddress: account?.address,
        networkConnected: connection.isConnected,
        timestamp: new Date().toISOString()
      };

      setDebugResult(result);
      toast.success('Transaction clauses generated successfully!');
    } catch (error: any) {
      const result = {
        success: false,
        error: error.message,
        stack: error.stack,
        contractAddress: CONTRACT_CONFIG.address,
        walletAddress: account?.address,
        networkConnected: connection.isConnected,
        timestamp: new Date().toISOString()
      };

      setDebugResult(result);
      toast.error('Failed to generate transaction clauses');
    } finally {
      setIsDebugging(false);
    }
  }, [testParams, account?.address, connection.isConnected]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const validateContract = () => {
    const issues = [];

    if (!CONTRACT_CONFIG.address) {
      issues.push('Contract address is not configured');
    }

    if (!CONTRACT_CONFIG.abi || CONTRACT_CONFIG.abi.length === 0) {
      issues.push('Contract ABI is not loaded');
    }

    if (!account?.address) {
      issues.push('Wallet is not connected');
    }

    if (!connection.isConnected) {
      issues.push('Not connected to VeChain network');
    }

    return issues;
  };

  const contractIssues = validateContract();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Debugger</CardTitle>
          <CardDescription>
            Debug and validate transaction clauses before sending to the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Validation */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contract Validation</h3>
            {contractIssues.length > 0 ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-1">
                    <div className="font-medium">Issues found:</div>
                    {contractIssues.map((issue, index) => (
                      <div key={index}>• {issue}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  All contract validations passed!
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Contract Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Contract Address</Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 p-2 rounded flex-1 font-mono">
                  {CONTRACT_CONFIG.address || 'Not configured'}
                </code>
                {CONTRACT_CONFIG.address && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(CONTRACT_CONFIG.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Wallet Address</Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 p-2 rounded flex-1 font-mono">
                  {account?.address || 'Not connected'}
                </code>
                {account?.address && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(account.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-4">
            <Badge className={connection.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {connection.isConnected ? 'Connected to VeChain' : 'Disconnected'}
            </Badge>
            <Badge variant="outline">
              ABI Functions: {CONTRACT_CONFIG.abi?.length || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Test Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
          <CardDescription>
            Configure test parameters for debugging transaction clauses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="debug-title">Title</Label>
              <Input
                id="debug-title"
                value={testParams.title}
                onChange={(e) => setTestParams(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="debug-goal">Goal (VET)</Label>
              <Input
                id="debug-goal"
                type="number"
                value={testParams.goal}
                onChange={(e) => setTestParams(prev => ({ ...prev, goal: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="debug-description">Description</Label>
            <textarea
              id="debug-description"
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={testParams.description}
              onChange={(e) => setTestParams(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="debug-location">Location</Label>
              <Input
                id="debug-location"
                value={testParams.location}
                onChange={(e) => setTestParams(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="debug-organizer">Organizer Name</Label>
              <Input
                id="debug-organizer"
                value={testParams.organizerName}
                onChange={(e) => setTestParams(prev => ({ ...prev, organizerName: e.target.value }))}
              />
            </div>
          </div>

          <Button
            onClick={debugTransactionClauses}
            disabled={isDebugging || contractIssues.length > 0}
            className="w-full flex items-center gap-2"
          >
            {isDebugging ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isDebugging ? 'Generating Clauses...' : 'Debug Transaction Clauses'}
          </Button>
        </CardContent>
      </Card>

      {/* Debug Results */}
      {debugResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {debugResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              Debug Results
            </CardTitle>
            <CardDescription>
              Generated at: {new Date(debugResult.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {debugResult.success ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Generated Transaction Clauses</Label>
                  <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-auto max-h-96 mt-2">
                    {JSON.stringify(
                      debugResult.clauses,
                      (_, value) => typeof value === 'bigint' ? value.toString() : value,
                      2
                    )}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => copyToClipboard(JSON.stringify(
                      debugResult.clauses,
                      (_, value) => typeof value === 'bigint' ? value.toString() : value,
                      2
                    ))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Clauses
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label>Clause Count</Label>
                    <div className="font-mono">{debugResult.clauses.length}</div>
                  </div>
                  <div>
                    <Label>Target Contract</Label>
                    <div className="font-mono text-xs">{debugResult.clauses[0]?.to}</div>
                  </div>
                  <div>
                    <Label>Function Data</Label>
                    <div className="font-mono text-xs">{debugResult.clauses[0]?.data}</div>
                  </div>
                </div>

                {debugResult.clauses[0]?.params && (
                  <div>
                    <Label className="text-sm font-medium">Function Parameters</Label>
                    <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-auto max-h-32 mt-2">
                      {JSON.stringify(
                        debugResult.clauses[0].params,
                        (_, value) => typeof value === 'bigint' ? value.toString() : value,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-2">
                    <div className="font-medium">Error: {debugResult.error}</div>
                    {debugResult.stack && (
                      <details>
                        <summary className="cursor-pointer">Stack Trace</summary>
                        <pre className="text-xs mt-2 overflow-auto max-h-32">
                          {debugResult.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debugging Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Common Transaction Revert Causes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Incorrect Function Parameters:</strong> Ensure parameter types match the contract ABI (string, uint256, bool, etc.)
            </div>
            <div>
              <strong>2. Wei Conversion Issues:</strong> Check that VET amounts are properly converted to Wei (multiply by 10^18)
            </div>
            <div>
              <strong>3. Missing ABI Field:</strong> VeChain Kit requires the `abi` field in transaction clauses for encoding
            </div>
            <div>
              <strong>4. Invalid Contract Address:</strong> Verify the contract is deployed on VeChain testnet
            </div>
            <div>
              <strong>5. Insufficient Gas:</strong> Some transactions may require higher gas limits
            </div>
            <div>
              <strong>6. Contract State Issues:</strong> Check if the contract function has specific requirements (e.g., bounty must exist)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
