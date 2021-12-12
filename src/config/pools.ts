import { tokens } from '@/config/tokens';
import { PoolConfig } from '@/types';

import { contracts } from './contracts';

export const pools: PoolConfig[] = [
  {
    id: 0,
    stakingToken: tokens.rp1,
    earningToken: tokens.rp1,
    contractAddress: {
      42: contracts.MASTER_REFINER.ADDRESS,
    },
    tokenPerBlock: '1',
  },
  {
    id: 1,
    stakingToken: tokens.rp1,
    earningToken: tokens.bbshk,
    contractAddress: {
      42: '0xbf183592ce79efe53b654e9229301b910b075dfb',
    },
    tokenPerBlock: '0.0868',
    // isFinished: true,
  },
  {
    id: 2,
    stakingToken: tokens.rp1,
    earningToken: tokens.avoog,
    contractAddress: {
      42: '0x0a43e268e77cc967b192cc4126a022b0a780b9b0',
    },
    tokenPerBlock: '0.000000001',
  },
  {
    id: 3,
    stakingToken: tokens.rp1,
    earningToken: tokens.avoog,
    contractAddress: {
      42: '0x8123603fb0b3EA661b63D1Ecefcd81ab3b4455d7',
    },
    tokenPerBlock: '1',
  },
  {
    id: 4,
    stakingToken: tokens.rp1,
    earningToken: tokens.avoog,
    contractAddress: {
      42: '0xb60c94a36ce07dc3b8d9869a093a267d80af5353',
    },
    tokenPerBlock: '1',
  },
  {
    id: 5,
    stakingToken: tokens.rp1,
    earningToken: tokens.ugbg,
    contractAddress: {
      42: '0xc09af4d38d6438ddac52963cf66cf34aeffde5a8',
    },
    tokenPerBlock: '1',
  },
  {
    id: 6,
    stakingToken: tokens.rp1,
    earningToken: tokens.ugbg,
    contractAddress: {
      42: '0x874993122d979fc1be14d8b1154ee4ee638e322f',
    },
    tokenPerBlock: '0.000000001',
  },
];
