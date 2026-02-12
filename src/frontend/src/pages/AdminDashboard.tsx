import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Megaphone, Wallet } from 'lucide-react';
import AnalyticsSection from '../components/admin/AnalyticsSection';
import AdManagementSection from '../components/admin/AdManagementSection';
import PayoutManagementSection from '../components/admin/PayoutManagementSection';

export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage advertisements, process payouts, and monitor platform analytics
          </p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="analytics" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ads" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Ads
            </TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2">
              <Wallet className="h-4 w-4" />
              Payouts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>

          <TabsContent value="ads">
            <AdManagementSection />
          </TabsContent>

          <TabsContent value="payouts">
            <PayoutManagementSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
