import { GET_ALL_PAIRS, GET_TOKEN_PAIRS } from '@/queries';
import { apolloClient, getExchangeContext } from '@/services/apolloClient';

export const useGetAllPairs = () => {
  return async (): Promise<any> => {
    return apolloClient
      .query<any>({
        ...getExchangeContext,
        query: GET_ALL_PAIRS,
      })
      .then((res) => res.data);
  };
};

export const useGetTokenPairs = () => {
  return async (tokenAddress: string): Promise<any> => {
    return apolloClient
      .query<any>({
        ...getExchangeContext,
        query: GET_TOKEN_PAIRS,
        variables: {
          tokenAddress,
        },
      })
      .then((res) => res.data);
  };
};
