import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { VeChainKitProviderWrapper } from './providers/VeChainKitProvider';
import { WalletProvider } from './contexts/WalletContext';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { BountyBoardPage } from './pages/BountyBoardPage';
import { PostBountyPage } from './pages/PostBountyPage';
import { BountyDetailPage } from './pages/BountyDetailPage';
import './App.css';
import { VeChainTestPage } from './pages/VeChainTestPage';

function App() {
  return (
    <ThemeProvider>
      <VeChainKitProviderWrapper>
        <WalletProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/bounties" element={<BountyBoardPage />} />
                <Route path="/post" element={<PostBountyPage />} />
                <Route path="/bounty/:id" element={<BountyDetailPage />} />
                <Route path="/test" element={<VeChainTestPage/>} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </WalletProvider>
      </VeChainKitProviderWrapper>
    </ThemeProvider>
  );
}

export default App;
