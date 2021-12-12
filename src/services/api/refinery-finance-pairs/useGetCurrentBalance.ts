import { useCallback } from 'react';
import { ApolloClient, gql, LazyQueryHookOptions, QueryTuple, useLazyQuery } from '@apollo/client';

import { getRfPairsContext } from '@/services/apolloClient';

interface IGetCurrentBalanceResponse {
  user: {
    TotalBalance: string;
    // __typename: "User"
  } | null;
}

interface IGetCurrentBalanceVariables {
  user_address: string;
}

export const GET_CURRENT_BALANCE = gql`
  query GetCurrentBalance($user_address: String!) {
    user(id: $user_address) {
      TotalBalance
    }
  }
`;

/**
 * Allows to get current user balance to use it for voting power counting purposes.
 */
export const useGetCurrentBalance = (
  options?: LazyQueryHookOptions<IGetCurrentBalanceResponse, IGetCurrentBalanceVariables>,
): {
  getCurrentBalance: (userAddress: string) => void;
  options: QueryTuple<IGetCurrentBalanceResponse, IGetCurrentBalanceVariables>;
} => {
  const [func, responseData] = useLazyQuery<
    IGetCurrentBalanceResponse,
    IGetCurrentBalanceVariables
  >(GET_CURRENT_BALANCE, options);

  const getCurrentBalance = useCallback(
    (userAddress: string) => {
      func({
        ...getRfPairsContext(),
        variables: {
          user_address: userAddress,
        },
      });
    },
    [func],
  );

  return { getCurrentBalance, options: [func, responseData] };
};

export const selectCurrentBalance = (data: IGetCurrentBalanceResponse): string | null => {
  if (!data.user) return null;
  return data.user.TotalBalance;
};

export const hasCurrentBalance = (error: any, data: any): boolean => {
  if (error || !data) return false;
  const balance = selectCurrentBalance(data);
  if (!balance || balance === '0') return false;
  return Boolean(balance);
};

export const requestHasCurrentBalance = async (
  userAddress: string,
  client?: ApolloClient<any>,
): Promise<boolean> => {
  const result = await client?.query({
    query: GET_CURRENT_BALANCE,
    variables: {
      user_address: userAddress,
    },
  });
  if (!result) return false;
  return hasCurrentBalance(result.error, result.data);
};
