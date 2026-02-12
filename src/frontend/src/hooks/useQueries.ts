import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Advertisement, RewardRequest, RewardType } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Ad Queries
export function useGetActiveAds() {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['activeAds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWatchAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.watchAd(adId);
    },
    onSuccess: (newPoints) => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['activeAds'] });
      toast.success(`Ad watched! You earned points. Total: ${newPoints}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to watch ad');
    },
  });
}

// Reward Queries
export function useGetUserRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardRequest[]>({
    queryKey: ['userRewards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserRewards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRedeemReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardType, amount }: { rewardType: RewardType; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.redeemReward(rewardType, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      toast.success('Reward request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to redeem reward');
    },
  });
}

// Admin - Ad Management
export function useGetAllAds() {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['allAds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, pointsReward }: { title: string; content: string; pointsReward: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAd(title, content, pointsReward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAds'] });
      toast.success('Ad created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create ad');
    },
  });
}

export function useUpdateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ adId, title, content, pointsReward, active }: { adId: string; title: string; content: string; pointsReward: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAd(adId, title, content, pointsReward, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAds'] });
      toast.success('Ad updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update ad');
    },
  });
}

export function useDeleteAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAd(adId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAds'] });
      toast.success('Ad deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete ad');
    },
  });
}

// Admin - Payout Management
export function useGetAllRewardRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardRequest[]>({
    queryKey: ['allRewardRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRewardRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingRewardRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardRequest[]>({
    queryKey: ['pendingRewardRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRewardRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveRewardRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveRewardRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRewardRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRewardRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userAnalytics'] });
      toast.success('Reward request approved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve request');
    },
  });
}

export function useRejectRewardRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectRewardRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRewardRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRewardRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userAnalytics'] });
      toast.success('Reward request rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject request');
    },
  });
}

// Admin - Analytics
export function useGetUserAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<{ totalUsers: bigint; totalPoints: bigint; totalRewardRequests: bigint }>({
    queryKey: ['userAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}
