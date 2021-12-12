import { types } from 'mobx-state-tree';

import { Token } from '@/types';

import TokenModel from '../Token';

export interface ITokenMobx extends Token {
  decimals: number;
  projectLink: string;
  logoURI: string;
  busdPrice: string;
}

const StakeUnstakeModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
    isStaking: types.optional(types.boolean, true),
    maxStakingValue: types.optional(types.number, 0),
    stakingToken: types.maybeNull(TokenModel),
    isAutoVault: types.boolean,
    poolId: types.number,
  })
  .actions((self) => ({
    close() {
      self.isOpen = false;
    },
    open({
      isStaking,
      maxStakingValue,
      stakingToken,
      isAutoVault,
      poolId,
    }: {
      isStaking: boolean;
      maxStakingValue: number;
      stakingToken: ITokenMobx;
      isAutoVault: boolean;
      poolId: number;
    }) {
      self.isOpen = true;

      self.isStaking = isStaking;
      self.maxStakingValue = maxStakingValue;
      self.stakingToken = stakingToken;
      self.isAutoVault = isAutoVault;
      self.poolId = poolId;
    },
  }));

export default StakeUnstakeModal;
