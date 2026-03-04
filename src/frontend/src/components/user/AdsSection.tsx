import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Coins,
  Loader2,
  Play,
  Sparkles,
  Trophy,
  Tv2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Advertisement } from "../../backend";
import { useWatchAd } from "../../hooks/useQueries";

interface AdsSectionProps {
  ads: Advertisement[];
  isLoading: boolean;
}

const AD_GRADIENTS = [
  "from-orange-500 via-red-500 to-pink-600",
  "from-violet-600 via-purple-600 to-indigo-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-pink-500 via-rose-500 to-orange-500",
  "from-amber-500 via-yellow-500 to-orange-400",
  "from-blue-500 via-indigo-500 to-violet-600",
];

const AD_ICONS = [Sparkles, Zap, Trophy, Coins, Play, Tv2];

const COUNTDOWN_SECONDS = 15;

export default function AdsSection({ ads, isLoading }: AdsSectionProps) {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isCountdownDone, setIsCountdownDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { mutate: watchAd, isPending } = useWatchAd();

  // Reset and start countdown when dialog opens
  useEffect(() => {
    if (selectedAd) {
      setCountdown(COUNTDOWN_SECONDS);
      setIsCountdownDone(false);
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsCountdownDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedAd]);

  const handleWatchAd = () => {
    if (selectedAd) {
      watchAd(selectedAd.id, {
        onSuccess: () => {
          setSelectedAd(null);
        },
      });
    }
  };

  const totalPoints = ads.reduce((sum, ad) => sum + Number(ad.pointsReward), 0);
  const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-border bg-card"
              data-ocid={"ads.loading_state"}
            >
              <Skeleton className="h-44 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div
        className="flex min-h-[360px] flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16"
        data-ocid="ads.empty_state"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
          <Tv2 className="h-10 w-10 text-white" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold font-display">
            No ads available right now
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            New ads are added regularly. Check back soon to start earning
            points!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            {ads.length} {ads.length === 1 ? "Ad" : "Ads"} Available
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Watch them all to maximize your earnings!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 shadow-sm">
          <Coins className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {totalPoints.toLocaleString()} pts available
          </span>
        </div>
      </div>

      {/* Ad Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad, index) => {
          const gradient = AD_GRADIENTS[index % AD_GRADIENTS.length];
          const AdIcon = AD_ICONS[index % AD_ICONS.length];
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Banner */}
              <div
                className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
                data-ocid={`ads.ad_banner.${index + 1}`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-white/30 blur-xl" />
                  <div className="absolute bottom-2 left-6 h-16 w-16 rounded-full bg-white/20 blur-lg" />
                  <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                </div>

                {/* Ad icon background */}
                <div className="absolute top-3 left-3 rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <AdIcon className="h-4 w-4 text-white" />
                </div>

                {/* Points badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/20">
                  <span className="text-base leading-none">🪙</span>
                  <span className="text-sm font-bold text-white">
                    {Number(ad.pointsReward)} pts
                  </span>
                </div>

                {/* Play button */}
                <button
                  type="button"
                  onClick={() => setSelectedAd(ad)}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 transition-all duration-200 group-hover:scale-110 group-hover:bg-white/30 cursor-pointer"
                  aria-label={`Watch ${ad.title}`}
                >
                  <Play className="h-7 w-7 text-white fill-white ml-1" />
                </button>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-base font-display line-clamp-2 text-foreground mb-1.5">
                  {ad.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {ad.content}
                </p>

                {/* Earn indicator */}
                <div className="flex items-center gap-1.5 mt-3 mb-4 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Coins className="h-3.5 w-3.5" />
                  <span>Earn {Number(ad.pointsReward)} points instantly</span>
                </div>

                <Button
                  onClick={() => setSelectedAd(ad)}
                  className="w-full gap-2 font-semibold"
                  data-ocid={`ads.watch_button.${index + 1}`}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch &amp; Earn
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ad Viewing Dialog */}
      <Dialog
        open={!!selectedAd}
        onOpenChange={(open) => !open && setSelectedAd(null)}
      >
        <DialogContent
          className="max-w-lg p-0 overflow-hidden"
          data-ocid="ads.dialog"
        >
          {selectedAd &&
            (() => {
              const adIndex = ads.findIndex((a) => a.id === selectedAd.id);
              const gradient = AD_GRADIENTS[adIndex % AD_GRADIENTS.length];
              return (
                <>
                  {/* Dialog Banner */}
                  <div
                    className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-8 h-24 w-24 rounded-full bg-white/30 blur-xl" />
                      <div className="absolute bottom-0 left-4 h-20 w-20 rounded-full bg-white/20 blur-lg" />
                    </div>
                    <div className="relative text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Tv2 className="h-5 w-5 text-white/80" />
                        <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                          Advertisement
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-2xl">🪙</span>
                        <span className="text-3xl font-bold text-white font-display">
                          {Number(selectedAd.pointsReward)}
                        </span>
                        <span className="text-white/80 text-lg font-medium">
                          points
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <DialogHeader className="space-y-1 text-left">
                      <DialogTitle className="text-xl font-bold font-display">
                        {selectedAd.title}
                      </DialogTitle>
                    </DialogHeader>

                    {/* Ad Content */}
                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        {selectedAd.content}
                      </p>
                    </div>

                    {/* Countdown / Success */}
                    <AnimatePresence mode="wait">
                      {!isCountdownDone ? (
                        <motion.div
                          key="countdown"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">
                              Watch the ad to earn{" "}
                              <span className="text-amber-600 dark:text-amber-400 font-bold">
                                {Number(selectedAd.pointsReward)} points
                              </span>
                            </span>
                            <span
                              className="text-xl font-bold font-display text-primary tabular-nums"
                              data-ocid="ads.countdown_timer"
                            >
                              {countdown}s
                            </span>
                          </div>
                          <div data-ocid="ads.timer_progress">
                            <Progress
                              value={progress}
                              className="h-3 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            ⏱ {countdown}s remaining — keep watching!
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            You've watched the ad! Claim your{" "}
                            <strong>
                              {Number(selectedAd.pointsReward)} points
                            </strong>{" "}
                            now.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <DialogFooter className="gap-2 sm:gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedAd(null)}
                        disabled={isPending}
                        className="flex-1"
                        data-ocid="ads.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleWatchAd}
                        disabled={!isCountdownDone || isPending}
                        className="flex-1 gap-2 font-semibold"
                        data-ocid="ads.claim_points_button"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <Coins className="h-4 w-4" />
                            Claim Points
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
