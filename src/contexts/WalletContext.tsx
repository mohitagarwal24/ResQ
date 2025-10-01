import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    vechain?: {
      newConnexSigner: (genesisId: string) => {
        request: (options: { purpose: string; payload: { type: string; content: string } }) => Promise<{ annex: { address: string } }>;
      };
    };
    connex?: {
      thor: {
        genesis: {
          id: string;
        };
        account: (address: string) => {
          get: () => Promise<{ balance: string }>;
        };
      };
    };
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      fetchBalance(storedAddress);
    }
  }, []);

  const fetchBalance = async (addr: string) => {
    try {
      if (window.connex) {
        const account = await window.connex.thor.account(addr).get();
        const balanceInVET = (parseInt(account.balance, 16) / 1e18).toFixed(2);
        setBalance(balanceInVET);
      } else {
        setBalance('1000.00');
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0.00');
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    try {
      if (window.vechain) {
        const genesisId = window.connex?.thor.genesis.id || '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';
        const signer = window.vechain.newConnexSigner(genesisId);

        const result = await signer.request({
          purpose: 'identification',
          payload: {
            type: 'text',
            content: 'Connect to Proof-of-Relief Donation Board'
          }
        });

        const walletAddress = result.annex.address;
        setAddress(walletAddress);
        localStorage.setItem('walletAddress', walletAddress);
        await fetchBalance(walletAddress);
        toast.success('Wallet connected successfully!');
      } else {
        const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
        setAddress(mockAddress);
        setBalance('1000.00');
        localStorage.setItem('walletAddress', mockAddress);
        toast.info('Demo mode: Mock wallet connected');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    localStorage.removeItem('walletAddress');
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ address, balance, isConnecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
