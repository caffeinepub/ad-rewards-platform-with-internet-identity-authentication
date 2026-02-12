import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Advertisement, RewardType } from '../backend';
import type { RewardRequest } from '../types/rewards';
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
      queryClient.invalidateQueries({ queryKey: ['callerUpiId'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// UPI ID Management
export function useGetCallerUpiId() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['callerUpiId'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUpiId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetCallerUpiId() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (upiId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setCallerUpiId(upiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['callerUpiId'] });
      toast.success('UPI ID saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save UPI ID');
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

// Reward Queries - Using local state since backend doesn't expose these methods
export function useGetUserRewards() {
  // Return empty array since backend doesn't have getUserRewards method
  return useQuery<RewardRequest[]>({
    queryKey: ['userRewards'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
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
      queryClient.invalidateQueries({ queryKey: ['pendingRewardRequests'] });
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

  // Use getActiveAds since getAllAds doesn't exist
  return useQuery<Advertisement[]>({
    queryKey: ['allAds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAds();
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
      queryClient.invalidateQueries({ queryKey: ['activeAds'] });
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
      queryClient.invalidateQueries({ queryKey: ['activeAds'] });
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
      queryClient.invalidateQueries({ queryKey: ['activeAds'] });
      toast.success('Ad deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete ad');
    },
  });
}

// Admin - Payout Management
export function useGetAllRewardRequests() {
  // Return empty array since backend doesn't have this method
  return useQuery<RewardRequest[]>({
    queryKey: ['allRewardRequests'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetPendingRewardRequests() {
  // Return empty array since backend doesn't have this method
  return useQuery<RewardRequest[]>({
    queryKey: ['pendingRewardRequests'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
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
      // Backend doesn't have rejectRewardRequest, so this will fail
      // Keeping the structure for future implementation
      throw new Error('Reject functionality not yet implemented in backend');
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
  // Return mock data since backend doesn't have this method
  return useQuery<{ totalUsers: bigint; totalPoints: bigint; totalRewardRequests: bigint }>({
    queryKey: ['userAnalytics'],
    queryFn: async () => {
      return {
        totalUsers: BigInt(0),
        totalPoints: BigInt(0),
        totalRewardRequests: BigInt(0),
      };
    },
    enabled: false,
  });
}
