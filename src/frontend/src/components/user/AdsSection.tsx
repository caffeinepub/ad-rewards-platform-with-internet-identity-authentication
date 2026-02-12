import { useState } from 'react';
import { useWatchAd } from '../../hooks/useQueries';
import type { Advertisement } from '../../backend';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coins, Play } from 'lucide-react';

interface AdsSectionProps {
  ads: Advertisement[];
  isLoading: boolean;
}

export default function AdsSection({ ads, isLoading }: AdsSectionProps) {
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const { mutate: watchAd, isPending } = useWatchAd();

  const handleWatchAd = () => {
    if (selectedAd) {
      watchAd(selectedAd.id, {
        onSuccess: () => {
          setSelectedAd(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">No ads available</h3>
            <p className="text-sm text-muted-foreground">Check back later for new advertisements</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="line-clamp-2">{ad.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{Number(ad.pointsReward)} points</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="line-clamp-3 text-sm text-muted-foreground">{ad.content}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSelectedAd(ad)} className="w-full gap-2">
                <Play className="h-4 w-4" />
                Watch Ad
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAd?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              Earn <Coins className="inline h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{Number(selectedAd?.pointsReward || 0)} points</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm leading-relaxed">{selectedAd?.content}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAd(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleWatchAd} disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" />
                  Claim Points
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
