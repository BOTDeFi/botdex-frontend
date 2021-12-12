import BigNumber from 'bignumber.js/bignumber';

import { BLOCKS_PER_YEAR, RP1_PER_YEAR } from '@/config';
/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new RP1 allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number | null => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(tokenPerBlock)
    .times(BLOCKS_PER_YEAR);
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked);
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
};

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param refineryPriceUsd Refinery price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  refineryPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  // farmAddress: string,
): { refineryRewardsApr: number; lpRewardsApr: number } => {
  const yearlyRefineryRewardAllocation = RP1_PER_YEAR.times(poolWeight);
  const refineryRewardsApr = yearlyRefineryRewardAllocation
    .times(refineryPriceUsd)
    .div(poolLiquidityUsd)
    .times(100);
  let refineryRewardsAprAsNumber = 0;
  if (!refineryRewardsApr.isNaN() && refineryRewardsApr.isFinite()) {
    refineryRewardsAprAsNumber = refineryRewardsApr.toNumber();
  }
  // TODO: @see https://github.com/pancakeswap/pancake-frontend/pull/1564
  //       There using some Github Action script to update APR's via Graphql on TheGraph
  // const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0;
  const lpRewardsApr = 0;
  return { refineryRewardsApr: refineryRewardsAprAsNumber, lpRewardsApr };
};
