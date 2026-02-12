import { useGetPendingRewardRequests, useApproveRewardRequest, useRejectRewardRequest } from '../../hooks/useQueries';
import type { RewardRequest } from '../../types/rewards';
import { RewardType } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Wallet, DollarSign, CreditCard } from 'lucide-react';

export default function PayoutManagementSection() {
  const { data: requests = [], isLoading } = useGetPendingRewardRequests();
  const { mutate: approveRequest, isPending: isApproving } = useApproveRewardRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectRewardRequest();

  const getRewardTypeIcon = (type: RewardType) => {
    return type === RewardType.cash ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-4 w-1/4 rounded bg-muted" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payout Management</h2>
        <p className="text-sm text-muted-foreground">Review and process reward redemption requests</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">No pending requests</h3>
              <p className="text-sm text-muted-foreground">All reward requests have been processed</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getRewardTypeIcon(request.rewardType)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {request.rewardType === RewardType.cash ? 'Cash Reward' : 'Gift Card'}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div>{Number(request.amount)} points • User: {request.userId.toString().slice(0, 10)}...</div>
                        {request.rewardType === RewardType.cash && request.upiId && (
                          <div className="font-mono text-sm">
                            <span className="font-semibold">UPI ID:</span> {request.upiId}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approveRequest(request.id)}
                      disabled={isApproving || isRejecting}
                      className="gap-2 text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectRequest(request.id)}
                      disabled={isApproving || isRejecting}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
