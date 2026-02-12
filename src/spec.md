# Specification

## Summary
**Goal:** Support UPI payout details for cash reward redemptions so users can provide a UPI ID and admins can see where to pay for approved cash requests.

**Planned changes:**
- Backend: Add optional UPI ID to user profiles, expose it via API, and provide a user method to set/update their own UPI ID.
- Backend: Require a UPI ID for cash reward redemption and store the UPI ID on each cash RewardRequest at redemption time for admin visibility (immutable per request).
- Frontend: Add UI to enter/edit UPI ID in profile/setup/settings and save it to the backend.
- Frontend: Validate that cash redemption cannot be submitted without a non-empty UPI ID and show a clear inline English error.
- Frontend: Show UPI ID for cash requests in the admin payout management list (not for gift card requests) and update React Query hooks/caching to include new calls and invalidations.
- Frontend: Update user-facing copy to state cash payouts are via UPI based on stored UPI ID and are manually admin-approved (no claims of automated transfers or Google Play Store distribution).

**User-visible outcome:** Users can add their UPI ID and must provide it to redeem cash rewards; admins can view the UPI ID on pending cash payout requests and process payouts manually after approval.
