import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Gift, TrendingUp, Users } from "lucide-react";
import { useGetUserAnalytics } from "../../hooks/useQueries";

export default function AnalyticsSection() {
  const { data: analytics, isLoading } = useGetUserAnalytics();

  const stats = [
    {
      title: "Total Users",
      value: analytics ? Number(analytics.totalUsers) : 0,
      icon: Users,
      description: "Registered users on platform",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Points Issued",
      value: analytics ? Number(analytics.totalPointsIssued) : 0,
      icon: Coins,
      description: "Points earned across all users",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Reward Requests",
      value: analytics ? Number(analytics.totalRewardRequests) : 0,
      icon: Gift,
      description: "Total redemption requests",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6" data-ocid="admin.analytics_section">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-10 w-1/3 rounded bg-muted mb-2" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.analytics_section">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Live overview of platform performance
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
