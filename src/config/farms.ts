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
        pid: 7,
        lpSymbol: 'BUSD-BNB LP',
        lpAddresses: {
          97: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
          56: '0x0dfeb5187817a6121B430aB6dC7b55CF41D82f6F',
        },
        token: tokens.busd,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
      {
        pid: 8,
        lpSymbol: 'BOT-BNB LP',
        lpAddresses: {
          97: '0xAf5e8AA68dd1b61376aC4F6fa4D06A5A4AB6cafD',
          56: '0x24A3E89a41b20B739A9B0D632CA55404fAC6D864',
        },
        token: tokens.bot,
        quoteToken: tokens.wbnb,
        categoryType: 'core',
      },
    ];
