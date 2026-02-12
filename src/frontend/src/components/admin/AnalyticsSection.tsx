import { useGetUserAnalytics } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Coins, Gift } from 'lucide-react';

export default function AnalyticsSection() {
  const { data: analytics, isLoading } = useGetUserAnalytics();

  const stats = [
    {
      title: 'Total Users',
      value: analytics ? Number(analytics.totalUsers) : 0,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Points',
      value: analytics ? Number(analytics.totalPoints) : 0,
      icon: Coins,
      description: 'Points in circulation',
    },
    {
      title: 'Reward Requests',
      value: analytics ? Number(analytics.totalRewardRequests) : 0,
      icon: Gift,
      description: 'Total redemptions',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-1/2 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-1/3 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Analytics</h2>
        <p className="text-sm text-muted-foreground">Overview of platform performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
