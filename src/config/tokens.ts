import { Token } from '@/types';

import { contracts } from './contracts';

const NO_LOGO = 'https://kovan.etherscan.io/images/main/empty-token.png';

export const tokens: Record<
  'tst' | 'rp1' | 'fuel' | 'wbnb' | 'tmpt' | 'bbshk' | 'busd' | 'mana' | 'avoog' | 'ugbg',
  Token
> = {
  tst: {
    symbol: 'TST',
    address: {
      42: '0x75ad1de90e9d95fcc26e16e332d2f2c5fca24691',
      // 56: '0xf750a26eb0acf95556e8529e72ed530f3b60f348',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  rp1: {
    symbol: 'RP1',
    address: {
      42: contracts.RP1.ADDRESS,
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  fuel: {
    symbol: 'FUEL',
    address: {
      42: '0xe192A4cc48aC919d63EF2C13B546B5c6e13314f2',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  wbnb: {
    symbol: 'WBNB',
    address: {
      42: '0x4aff3e144ce07342be999ba093948dfd58b1a0a9',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  tmpt: {
    symbol: 'TMPT',
    address: {
      42: '0x19cd26a630c890b886034077701998551ce09aa6',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  bbshk: {
    symbol: 'BBSHK',
    address: {
      42: '0xF1776D2e185151FC178ecd9D9E8304eBB0922e7b',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  busd: {
    symbol: 'BUSD',
    address: {
      42: '0x5a9221ac897ef8a9cb77e61f9c1beafe00440169',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  mana: {
    symbol: 'MANA',
    address: {
      42: '0x738dc6380157429e957d223e6333dc385c85fec7',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  avoog: {
    symbol: 'AVOOG',
    address: {
      42: '0x7118afa5c6cbab828f0d9a529c62e89d282df9e4',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
  ugbg: {
    symbol: 'UGBG',
    address: {
      42: '0x426EBD1856E8dB98c3E1e79262a6615f9F6c61a0',
    },
    decimals: 18,
    projectLink: 'https://www.example.com/',
    logoURI: NO_LOGO,
  },
};
