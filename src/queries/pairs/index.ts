import { gql } from '@apollo/client';

export const GET_PAIR_INFO_BY_DATA = gql`
  query GetPairsInfoByData($time: Int, $orderBy: String, $orderDir: String, $pairId: String) {
    pairHourDatas(
      first: $time
      orderBy: $orderBy
      orderDirection: $orderDir
      where: { pair: $pairId }
    ) {
      id
      timestamp: hourStartUnix
      reserve0
      reserve1
    }
  }
`;

export const GET_PAIR_INFO_BY_DAY = gql`
  query GetPairsInfoByDay($time: Int, $orderBy: String, $orderDir: String, $pairId: String) {
    pairDayDatas(
      first: $time
      orderBy: $orderBy
      orderDirection: $orderDir
      where: { pairAddress: $pairId }
    ) {
      id
      timestamp: date
      reserve0
      reserve1
    }
  }
`;

export const GET_PAIRS = gql`
  query GetPairs($pairId: String) {
    pairs(where: { id: $pairId }) {
      id
      name
      token0 {
        id
        name
        symbol
        derivedUSD
      }
      token1 {
        id
        name
        symbol
        derivedUSD
      }
    }
  }
`;
