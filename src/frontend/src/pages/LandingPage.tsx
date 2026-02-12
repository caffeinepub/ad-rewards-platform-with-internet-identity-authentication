import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Gift, TrendingUp, Shield, LogIn } from 'lucide-react';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();

  const features = [
    {
      icon: Coins,
      title: 'Earn Points',
      description: 'Watch advertisements and earn points for each view',
    },
    {
      icon: Gift,
      title: 'Redeem Rewards',
      description: 'Exchange your points for cash via UPI or gift cards',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your earnings and redemption history',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Protected by Internet Identity authentication',
    },
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
            <Coins className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Watch Ads, Earn Rewards
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Turn your attention into rewards. Watch advertisements, accumulate points, and redeem them for cash via UPI or gift cards.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="gap-2"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Get Started
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Sign In', description: 'Login securely with Internet Identity' },
              { step: '2', title: 'Watch Ads', description: 'Browse and watch available advertisements' },
              { step: '3', title: 'Get Rewarded', description: 'Redeem points for cash (via UPI) or gift cards after admin approval' },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-center">Cash Rewards via UPI</CardTitle>
            <CardDescription className="text-center">
              Cash redemptions are processed manually by our admin team and sent directly to your UPI ID. 
              Make sure to add your UPI ID in your profile to enable cash withdrawals.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
