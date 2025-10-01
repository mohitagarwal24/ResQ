import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Heart, Eye, CircleCheck as CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <Shield className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Proof-of-Relief
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground">Donation Board</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Transparent disaster donations: funds are released only when AI-verified proof of relief is provided.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bounties">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                Browse Bounties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/post">
              <Button size="lg" variant="outline" className="border-2 hover:border-emerald-600 px-8">
                Post a Bounty
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-emerald-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Create Relief Bounties</CardTitle>
              <CardDescription>
                Organizations post disaster relief needs with specific funding goals and locations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-emerald-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle>Transparent Escrow</CardTitle>
              <CardDescription>
                Donations are held in smart contract escrow until relief is verified and proven.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-emerald-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>AI Verification</CardTitle>
              <CardDescription>
                Submitted proof of relief is AI-verified before funds are released to organizers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Post Bounty</h3>
              <p className="text-sm text-muted-foreground">
                Relief organizations create bounties for specific disaster relief needs
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Donors Contribute</h3>
              <p className="text-sm text-muted-foreground">
                People donate VET tokens which are held in smart contract escrow
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Submit Proof</h3>
              <p className="text-sm text-muted-foreground">
                Organizations provide proof of relief delivery with photos and documentation
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Funds Released</h3>
              <p className="text-sm text-muted-foreground">
                After AI verification, escrowed funds are released to the organization
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Built on VeChainThor</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging VeChain's enterprise-grade blockchain for transparent, secure, and efficient disaster relief funding.
          </p>
        </div>
      </div>
    </div>
  );
};
