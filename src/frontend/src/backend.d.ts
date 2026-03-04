import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface RewardRequest {
    id: string;
    status: RewardStatus;
    userId: UserId;
    rewardType: RewardType;
    upiId?: string;
    amount: bigint;
}
export interface Advertisement {
    id: string;
    title: string;
    active: boolean;
    content: string;
    pointsReward: bigint;
}
export interface PlatformStats {
    totalPointsIssued: bigint;
    totalUsers: bigint;
    totalRewardRequests: bigint;
}
export interface UserProfile {
    name: string;
    upiId?: string;
    points: bigint;
}
export enum RewardStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RewardType {
    cash = "cash",
    giftCard = "giftCard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveRewardRequest(requestId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAd(title: string, content: string, pointsReward: bigint): Promise<string>;
    deleteAd(adId: string): Promise<void>;
    getActiveAds(): Promise<Array<Advertisement>>;
    getAds(): Promise<Array<Advertisement>>;
    getAllRewardRequests(): Promise<Array<RewardRequest>>;
    getCallerRewardRequests(): Promise<Array<RewardRequest>>;
    getCallerUpiId(): Promise<string | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingRewardRequests(): Promise<Array<RewardRequest>>;
    getStats(): Promise<PlatformStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserUpiId(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    redeemReward(rewardType: RewardType, amount: bigint): Promise<string>;
    rejectRewardRequest(requestId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCallerUpiId(upiId: string): Promise<void>;
    updateAd(adId: string, title: string, content: string, pointsReward: bigint, active: boolean): Promise<void>;
    verifyCashPayoutReceived(requestId: string): Promise<void>;
    watchAd(adId: string): Promise<bigint>;
}
