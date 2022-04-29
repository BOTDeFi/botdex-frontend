import BigNumber from 'bignumber.js/bignumber';

import { useGetPairsWithVolume } from '@/services/api/refinery-finance-pairs';

type TGetApr = (pairId: string) => number | null;

const timeDistance = 7 * 24 * 60 * 60;
const LP_HOLDERS_FEE = 0.17;
const WEEKS_IN_A_YEAR = 52.1429;

export const useGetApr: TGetApr = (pairId) => {
  let apr: number | null = null;
  const fetchApr = useGetPairsWithVolume();

  const getPairVolumeAndReserve = async (prId: string) => {
    const pairData = await fetchApr(prId);
    return pairData.pairDayDatas;
  };

  const calcApr = async (prId: string) => {
    const daysData = await getPairVolumeAndReserve(prId);
    if (daysData.length > 1) {
      const nearest = daysData[0];
      // eslint-disable-next-line no-confusing-arrow
      const weekAgo = daysData.reduce((acc, val, key) => {
        return Math.abs(new BigNumber(val.date).minus(nearest.date - timeDistance).toNumber()) <=
          Math.abs(new BigNumber(acc.date).minus(nearest.date - timeDistance).toNumber()) &&
          key !== 0
          ? val
          : acc;
      }, daysData[daysData.length - 1]);
      const volume7d = new BigNumber(nearest.dailyVolumeUSD).minus(weekAgo.dailyVolumeUSD);
      const lpFees7d = volume7d.times(LP_HOLDERS_FEE);
      const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR);
      if (lpFeesInAYear.gt(0)) {
        const liquidity = new BigNumber(nearest.reserveUSD);
        apr = lpFeesInAYear.times(100).dividedBy(liquidity).decimalPlaces(2).toNumber();
      }
    }
  };

  if (!apr && apr !== 0) {
    calcApr(pairId);
  }

  return apr;
};
