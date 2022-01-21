import { GET_PAIR_INFO_BY_DATA, GET_PAIR_INFO_BY_DAY, GET_PAIRS } from '@/queries';
import { apolloClient, getExchangeContext } from '@/services/apolloClient';

type TPairResponseType = {
  id: string;
  name: string;
  token0: {
    name: string;
    decimals: string;
  };
  token1: {
    name: string;
    decimals: string;
  };
};

interface IGetPairsResponse {
  pairs: Array<TPairResponseType>;
}

export const useGetPair = () => {
  return (pairId: string): any => {
    return apolloClient
      .query<IGetPairsResponse>({
        ...getExchangeContext,
        query: GET_PAIRS,
        variables: {
          pairId,
        },
      })
      .then((response) => response.data);
  };
};

interface IGetHoursPairsResponse {
  pairHourDatas: Array<any>;
}

/**
 * @param {number} time - count of hours which will be included
 * @param {string} pairId - id of the pair
 * @param {string} orderBy - order of the data
 * @param {asc | desc} orderDir - sort type
 * @returns
 */
export const useGetHoursPairs = (orderBy = 'hourStartUnix', orderDir = 'desc') => {
  return (time: number, pairId: string): any => {
    return apolloClient
      .query<IGetHoursPairsResponse>({
        ...getExchangeContext,
        query: GET_PAIR_INFO_BY_DATA,
        variables: {
          time,
          orderBy,
          orderDir,
          pairId,
        },
      })
      .then((response) => response.data);
  };
};

interface IGetDaysPairsResponse {
  pairDayDatas: Array<any>;
}

/**
 * @param {number} time - count of hours which will be included
 * @param {string} pairId - id of the pair
 * @param {string} orderBy - order of the data
 * @param {asc | desc} orderDir - sort type
 * @returns
 */
export const useGetDaysPairs = (orderBy = 'date', orderDir = 'desc') => {
  return (time: number, pairId: string): any => {
    return apolloClient
      .query<IGetDaysPairsResponse>({
        ...getExchangeContext,
        query: GET_PAIR_INFO_BY_DAY,
        variables: {
          time,
          orderBy,
          orderDir,
          pairId,
        },
      })
      .then((response) => response.data);
  };
};
