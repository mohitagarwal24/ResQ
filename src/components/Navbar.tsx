import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Shield, RefreshCw, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

export const Navbar = () => {
  const { address, balance, isConnecting, isConnected, connect, disconnect, openLoginModal } = useWallet();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const formatBalance = (bal: string | null) => {
    if (!bal) return '0.0000';
    const num = parseFloat(bal);
    return num.toFixed(4);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };



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

            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Balance (Testnet)</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    {isConnecting ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : null}
                    {formatBalance(balance)} VET
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs hover:bg-emerald-50 hover:border-emerald-200"
                    >
                      <Wallet className="h-3 w-3 mr-2" />
                      {formatAddress(address)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <div className="text-xs text-muted-foreground">Connected Account</div>
                      <div className="font-mono text-xs break-all">{address}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={openLoginModal} className="cursor-pointer">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Switch Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnecting}
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
