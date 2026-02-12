import { useState } from 'react';
import { useGetCallerUserProfile, useGetActiveAds, useGetUserRewards } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdsSection from '../components/user/AdsSection';
import RewardsSection from '../components/user/RewardsSection';
import { Coins, Gift } from 'lucide-react';

export default function UserDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: activeAds = [], isLoading: adsLoading } = useGetActiveAds();
  const { data: userRewards = [], isLoading: rewardsLoading } = useGetUserRewards();

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {userProfile?.name}!</h1>
          <p className="text-muted-foreground">
            Watch ads to earn points and redeem exciting rewards
          </p>
        </div>

        {/* Points Card */}
        <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-4xl font-bold">{Number(userProfile?.points || 0)}</p>
              <p className="text-sm text-muted-foreground">points</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ads" className="gap-2">
              <Coins className="h-4 w-4" />
              Watch Ads
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-2">
              <Gift className="h-4 w-4" />
              My Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-4">
            <AdsSection ads={activeAds} isLoading={adsLoading} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <RewardsSection rewards={userRewards} isLoading={rewardsLoading} userPoints={Number(userProfile?.points || 0)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
