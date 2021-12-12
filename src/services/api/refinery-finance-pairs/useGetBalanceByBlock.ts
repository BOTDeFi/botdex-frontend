import { gql } from '@apollo/client';

import { apolloClient, getRfPairsContext } from '@/services/apolloClient';
import { Awaited } from '@/types';

export const GET_BALANCE_BY_BLOCK = gql`
  query GetBalanceOnBlock($user_address: String!, $block_number: BigInt!) {
    balanceHistories(
      first: 1
      orderBy: BlockNumber
      orderDirection: desc
      where: { BlockNumber_lte: $block_number, User: $user_address }
    ) {
      TotalBalance
      BlockNumber
      User {
        id
        TotalBalance
      }
    }
  }
`;
// /**
//  * Get user balance by userAddress and block (snapshot).
//  */
// export const useGetBalanceByBlock = (
//   options?: UseLazyQueryOptions,
// ): {
//   getBalanceByBlock: (userAddress: string, block: number | string) => void;
//   options: ReturnType<typeof useLazyQuery>;
// } => {
//   const [func, responseData] = useLazyQuery(GET_BALANCE_BY_BLOCK, options);

//   const getBalanceByBlock = useCallback(
//     (userAddress: string, block: number | string) => {
//       func({
//         ...getRfPairsContext(),
//         variables: {
//           user_address: userAddress,
//           block_number: block,
//         },
//       });
//     },
//     [func],
//   );

//   return { getBalanceByBlock, options: [func, responseData] };
// };

interface IUserBalance {
  id: string;
  TotalBalance: string;
}

interface IFetchUserBalanceByBlockResponse {
  balanceHistories: Array<{
    BlockNumber: string;
    TotalBalance: string;
    User: IUserBalance;
  }>;
}

export const fetchUserBalanceByBlock = (userAddress: string, block: number) => {
  return apolloClient.query<IFetchUserBalanceByBlockResponse>({
    ...getRfPairsContext(),
    query: GET_BALANCE_BY_BLOCK,
    variables: {
      user_address: userAddress,
      block_number: block,
    },
  });
};

export const fetchUserBalancesByBlock = async (
  addresses: string[],
  blocks: (number | string | null)[],
) => {
  const promises = addresses.map((address, index) => {
    // .toLowerCase() to prevent TheGraph's errors (it returns nothing when address is not in lowerCase)
    if (!blocks[index]) return Promise.resolve(null);
    return fetchUserBalanceByBlock(address.toLowerCase(), Number(blocks[index]));
  });

  const results = await Promise.allSettled(promises);

  return results;
};

// export const selectUserBalancesByBlock = (
//   results: Awaited<ReturnType<typeof fetchUserBalancesByBlock>>,
// ) => {
//   return results.map((item) => {
//     if (item.status !== 'fulfilled') return item;
//     const { value } = item;
//     if (value === null || value.data) return null;
//     return value.data.balanceHistories[0];
//   });
// };
export const selectTotalUserBalancesByBlock = (
  results: Awaited<ReturnType<typeof fetchUserBalancesByBlock>>,
): IUserBalance[] => {
  return results
    .map((item) => {
      if (item.status !== 'fulfilled') return undefined;
      const { value } = item;
      if (!value) return null;
      const [userData] = value.data.balanceHistories;
      return userData ? userData.User : null;
    })
    .filter((item) => {
      if (item) return true;
      return false;
    }) as IUserBalance[];
};
