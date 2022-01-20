import { FarmConfig } from '@/types';

import { contracts } from './contracts';
import { tokens } from './tokens';

export const farms: FarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'RP1',
  //   lpAddresses: {
  //     97: contracts.RP1.ADDRESS,
  //   },
  //   token: tokens.fuel,
  //   quoteToken: tokens.wbnb, // ??
  //   categoryType: 'core',
  // },
  {
    pid: 0,
    lpSymbol: 'BOT',
    lpAddresses: {
      97: contracts.BOT.ADDRESS,
    },
    token: tokens.fuel,
    quoteToken: tokens.wbnb, // ??
    categoryType: 'core',
  },
  {
    pid: 1,
    lpSymbol: 'DAI-WBNB LP',
    lpAddresses: {
      97: '0x92e999CCB3A368678422e5814ABdD177700ccf93',
    },
    token: tokens.dai,
    quoteToken: tokens.wbnb,
    categoryType: 'core',
  },
  // {
  //   pid: 2,
  //   lpSymbol: 'UGBG-AVOOG LP',
  //   lpAddresses: {
  //     97: '0xc11425B023aF7AD46d16e880BFB56de9c6f16DA5',
  //   },
  //   token: tokens.ugbg,
  //   quoteToken: tokens.avoog,
  //   categoryType: 'core',
  // },
];
