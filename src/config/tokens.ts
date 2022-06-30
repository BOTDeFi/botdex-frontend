import NO_LOGO from '@/assets/img/icons/empty_token.png';
import { Token } from '@/types';

import { contracts } from './contracts';

export const tokens: Record<'rp1' | 'bot' | 'fuel' | 'dai' | 'wbnb' | 'usdt' | 'busd', Token> = {
  rp1: {
    symbol: 'RP1',
    address: {
      97: contracts.RP1.ADDRESS,
      56: contracts.RP1.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  bot: {
    symbol: 'BOT',
    address: {
      97: contracts.BOT.ADDRESS,
      56: contracts.BOT.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: 'https://assets.coingecko.com/coins/images/24650/small/McLc4iA.png?1648612075',
  },
  fuel: {
    symbol: 'FUEL',
    address: {
      97: '0xe9095E4Fb47f7136ab9e65edb92FAfCe044553d3',
      56: contracts.BOT.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  dai: {
    symbol: 'DAI',
    address: {
      97: '0xA520feb43893Cfa59845cdbBCBDdf4f6f991fbB6',
      56: '0xA520feb43893Cfa59845cdbBCBDdf4f6f991fbB6',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  wbnb: {
    symbol: 'WBNB',
    address: {
      97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: 'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      97: '0x73E5E470A516Ca9b6bD1D7b3d6719AF4496C65fE',
      56: '0x73E5E470A516Ca9b6bD1D7b3d6719AF4496C65fE',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  busd: {
    symbol: 'BUSD',
    address: {
      97: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      56: '0x55d398326f99059fF775485246999027B3197955',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png?1568947766',
  },
};
