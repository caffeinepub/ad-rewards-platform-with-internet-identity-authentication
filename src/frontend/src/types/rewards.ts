import type { Principal } from '@icp-sdk/core/principal';
import { RewardType } from '../backend';

export enum RewardStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export interface RewardRequest {
  id: string;
  userId: Principal;
  rewardType: RewardType;
  amount: bigint;
  status: RewardStatus;
  upiId?: string;
}
