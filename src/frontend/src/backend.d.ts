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
    amount: bigint;
}
export interface Advertisement {
    id: string;
    title: string;
    active: boolean;
    content: string;
    pointsReward: bigint;
}
export interface UserProfile {
    name: string;
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
    getAllAds(): Promise<Array<Advertisement>>;
    getAllRewardRequests(): Promise<Array<RewardRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingRewardRequests(): Promise<Array<RewardRequest>>;
    getPoints(): Promise<bigint>;
    getUserAnalytics(): Promise<{
        totalUsers: bigint;
        totalPoints: bigint;
        totalRewardRequests: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRewards(): Promise<Array<RewardRequest>>;
    isCallerAdmin(): Promise<boolean>;
    redeemReward(rewardType: RewardType, amount: bigint): Promise<string>;
    rejectRewardRequest(requestId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAd(adId: string, title: string, content: string, pointsReward: bigint, active: boolean): Promise<void>;
    watchAd(adId: string): Promise<bigint>;
}
