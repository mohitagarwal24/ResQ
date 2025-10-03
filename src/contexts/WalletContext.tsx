import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useWallet as useVeChainWallet, useWalletModal } from '@vechain/vechain-kit';
import { toast } from 'sonner';

interface WalletContextType {
    address: string | null;
    balance: string | null;
    isConnecting: boolean;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => Promise<void>;
    openLoginModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const { 
        account, 
        connection, 
        disconnect: veChainDisconnect 
    } = useVeChainWallet();
    
    const { open: openLoginModal } = useWalletModal();
    
    // Local state for balance and loading
    const [balance, setBalance] = useState<string | null>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);

    // Derived values from VeChain Kit
    const address = account?.address || null;
    const isConnected = connection.isConnected;
    const isConnecting = connection.isLoading;

    // Fetch balance function using VeChain testnet API
    const fetchBalance = async (addr: string) => {
        if (!addr) return;
        
        setBalanceLoading(true);
        try {
            const response = await fetch(`https://testnet.vechain.org/accounts/${addr}`);
            if (!response.ok) {
                throw new Error('Failed to fetch account data');
            }
            const accountInfo = await response.json();
            const balanceInVET = (BigInt(accountInfo.balance) / BigInt(1e18)).toString();
            const decimalPart = (BigInt(accountInfo.balance) % BigInt(1e18)).toString().padStart(18, '0');
            const formattedBalance = `${balanceInVET}.${decimalPart.slice(0, 4)}`;
            setBalance(parseFloat(formattedBalance).toFixed(4));
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setBalance('0.0000');
        } finally {
            setBalanceLoading(false);
        }
    };

    // Handle account changes and show notifications
    useEffect(() => {
        if (account?.address && connection.isConnected) {
            toast.success('Wallet connected successfully!');
            fetchBalance(account.address);
        } else {
            setBalance(null);
        }
    }, [account?.address, connection.isConnected]);

    // Fetch balance periodically for real-time updates
    useEffect(() => {
        if (!address || !isConnected) return;

        const interval = setInterval(() => {
            fetchBalance(address);
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [address, isConnected]);

    // Listen for account switching
    useEffect(() => {
        if (account?.address) {
            const prevAddress = localStorage.getItem('prevWalletAddress');
            if (prevAddress && prevAddress !== account.address) {
                toast.info('Account switched successfully');
            }
            localStorage.setItem('prevWalletAddress', account.address);
        }
    }, [account?.address]);

    const connect = () => {
        openLoginModal();
    };

    const disconnect = async () => {
        try {
            await veChainDisconnect();
            localStorage.removeItem('prevWalletAddress');
            toast.success('Wallet disconnected');
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
            toast.error('Failed to disconnect wallet');
        }
    };

    return (
        <WalletContext.Provider 
            value={{ 
                address, 
                balance, 
                isConnecting: isConnecting || balanceLoading, 
                isConnected,
                connect, 
                disconnect,
                openLoginModal
            }}
        >
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
