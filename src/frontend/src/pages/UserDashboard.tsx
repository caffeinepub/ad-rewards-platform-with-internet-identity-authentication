import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Gift, User } from "lucide-react";
import AdsSection from "../components/user/AdsSection";
import ProfileSection from "../components/user/ProfileSection";
import RewardsSection from "../components/user/RewardsSection";
import { useGetActiveAds, useGetCallerUserProfile } from "../hooks/useQueries";

export default function UserDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: activeAds = [], isLoading: adsLoading } = useGetActiveAds();

  const userPoints = Number(userProfile?.points || 0);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            Welcome back, {userProfile?.name || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Watch ads to earn points and redeem for cash or gift cards
          </p>
        </div>

        {/* Points Card */}
        <div
          className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6"
          data-ocid="user.points_card"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Your Balance
              </p>
              <p className="text-5xl font-bold tracking-tight">
                {userPoints.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">points</p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Cash value</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                ≈ ₹{(userPoints * 0.1).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">at 1pt = ₹0.10</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="ads" className="gap-2" data-ocid="user.ads_tab">
              <Coins className="h-4 w-4" />
              Watch Ads
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="gap-2"
              data-ocid="user.rewards_tab"
            >
              <Gift className="h-4 w-4" />
              My Rewards
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2"
              data-ocid="user.profile_tab"
            >
              <User className="h-4 w-4" />
              Profile & UPI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-4">
            <AdsSection ads={activeAds} isLoading={adsLoading} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <RewardsSection userPoints={userPoints} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
