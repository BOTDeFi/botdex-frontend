import { GET_PAIRS_DATA_WITH_VOLUME } from '@/queries';
import { IGetDaysPairsResponse } from '@/services/api/refinery-finance-pairs/useGetPairs';
import { apolloClient, getExchangeContext } from '@/services/apolloClient';

type PairData = {
  reserveUSD: string;
  dailyVolumeUSD: string;
  date: number;
};

export const useGetPairsWithVolume = (orderBy = 'date', orderDir = 'desc') => {
  return async (pairId: string): Promise<IGetDaysPairsResponse<PairData>> => {
    const response = await apolloClient
      .query<IGetDaysPairsResponse<PairData>>({
        ...getExchangeContext,
        query: GET_PAIRS_DATA_WITH_VOLUME,
        variables: {
          orderBy,
          orderDir,
          pairId,
        },
      })
      .then((res) => res.data);
    return response;
  };
};
