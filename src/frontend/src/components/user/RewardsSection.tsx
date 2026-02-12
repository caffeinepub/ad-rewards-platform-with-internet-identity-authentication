import { useState, useEffect } from 'react';
import { useRedeemReward, useGetCallerUserProfile, useSetCallerUpiId, useGetUserRewards } from '../../hooks/useQueries';
import type { RewardRequest } from '../../types/rewards';
import { RewardStatus } from '../../types/rewards';
import { RewardType } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, DollarSign, CreditCard, Plus, AlertCircle } from 'lucide-react';

interface RewardsSectionProps {
  rewards: RewardRequest[];
  isLoading: boolean;
  userPoints: number;
}

export default function RewardsSection({ rewards, isLoading, userPoints }: RewardsSectionProps) {
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [rewardType, setRewardType] = useState<'cash' | 'giftCard'>('cash');
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showUpiInput, setShowUpiInput] = useState(false);
  
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: redeemReward, isPending: isRedeeming } = useRedeemReward();
  const { mutate: saveUpiId, isPending: isSavingUpi } = useSetCallerUpiId();

  const currentUpiId = userProfile?.upiId || '';
  const hasUpiId = currentUpiId && currentUpiId.length > 0;

  useEffect(() => {
    if (userProfile?.upiId) {
      setUpiId(userProfile.upiId);
    }
  }, [userProfile]);

  const handleRedeem = () => {
    const amountNum = parseInt(amount);
    if (amountNum > 0 && amountNum <= userPoints) {
      // For cash redemptions, check UPI ID
      if (rewardType === 'cash' && !hasUpiId && !upiId.trim()) {
        setShowUpiInput(true);
        return;
      }

      // If UPI ID was just entered, save it first
      if (rewardType === 'cash' && !hasUpiId && upiId.trim()) {
        saveUpiId(upiId.trim(), {
          onSuccess: () => {
            // After saving UPI, proceed with redemption
            redeemReward(
              { rewardType: RewardType[rewardType], amount: BigInt(amountNum) },
              {
                onSuccess: () => {
                  setShowRedeemDialog(false);
                  setAmount('');
                  setShowUpiInput(false);
                },
              }
            );
          },
        });
      } else {
        redeemReward(
          { rewardType: RewardType[rewardType], amount: BigInt(amountNum) },
          {
            onSuccess: () => {
              setShowRedeemDialog(false);
              setAmount('');
              setShowUpiInput(false);
            },
          }
        );
      }
    }
  };

  const getStatusBadge = (status: RewardStatus) => {
    switch (status) {
      case RewardStatus.pending:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Pending</Badge>;
      case RewardStatus.approved:
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">Approved</Badge>;
      case RewardStatus.rejected:
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400">Rejected</Badge>;
    }
  };

  const getRewardTypeIcon = (type: RewardType) => {
    return type === RewardType.cash ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />;
  };

  const isPending = isRedeeming || isSavingUpi;
  const canRedeem = amount && parseInt(amount) > 0 && parseInt(amount) <= userPoints;
  const needsUpiForCash = rewardType === 'cash' && !hasUpiId;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Redeem Rewards</h2>
            <p className="text-sm text-muted-foreground">Exchange your points for real rewards</p>
          </div>
          <Button onClick={() => setShowRedeemDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Redeem Points
          </Button>
        </div>

        {rewards.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Gift className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">No redemptions yet</h3>
                <p className="text-sm text-muted-foreground">Start redeeming your points for rewards</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getRewardTypeIcon(reward.rewardType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {reward.rewardType === RewardType.cash ? 'Cash Reward' : 'Gift Card'}
                        </CardTitle>
                        <CardDescription>{Number(reward.amount)} points</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(reward.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Points</DialogTitle>
            <DialogDescription>
              You have {userPoints} points available to redeem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rewardType">Reward Type</Label>
              <Select value={rewardType} onValueChange={(value: 'cash' | 'giftCard') => setRewardType(value)}>
                <SelectTrigger id="rewardType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash (UPI)</SelectItem>
                  <SelectItem value="giftCard">Gift Card</SelectItem>
                </SelectContent>
              </Select>
              {rewardType === 'cash' && (
                <p className="text-xs text-muted-foreground">
                  Cash rewards are processed via UPI after admin approval. Minimum: 50 points.
                </p>
              )}
              {rewardType === 'giftCard' && (
                <p className="text-xs text-muted-foreground">
                  Gift cards are processed after admin approval. Minimum: 500 points.
                </p>
              )}
            </div>

            {needsUpiForCash && (showUpiInput || !hasUpiId) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="text-sm font-medium">UPI ID Required for Cash Redemption</p>
                    <div className="space-y-2">
                      <Label htmlFor="upiIdInput">Enter your UPI ID</Label>
                      <Input
                        id="upiIdInput"
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={isPending}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your UPI ID will be saved for future redemptions.
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Points to Redeem</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max={userPoints}
                disabled={isPending}
              />
              {amount && parseInt(amount) > userPoints && (
                <p className="text-sm text-destructive">Insufficient points</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isPending || !canRedeem || (needsUpiForCash && !upiId.trim())}
            >
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                'Redeem'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
