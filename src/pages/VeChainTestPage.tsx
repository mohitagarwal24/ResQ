import { ContractStatus } from '../components/ContractStatus';
import { VeChainIntegration } from '../components/VeChainIntegration';
import { TransactionDebugger } from '../components/TransactionDebugger';
import { DonationHistoryTest } from '../components/DonationHistoryTest';
import { DonationTest } from '../components/DonationTest';
import { ProofSubmissionTest } from '../components/ProofSubmissionTest';
import { BountyList } from '../components/BountyList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';

export const VeChainTestPage = () => {

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">VeChain Integration Test</h1>
          <p className="text-muted-foreground">
            Test and debug VeChain Kit v2 integration with real blockchain interactions
          </p>
        </div>

        <div className="space-y-8">
          {/* Contract Status */}
          <ContractStatus />

          {/* Transaction Debugger */}
          <div className="grid lg:grid-cols-2 gap-8">
            <VeChainIntegration />
            <TransactionDebugger />
          </div>

          {/* Donation History Test */}
          <DonationHistoryTest />

          {/* Test Components */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Donation Test</CardTitle>
                <CardDescription>
                  Test donation functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonationTest />
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Proof Submission Test</CardTitle>
                <CardDescription>
                  Test proof submission with IPFS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProofSubmissionTest />
              </CardContent>
            </Card>
          </div>

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
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Real Donation History from Events
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-600">🔧 Technical Stack</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• VeChain Kit v2 (@vechain/vechain-kit)</li>
                    <li>• VeChain SDK Core (@vechain/sdk-core)</li>
                    <li>• VeChain Energy API for events</li>
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
