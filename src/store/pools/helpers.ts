import BigNumber from 'bignumber.js/bignumber';

import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { toBigNumber } from '@/utils';
import { BIG_ZERO } from '@/utils/constants';
import {
  getBalanceAmount,
  getBalanceAmountBN,
  getDecimalAmount,
  getFullDisplayBalance,
} from '@/utils/formatters';

type UserData =
  | Pool['userData']
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      pendingReward: number | string;
    };

export const convertSharesToRefinery = (
  shares: BigNumber,
  refineryPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
): {
  refineryAsNumberBalance: number;
  refineryAsBigNumber: BigNumber;
  refineryAsDisplayBalance: string | number;
} => {
  const sharePriceNumber = getBalanceAmountBN(refineryPerFullShare, decimals);
  const amountInRefinery = new BigNumber(shares.multipliedBy(sharePriceNumber));
  const refineryAsBigNumberBalance = getBalanceAmountBN(amountInRefinery, decimals);
  const refineryAsNumberBalance = refineryAsBigNumberBalance.toNumber();
  const refineryAsBigNumber = getDecimalAmount(refineryAsBigNumberBalance, decimals);
  const refineryAsDisplayBalance = getFullDisplayBalance({
    balance: amountInRefinery,
    decimals,
    displayDecimals: decimalsToRound,
  });
  return { refineryAsNumberBalance, refineryAsBigNumber, refineryAsDisplayBalance };
};

export interface IConvertRefineryToSharesResult {
  sharesAsNumberBalance: number;
  sharesAsBigNumber: BigNumber;
  sharesAsDisplayBalance: string | number;
}

export const convertRefineryToShares = (
  refinery: BigNumber,
  refineryPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
): IConvertRefineryToSharesResult => {
  const sharePriceNumber = getBalanceAmount(refineryPerFullShare, decimals);
  const amountInShares = new BigNumber(refinery.dividedBy(sharePriceNumber));
  const sharesAsNumberBalance = getBalanceAmount(amountInShares, decimals);
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals);
  const sharesAsDisplayBalance = getFullDisplayBalance({
    balance: amountInShares,
    decimals,
    displayDecimals: decimalsToRound,
  });
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance };
};

export const transformUserData = (
  userData: UserData,
): {
  allowance: BigNumber;
  stakingTokenBalance: BigNumber;
  stakedBalance: BigNumber;
  pendingReward: BigNumber;
} => {
  return {
    allowance: toBigNumber(userData?.allowance),
    stakingTokenBalance: toBigNumber(userData?.stakingTokenBalance),
    stakedBalance: toBigNumber(userData?.stakedBalance),
    pendingReward: toBigNumber(userData?.pendingReward),
  };
};

export const transformPool = (pool: Pool): Pool => {
  const { totalStaked, stakingLimit, userData, ...rest } = pool;

  return {
    ...rest,
    userData: transformUserData(userData),
    totalStaked: toBigNumber(totalStaked),
    stakingLimit: toBigNumber(stakingLimit),
  } as Pool;
};

export const getRefineryVaultEarnings = (
  accountAddress: string,
  refineryAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
): {
  hasAutoEarnings: boolean;
  autoRefineryToDisplay: number;
  autoRefineryProfit: BigNumber;
} => {
  const hasAutoEarnings =
    Boolean(accountAddress) &&
    refineryAtLastUserAction &&
    refineryAtLastUserAction.gt(0) &&
    userShares &&
    userShares.gt(0);
  const { refineryAsBigNumber } = convertSharesToRefinery(userShares, pricePerFullShare);
  const autoRefineryProfit = refineryAsBigNumber.minus(refineryAtLastUserAction);
  const autoRefineryToDisplay = autoRefineryProfit.gte(0)
    ? getBalanceAmount(autoRefineryProfit, 18)
    : 0;

  // const autoUsdProfit = autoCakeProfit.times(earningTokenPrice);
  // const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoRefineryToDisplay, autoRefineryProfit };
};

export const getStakingBalance = (pool: Pool): BigNumber => {
  const { userData } = pool;
  return toBigNumber(userData?.stakingTokenBalance);
};

export const getStakedValue = (
  farmMode: IPoolFarmingMode,
  pool: Pool,
  userShares: BigNumber | null,
  pricePerFullShare: BigNumber | null,
): BigNumber => {
  if (farmMode === PoolFarmingMode.auto) {
    const { refineryAsBigNumber } = convertSharesToRefinery(
      userShares || BIG_ZERO,
      pricePerFullShare || BIG_ZERO,
    );
    return refineryAsBigNumber;
  }
  const { userData } = pool;
  return toBigNumber(userData?.stakedBalance);
};

export const getFarmMode = (pool: Pool): IPoolFarmingMode => {
  if (pool.isAutoVault) return PoolFarmingMode.auto;
  if (pool.id === 0) return PoolFarmingMode.manual;
  return PoolFarmingMode.earn;
};
