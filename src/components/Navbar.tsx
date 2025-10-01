import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Shield } from 'lucide-react';

export const Navbar = () => {
  const { address, balance, isConnecting, connect, disconnect } = useWallet();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;



  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-7 w-7 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Proof-of-Relief</span>
              <span className="text-xs text-muted-foreground -mt-1">Donation Board</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/bounties"
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/bounties') ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
            >
              Browse Bounties
            </Link>
            <Link
              to="/post"
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/post') ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
            >
              Post Bounty
            </Link>

            <ThemeToggle />

            {address ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Balance</div>
                  <div className="text-sm font-semibold">{balance} VET</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="font-mono text-xs"
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              </div>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
