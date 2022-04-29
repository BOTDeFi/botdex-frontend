import { gql } from '@apollo/client';

export const GET_PAIRS_DATA_WITH_VOLUME = gql`
  query GetPairsDataWithVolume($orderBy: String, $orderDir: String, $pairId: String) {
    pairDayDatas(
      first: $time
      orderBy: $orderBy
      orderDirection: $orderDir
      where: { pairAddress: $pairId }
    ) {
      reserveUSD
      dailyVolumeUSD
      date
    }
  }
`;
