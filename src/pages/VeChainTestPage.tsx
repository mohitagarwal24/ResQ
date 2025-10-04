import { VeChainIntegration } from '../components/VeChainIntegration';
import { BountyList } from '../components/BountyList';
import { TransactionDebugger } from '../components/TransactionDebugger';
import { useWallet } from '../contexts/WalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';

export const VeChainTestPage = () => {
  const { address, balance, isConnected, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              VeChain Kit v2 Integration Test
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete blockchain integration with real contract interactions
            </p>
          </div>

          {/* Wallet Connection Status */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection
              </CardTitle>
              <CardDescription>
                Connect your VeChain wallet to interact with the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Please connect your wallet to test the VeChain integration
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Wallet connected successfully! You can now interact with the blockchain.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  {address && (
                    <>
                      <p className="text-sm font-medium">Address:</p>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {address}
                      </p>
                    </>
                  )}
                  {balance && (
                    <>
                      <p className="text-sm font-medium">Balance:</p>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {balance} VET
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {!isConnected ? (
                    <Button onClick={connect} className="bg-emerald-600 hover:bg-emerald-700">
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button onClick={disconnect} variant="outline">
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Debugger */}
          <TransactionDebugger />

          {/* VeChain Integration Component */}
          <VeChainIntegration />

          {/* Live Bounties */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Live Bounties</CardTitle>
              <CardDescription>
                Real bounties from the blockchain (with fallback to mock data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BountyList showDonateButton={true} />
            </CardContent>
          </Card>

          {/* Integration Features */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Integration Features</CardTitle>
              <CardDescription>
                What's included in this VeChain Kit v2 integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">✅ Implemented Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      VeChain Kit v2 Provider Setup
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Wallet Connection (VeWorld, Sync2, WalletConnect)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Real-time Balance Display
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Contract Read Operations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Contract Write Operations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Transaction Status Tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Fee Delegation Support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Real IPFS Integration (Pinata/Web3.Storage)
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-600">🔧 Technical Stack</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• VeChain Kit v2 (@vechain/vechain-kit)</li>
                    <li>• VeChain SDK Core (@vechain/sdk-core)</li>
                    <li>• React Query for state management</li>
                    <li>• Custom hooks for contract interactions</li>
                    <li>• Real-time blockchain data fetching</li>
                    <li>• Transaction modal components</li>
                    <li>• Error handling and user notifications</li>
                    <li>• Responsive UI with Tailwind CSS</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Environment Setup Required:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <code>VITE_DONATION_BOARD_ADDRESS</code> - Deployed contract address</li>
                  <li>• <code>VITE_WALLETCONNECT_PROJECT_ID</code> - WalletConnect project ID</li>
                  <li>• <code>VITE_PINATA_JWT</code> - Pinata IPFS service token (optional)</li>
                  <li>• <code>VITE_WEB3_STORAGE_TOKEN</code> - Web3.Storage token (optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
