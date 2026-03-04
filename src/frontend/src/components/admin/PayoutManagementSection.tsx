import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, CreditCard, DollarSign, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import type { RewardRequest } from "../../backend";
import { RewardStatus, RewardType } from "../../backend";
import {
  useApproveRewardRequest,
  useGetPendingRewardRequests,
  useRejectRewardRequest,
} from "../../hooks/useQueries";

function getStatusBadge(status: RewardStatus) {
  switch (status) {
    case RewardStatus.pending:
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400"
        >
          Pending
        </Badge>
      );
    case RewardStatus.approved:
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400"
        >
          Approved
        </Badge>
      );
    case RewardStatus.rejected:
      return (
        <Badge
          variant="outline"
          className="bg-red-500/10 text-red-600 border-red-300 dark:text-red-400"
        >
          Rejected
        </Badge>
      );
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied to clipboard");
  });
}

export default function PayoutManagementSection() {
  const { data: requests = [], isLoading } = useGetPendingRewardRequests();
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveRewardRequest();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectRewardRequest();

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
        {[1, 2, 3].map((i) => (
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payout Management</h2>
          <p className="text-sm text-muted-foreground">
            Review and process reward redemption requests
            {requests.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                {requests.length} pending
              </span>
            )}
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card data-ocid="admin.payout.empty_state">
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">No pending requests</h3>
              <p className="text-sm text-muted-foreground">
                All reward requests have been processed
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request: RewardRequest, index: number) => (
            <Card
              key={request.id}
              data-ocid={`admin.payout.item.${index + 1}`}
              className="border-l-4 border-l-amber-400"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      {getRewardTypeIcon(request.rewardType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-base">
                          {request.rewardType === RewardType.cash
                            ? "Cash Payout (UPI)"
                            : "Gift Card Reward"}
                        </CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">
                            {Number(request.amount)} points
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-mono text-xs truncate">
                            User: {request.userId.toString().slice(0, 16)}...
                          </span>
                        </div>

                        {request.rewardType === RewardType.cash &&
                          request.upiId && (
                            <div className="flex items-center gap-2 rounded-md bg-muted/50 border border-border px-3 py-2">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-muted-foreground">
                                  UPI ID
                                </span>
                                <div className="font-mono text-sm font-semibold text-foreground break-all">
                                  {request.upiId}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(request.upiId!)}
                                className="shrink-0 rounded p-1 hover:bg-background transition-colors"
                                title="Copy UPI ID"
                              >
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          )}

                        {request.rewardType === RewardType.cash &&
                          !request.upiId && (
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                              <span>⚠</span>
                              <span>
                                No UPI ID on file — contact user to provide UPI
                                details
                              </span>
                            </div>
                          )}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approveRequest(request.id)}
                      disabled={isApproving || isRejecting}
                      className="gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                      data-ocid={`admin.payout.approve_button.${index + 1}`}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectRequest(request.id)}
                      disabled={isApproving || isRejecting}
                      className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
                      data-ocid={`admin.payout.delete_button.${index + 1}`}
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
