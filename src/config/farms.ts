import { FarmConfig } from '@/types';

import { contracts, IS_PRODUCTION } from './contracts';
import { tokens } from './tokens';

export const farms: FarmConfig[] = !IS_PRODUCTION
  ? [
      {
        pid: 0,
        lpSymbol: 'BOT',
        lpAddresses: {
          97: contracts.BOT.ADDRESS,
          56: contracts.BOT.ADDRESS,
        },
        token: tokens.fuel,
        quoteToken: tokens.wbnb, // ??
        categoryType: 'core',
      },
      {
        pid: 252,
        lpSymbol: 'BUSD-BNB LP',
        lpAddresses: {
          97: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
          56: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
        },
        token: tokens.busd,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
      {
        pid: 1,
        lpSymbol: 'DAI-WBNB LP',
        lpAddresses: {
          97: '0x92e999CCB3A368678422e5814ABdD177700ccf93',
          56: '0x92e999CCB3A368678422e5814ABdD177700ccf93',
        },
        token: tokens.dai,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
    ]
  : [
      {
        pid: 0,
        lpSymbol: 'BOT',
        lpAddresses: {
          97: contracts.BOT.ADDRESS,
          56: contracts.BOT.ADDRESS,
        },
        token: tokens.bot,
        quoteToken: tokens.bot, // ??
        categoryType: 'core',
      },
      {
        pid: 252,
        lpSymbol: 'BUSD-BNB LP',
        lpAddresses: {
          97: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
          56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
        },
        token: tokens.busd,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
      {
        pid: 1,
        lpSymbol: 'BUSD-BNB LP',
        lpAddresses: {
          97: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
          56: '0x82291BaA88C7d0F042493877BF15d472280Aa7cb',
        },
        token: tokens.busd,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
    ];
