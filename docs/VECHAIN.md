## VeChain Integration

### Libraries
- `@vechain/vechain-kit`
- `@vechain/dapp-kit-react`

### Provider Setup
See `src/providers/VeChainKitProvider.tsx`:

```12:48:src/providers/VeChainKitProvider.tsx
'use client';
import { VeChainKitProvider } from "@vechain/vechain-kit";
import { ReactNode } from "react";

export function VeChainKitProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <VeChainKitProvider
      // Network Configuration
      network={{
        type: "test", // Using testnet
      }}
      // Fee Delegation
      feeDelegation={{
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/441",
        delegateAllTransactions: false,
      }}
      // Login Methods Configuration
      loginMethods={[
        { method: "vechain", gridColumn: 6 },
        { method: "dappkit", gridColumn: 6 },
      ]}
      // DApp Kit Configuration
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect", "sync2"],
        walletConnectOptions: {
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "default-project-id",
          metadata: {
            name: "ResQ DAO - Disaster Relief Platform",
            description: "A decentralized platform for disaster relief coordination and donations",
            url: typeof window !== "undefined" ? window.location.origin : "",
            icons: ["/logo.png"],
          },
        },
      }}
      // UI Configuration
      darkMode={false}
      language="en"
      allowCustomTokens={false}
      // Login Modal UI Customization
      loginModalUI={{
        logo: '/logo.png',
        description: 'Connect your wallet to access ResQ DAO',
      }}
    >
      {children}
    </VeChainKitProvider>
  );
}
```

### Environment
```
VITE_THOR_NODE_URL=https://testnet.vechain.org
VITE_WALLETCONNECT_PROJECT_ID=your_wc_project_id
VITE_DONATION_BOARD_ADDRESS=0x...
```

### Fee Delegation
Configured via `feeDelegation.delegatorUrl`. End users can interact with minimal VTHO by leveraging a sponsor.

### Transactions
Use the services and hooks in `src/services/*` and `src/hooks/*` to build and send contract transactions. See `src/pages/VeChainTestPage.tsx` and `src/components/VeChainIntegration.tsx` for examples.


