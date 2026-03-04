import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Gift,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { RewardRequest } from "../../backend";
import { RewardStatus, RewardType } from "../../backend";
import {
  useGetCallerUserProfile,
  useGetUserRewards,
  useRedeemReward,
  useSetCallerUpiId,
} from "../../hooks/useQueries";

const CASH_MIN_POINTS = 50;
const GIFT_CARD_MIN_POINTS = 500;

interface RewardsSectionProps {
  userPoints: number;
}

export default function RewardsSection({ userPoints }: RewardsSectionProps) {
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [rewardType, setRewardType] = useState<"cash" | "giftCard">("cash");
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");

  const { data: userProfile } = useGetCallerUserProfile();
  const { data: rewards = [], isLoading } = useGetUserRewards();
  const { mutate: redeemReward, isPending: isRedeeming } = useRedeemReward();
  const { mutate: saveUpiId, isPending: isSavingUpi } = useSetCallerUpiId();

  const currentUpiId = userProfile?.upiId || "";
  const hasUpiId = currentUpiId.length > 0;
  const needsUpiForCash = rewardType === "cash" && !hasUpiId;

  const minPoints =
    rewardType === "cash" ? CASH_MIN_POINTS : GIFT_CARD_MIN_POINTS;
  const amountNum = Number.parseInt(amount) || 0;
  const isAmountValid = amountNum >= minPoints && amountNum <= userPoints;
  const canRedeem =
    isAmountValid && (!needsUpiForCash || upiId.trim().length > 0);
  const isPending = isRedeeming || isSavingUpi;

  const handleOpenDialog = () => {
    if (hasUpiId) {
      setUpiId(currentUpiId);
    }
    setShowRedeemDialog(true);
  };

  const handleRedeem = () => {
    if (!isAmountValid) return;

    const doRedeem = () => {
      redeemReward(
        { rewardType: RewardType[rewardType], amount: BigInt(amountNum) },
        {
          onSuccess: () => {
            setShowRedeemDialog(false);
            setAmount("");
            setUpiId("");
          },
        },
      );
    };

    if (rewardType === "cash" && !hasUpiId && upiId.trim()) {
      saveUpiId(upiId.trim(), { onSuccess: doRedeem });
    } else {
      doRedeem();
    }
  };

  const getStatusConfig = (status: RewardStatus) => {
    switch (status) {
      case RewardStatus.pending:
        return {
          badge: (
            <Badge
              variant="outline"
              className="gap-1 bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          ),
          borderColor: "border-l-amber-400",
        };
      case RewardStatus.approved:
        return {
          badge: (
            <Badge
              variant="outline"
              className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3 w-3" />
              Approved
            </Badge>
          ),
          borderColor: "border-l-emerald-400",
        };
      case RewardStatus.rejected:
        return {
          badge: (
            <Badge
              variant="outline"
              className="gap-1 bg-red-500/10 text-red-600 border-red-300 dark:text-red-400"
            >
              <XCircle className="h-3 w-3" />
              Rejected
            </Badge>
          ),
          borderColor: "border-l-red-400",
        };
    }
  };

  const getRewardTypeIcon = (type: RewardType) => {
    return type === RewardType.cash ? (
      <DollarSign className="h-4 w-4 text-emerald-500" />
    ) : (
      <CreditCard className="h-4 w-4 text-blue-500" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
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
            <h2 className="text-2xl font-bold">My Rewards</h2>
            <p className="text-sm text-muted-foreground">
              Redeem your points for cash (UPI) or gift cards
            </p>
          </div>
          <Button
            onClick={handleOpenDialog}
            className="gap-2"
            data-ocid="rewards.redeem_button"
          >
            <Plus className="h-4 w-4" />
            Redeem Points
          </Button>
        </div>

        {/* Minimums info */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <DollarSign className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-medium">Cash via UPI</p>
              <p className="text-xs text-muted-foreground">
                Minimum {CASH_MIN_POINTS} points
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <CreditCard className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-medium">Gift Card</p>
              <p className="text-xs text-muted-foreground">
                Minimum {GIFT_CARD_MIN_POINTS} points
              </p>
            </div>
          </div>
        </div>

        {rewards.length === 0 ? (
          <Card data-ocid="rewards.empty_state">
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Gift className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">No redemptions yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start watching ads and redeem your points for rewards
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenDialog}
                data-ocid="rewards.redeem_button"
              >
                Redeem your first reward
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rewards.map((reward: RewardRequest, index: number) => {
              const statusConfig = getStatusConfig(reward.status);
              return (
                <Card
                  key={reward.id}
                  data-ocid={`rewards.item.${index + 1}`}
                  className={`border-l-4 ${statusConfig?.borderColor}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                          {getRewardTypeIcon(reward.rewardType)}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {reward.rewardType === RewardType.cash
                              ? "Cash Payout (UPI)"
                              : "Gift Card"}
                          </CardTitle>
                          <CardDescription>
                            <span className="font-medium text-foreground">
                              {Number(reward.amount)} points
                            </span>
                            {reward.rewardType === RewardType.cash &&
                              reward.upiId && (
                                <span className="ml-2 font-mono text-xs">
                                  → {reward.upiId}
                                </span>
                              )}
                          </CardDescription>
                        </div>
                      </div>
                      {statusConfig?.badge}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={showRedeemDialog}
        onOpenChange={setShowRedeemDialog}
        data-ocid="rewards.redeem_dialog"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Points</DialogTitle>
            <DialogDescription>
              You have <strong>{userPoints}</strong> points available to redeem
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Reward Type */}
            <div className="space-y-2">
              <Label htmlFor="rewardType">Reward Type</Label>
              <Select
                value={rewardType}
                onValueChange={(value: "cash" | "giftCard") => {
                  setRewardType(value);
                  setAmount("");
                }}
              >
                <SelectTrigger
                  id="rewardType"
                  data-ocid="rewards.reward_type_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      Cash via UPI (min. {CASH_MIN_POINTS} pts)
                    </div>
                  </SelectItem>
                  <SelectItem value="giftCard">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      Gift Card (min. {GIFT_CARD_MIN_POINTS} pts)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* UPI ID input for cash when not set */}
            {needsUpiForCash && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2 mt-1">
                    <p className="text-sm font-medium">
                      UPI ID required for cash payout
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor="redeemUpiId" className="text-xs">
                        Your UPI ID
                      </Label>
                      <Input
                        id="redeemUpiId"
                        placeholder="yourname@upi or yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={isPending}
                        data-ocid="rewards.upi_input"
                      />
                      <p className="text-xs text-muted-foreground">
                        Will be saved for future use.
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Points to Redeem</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Enter amount (min. ${minPoints})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minPoints}
                max={userPoints}
                disabled={isPending}
                data-ocid="rewards.amount_input"
              />
              {amount && amountNum < minPoints && (
                <p className="text-xs text-destructive">
                  Minimum {minPoints} points required for{" "}
                  {rewardType === "cash" ? "cash" : "gift card"} redemption
                </p>
              )}
              {amount && amountNum > userPoints && (
                <p className="text-xs text-destructive">
                  You only have {userPoints} points
                </p>
              )}
              {amount && isAmountValid && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ {amountNum} points will be redeemed
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRedeemDialog(false)}
              disabled={isPending}
              data-ocid="rewards.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isPending || !canRedeem}
              data-ocid="rewards.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Redeem"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
