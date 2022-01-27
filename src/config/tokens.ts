import { Token } from '@/types';

import { contracts } from './contracts';

import NO_LOGO from '@/assets/img/icons/empty_token.png';

export const tokens: Record<
  'rp1' | 'bot' | 'fuel' | 'dai' | 'wbnb',
  // | 'tmpt'
  // | 'bbshk'
  // | 'busd'
  // | 'mana'
  // | 'avoog'
  // | 'ugbg',
  Token
> = {
  // tst: {
  //   symbol: 'TST',
  //   address: {
  //     97: '0x75ad1de90e9d95fcc26e16e332d2f2c5fca24691',
  //     // 56: '0xf750a26eb0acf95556e8529e72ed530f3b60f348',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  rp1: {
    symbol: 'RP1',
    address: {
      97: contracts.RP1.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  bot: {
    symbol: 'BOT',
    address: {
      97: contracts.BOT.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  fuel: {
    symbol: 'FUEL',
    address: {
      97: '0xe9095E4Fb47f7136ab9e65edb92FAfCe044553d3',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  dai: {
    symbol: 'DAI',
    address: {
      97: '0xA520feb43893Cfa59845cdbBCBDdf4f6f991fbB6',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  wbnb: {
    symbol: 'WBNB',
    address: {
      97: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  // tmpt: {
  //   symbol: 'TMPT',
  //   address: {
  //     97: '0x19cd26a630c890b886034077701998551ce09aa6',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  // bbshk: {
  //   symbol: 'BBSHK',
  //   address: {
  //     97: '0xF1776D2e185151FC178ecd9D9E8304eBB0922e7b',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  // busd: {
  //   symbol: 'BUSD',
  //   address: {
  //     97: '0x5a9221ac897ef8a9cb77e61f9c1beafe00440169',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  // mana: {
  //   symbol: 'MANA',
  //   address: {
  //     97: '0x738dc6380157429e957d223e6333dc385c85fec7',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  // avoog: {
  //   symbol: 'AVOOG',
  //   address: {
  //     97: '0x7118afa5c6cbab828f0d9a529c62e89d282df9e4',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
  // ugbg: {
  //   symbol: 'UGBG',
  //   address: {
  //     97: '0x426EBD1856E8dB98c3E1e79262a6615f9F6c61a0',
  //   },
  //   decimals: 18,
  //   projectLink: 'https://www.example.com/',
  //   logoURI: NO_LOGO,
  // },
};
