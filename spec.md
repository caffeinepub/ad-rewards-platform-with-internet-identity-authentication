# AdWatch - Watch Ads & Earn Rewards

## Current State

A full-stack app where users watch ads to earn points and redeem them via UPI (cash) or gift cards. The app has:

- Internet Identity login
- User dashboard with ads viewing and rewards redemption
- Admin dashboard with ad management and payout management
- Backend with UPI ID storage, ad management, watchAd, redeemReward, approveRewardRequest

**Gaps in current implementation:**
- Backend missing: `getAllRewardRequests`, `getPendingRewardRequests`, `rejectRewardRequest`, `getAnalytics`
- Frontend hooks for reward requests and analytics are disabled (returning empty arrays / `enabled: false`)
- Admin payout section cannot show pending requests or reject them
- Analytics section always shows zeros

## Requested Changes (Diff)

### Add
- Backend: `getAllRewardRequests` - returns all reward requests (admin only)
- Backend: `getPendingRewardRequests` - returns only pending requests (admin only)
- Backend: `rejectRewardRequest` - marks a request as rejected (admin only)
- Backend: `getAnalytics` - returns `{ totalUsers, totalPointsIssued, totalRewardRequests }` (admin only)
- Frontend: Wire `useGetPendingRewardRequests` and `useGetAllRewardRequests` to real backend calls
- Frontend: Wire `useRejectRewardRequest` to real backend `rejectRewardRequest`
- Frontend: Wire `useGetUserAnalytics` to real backend `getAnalytics`
- Frontend: Show user's own reward request history via `getCallerRewardRequests` (new backend method)
- UPI profile section in UserDashboard so users can view and update their UPI ID

### Modify
- Backend: Add `getCallerRewardRequests` for users to see their own history
- Frontend: `useGetUserRewards` should call `getCallerRewardRequests`
- Admin PayoutManagement: enable reject button with real backend call
- Admin Analytics: show live data from `getAnalytics`
- User RewardsSection: show actual redemption history

### Remove
- Nothing removed

## Implementation Plan

1. Regenerate Motoko backend adding:
   - `getAllRewardRequests() : async [RewardRequest]` (admin)
   - `getPendingRewardRequests() : async [RewardRequest]` (admin)
   - `rejectRewardRequest(requestId: Text) : async ()` (admin)
   - `getCallerRewardRequests() : async [RewardRequest]` (user - own requests)
   - `getAnalytics() : async { totalUsers: Nat; totalPointsIssued: Nat; totalRewardRequests: Nat }` (admin)

2. Update frontend hooks in `useQueries.ts`:
   - Enable `useGetPendingRewardRequests` and `useGetAllRewardRequests` with real actor calls
   - Enable `useRejectRewardRequest` with real actor call
   - Enable `useGetUserRewards` with `getCallerRewardRequests`
   - Enable `useGetUserAnalytics` with `getAnalytics`

3. Polish frontend:
   - Ensure UPI ID management is visible in user profile/settings
   - Admin payout section shows UPI IDs and approve/reject buttons work
   - User rewards section shows their history with status badges
   - Analytics show live platform stats
