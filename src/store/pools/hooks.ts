import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import useRefresh from '@/hooks/useRefresh';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { toBigNumber } from '@/utils';

import { useMst } from '..';

import { getStakedValue, transformPool } from './helpers';

export const usePools = (): { pools: Pool[] } => {
  const { fastRefresh } = useRefresh();
  const { pools: poolStore, user } = useMst();

  useEffect(() => {
    if (user.address) {
      poolStore.fetchPoolsUserDataAsync(user.address);
    }
  }, [user.address, poolStore, fastRefresh]);

  return { pools: poolStore.data.slice().map(transformPool as any) };
};

export const useSelectVaultData = () => {
  const {
    pools: {
      estimatedRefineryBountyReward: estimatedRefineryBountyRewardRaw,
      totalRefineryInVault: totalRefineryInVaultRaw,
      pricePerFullShare: pricePerFullShareRaw,
      totalShares: totalSharesRaw,
      availableRefineryAmountToCompound: availableRefineryAmountToCompoundRaw,
      fuelTokensAmount: fuelTokensAmountRaw,
      fees,
      userData: {
        isLoading,
        userShares: userSharesAsString,
        refineryAtLastUserAction: refineryAtLastUserActionAsString,
        lastDepositedTime,
        lastUserActionTime,
      },
    },
  } = useMst();

  const estimatedRefineryBountyReward = useMemo(
    () => toBigNumber(estimatedRefineryBountyRewardRaw, true),
    [estimatedRefineryBountyRewardRaw],
  );

  const totalRefineryInVault = useMemo(() => toBigNumber(totalRefineryInVaultRaw, true), [
    totalRefineryInVaultRaw,
  ]);

  const pricePerFullShare = useMemo(() => toBigNumber(pricePerFullShareRaw, true), [
    pricePerFullShareRaw,
  ]);

  const totalShares = useMemo(() => toBigNumber(totalSharesRaw, true), [totalSharesRaw]);

  const availableRefineryAmountToCompound = useMemo(
    () => toBigNumber(availableRefineryAmountToCompoundRaw),
    [availableRefineryAmountToCompoundRaw],
  );

  const fuelTokensAmount = useMemo(() => toBigNumber(fuelTokensAmountRaw), [fuelTokensAmountRaw]);

  const userShares = useMemo(() => toBigNumber(userSharesAsString, true), [userSharesAsString]);

  const refineryAtLastUserAction = useMemo(
    () => toBigNumber(refineryAtLastUserActionAsString, true),
    [refineryAtLastUserActionAsString],
  );

  return {
    estimatedRefineryBountyReward,
    totalRefineryInVault,
    pricePerFullShare,
    totalShares,
    availableRefineryAmountToCompound,
    fuelTokensAmount,
    fees,
    userData: {
      isLoading,
      userShares,
      refineryAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  };
};

export const useStakedValue = (
  farmMode: IPoolFarmingMode,
  pool: Pool,
): {
  hasStakedValue: boolean;
  stakedValue: BigNumber;
} => {
  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();

  const { userData } = pool;

  const hasStakedValue = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      return userShares ? userShares.gt(0) : false;
    }
    const stakedBalance = toBigNumber(userData?.stakedBalance);
    return stakedBalance.gt(0);
  }, [farmMode, userData?.stakedBalance, userShares]);

  const stakedValue = useMemo(() => getStakedValue(farmMode, pool, userShares, pricePerFullShare), [
    farmMode,
    pool,
    pricePerFullShare,
    userShares,
  ]);

  return {
    hasStakedValue,
    stakedValue,
  };
};
