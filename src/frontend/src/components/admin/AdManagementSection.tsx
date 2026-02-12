import { useState } from 'react';
import { useGetAllAds, useCreateAd, useUpdateAd, useDeleteAd } from '../../hooks/useQueries';
import type { Advertisement } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Megaphone } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdManagementSection() {
  const { data: ads = [], isLoading } = useGetAllAds();
  const { mutate: createAd, isPending: isCreating } = useCreateAd();
  const { mutate: updateAd, isPending: isUpdating } = useUpdateAd();
  const { mutate: deleteAd, isPending: isDeleting } = useDeleteAd();

  const [showDialog, setShowDialog] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [deleteAdId, setDeleteAdId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pointsReward: '',
    active: true,
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', pointsReward: '', active: true });
    setEditingAd(null);
  };

  const handleOpenDialog = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        content: ad.content,
        pointsReward: Number(ad.pointsReward).toString(),
        active: ad.active,
      });
    } else {
      resetForm();
    }
    setShowDialog(true);
  };

  const handleSubmit = () => {
    const points = parseInt(formData.pointsReward);
    if (!formData.title || !formData.content || points <= 0) return;

    if (editingAd) {
      updateAd(
        {
          adId: editingAd.id,
          title: formData.title,
          content: formData.content,
          pointsReward: BigInt(points),
          active: formData.active,
        },
        {
          onSuccess: () => {
            setShowDialog(false);
            resetForm();
          },
        }
      );
    } else {
      createAd(
        {
          title: formData.title,
          content: formData.content,
          pointsReward: BigInt(points),
        },
        {
          onSuccess: () => {
            setShowDialog(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteAdId) {
      deleteAd(deleteAdId, {
        onSuccess: () => {
          setDeleteAdId(null);
        },
      });
    }
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
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Advertisement Management</h2>
            <p className="text-sm text-muted-foreground">Create and manage advertisements</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Ad
          </Button>
        </div>

        {ads.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">No advertisements yet</h3>
                <p className="text-sm text-muted-foreground">Create your first ad to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{ad.title}</CardTitle>
                        <Badge variant={ad.active ? 'default' : 'outline'}>
                          {ad.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">{ad.content}</CardDescription>
                      <p className="mt-2 text-sm font-semibold text-primary">
                        Reward: {Number(ad.pointsReward)} points
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(ad)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDeleteAdId(ad.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => !open && (setShowDialog(false), resetForm())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAd ? 'Edit Advertisement' : 'Create Advertisement'}</DialogTitle>
            <DialogDescription>
              {editingAd ? 'Update the advertisement details' : 'Create a new advertisement for users to watch'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter ad title"
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter ad content"
                rows={5}
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points Reward</Label>
              <Input
                id="points"
                type="number"
                value={formData.pointsReward}
                onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                placeholder="Enter points reward"
                min="1"
                disabled={isCreating || isUpdating}
              />
            </div>
            {editingAd && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  disabled={isCreating || isUpdating}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => (setShowDialog(false), resetForm())} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || !formData.title || !formData.content || parseInt(formData.pointsReward) <= 0}
            >
              {isCreating || isUpdating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {editingAd ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingAd ? 'Update' : 'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteAdId} onOpenChange={(open) => !open && setDeleteAdId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this advertisement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
