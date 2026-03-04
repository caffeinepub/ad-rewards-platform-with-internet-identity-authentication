import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Edit2, Loader2, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetCallerUpiId,
  useGetCallerUserProfile,
  useSetCallerUpiId,
} from "../../hooks/useQueries";

export default function ProfileSection() {
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: savedUpiId, isLoading: upiLoading } = useGetCallerUpiId();
  const { mutate: saveUpiId, isPending: isSaving } = useSetCallerUpiId();

  const [upiInput, setUpiInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (savedUpiId) {
      setUpiInput(savedUpiId);
    }
  }, [savedUpiId]);

  const handleSaveUpi = () => {
    if (!upiInput.trim()) return;
    saveUpiId(upiInput.trim(), {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleEdit = () => {
    setUpiInput(savedUpiId || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUpiInput(savedUpiId || "");
    setIsEditing(false);
  };

  if (profileLoading || upiLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile & UPI</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile and payout details
        </p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">Display Name</p>
            <p className="font-medium">{userProfile?.name || "—"}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-0.5">
              Points Balance
            </p>
            <p className="text-xl font-bold text-primary">
              {Number(userProfile?.points || 0).toLocaleString()} pts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* UPI ID Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-base">UPI Payment Details</CardTitle>
                <CardDescription>Required for cash payouts</CardDescription>
              </div>
            </div>
            {savedUpiId && !isEditing && (
              <Badge
                variant="outline"
                className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing && savedUpiId ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Current UPI ID
                </p>
                <p className="font-mono font-medium text-foreground">
                  {savedUpiId}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleEdit}
                data-ocid="profile.save_upi_button"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Update UPI ID
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {!savedUpiId && !isEditing && (
                <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    ⚠ No UPI ID saved. Add your UPI ID to enable cash payouts.
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="upiIdProfile">UPI ID</Label>
                <Input
                  id="upiIdProfile"
                  placeholder="yourname@upi or yourname@bank"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  disabled={isSaving}
                  data-ocid="profile.upi_input"
                />
                <p className="text-xs text-muted-foreground">
                  Example: name@paytm, name@oksbi, name@ybl
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSaveUpi}
                  disabled={isSaving || !upiInput.trim()}
                  data-ocid="profile.save_upi_button"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Save UPI ID
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground text-sm">
              How payouts work
            </p>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">①</span>
                <span>Watch ads and accumulate points in your balance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">②</span>
                <span>
                  Go to Rewards tab and submit a redemption request (min. 50 pts
                  for cash)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">③</span>
                <span>
                  Admin reviews and approves your request, then sends payment to
                  your UPI ID
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">④</span>
                <span>
                  Cash is credited to your UPI account within 1–3 business days
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
