import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Advertisement {
    id: string;
    title: string;
    active: boolean;
    content: string;
    pointsReward: bigint;
}
export interface UserProfile {
    name: string;
    upiId?: string;
    points: bigint;
}
export interface RewardRequest {
    id: string;
    userId: Principal;
    rewardType: RewardType;
    amount: bigint;
    status: RewardStatus;
    upiId?: string;
}
export enum RewardType {
    cash = "cash",
    giftCard = "giftCard"
}
export enum RewardStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
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
    getCallerUpiId(): Promise<string | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserUpiId(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    redeemReward(rewardType: RewardType, amount: bigint): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCallerUpiId(upiId: string): Promise<void>;
    updateAd(adId: string, title: string, content: string, pointsReward: bigint, active: boolean): Promise<void>;
    watchAd(adId: string): Promise<bigint>;
}
