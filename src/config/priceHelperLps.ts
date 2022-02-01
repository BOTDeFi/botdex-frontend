import { FarmConfig } from '@/types';
//
// import { tokens } from './tokens';

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  // {
  //   pid: -1,
  //   lpSymbol: 'QSD-BNB LP',
  //   lpAddresses: {
  //     97: '0x7b3ae32eE8C532016f3E31C8941D937c59e055B9',
  //   },
  //   token: tokens.qsd,
  //   quoteToken: tokens.wbnb,
  //   categoryType: 'core',
  // },
  // {
  //   pid: -1,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '0x112Dc48d876F4179627F0A29a016E6F130b07E7E',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.wbnb,
  //   categoryType: 'core',
  // },
];

export default priceHelperLps;
