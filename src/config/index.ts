import BigNumber from 'bignumber.js/bignumber';

export { contracts } from './contracts';
export { tokens } from './tokens';
export { pools } from './pools';
export { farms } from './farms';

export const SHOW_LOGS = true;
export const IS_PRODUCTION = false;

export enum GAS_PRICE_ETHERS {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10',
}

export const BSC_BLOCK_TIME = 3;
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365); // 10512000

export const SCANNERS: Record<number, string> = {
  0x2a: 'https://kovan.etherscan.io',
};
// RP1_PER_BLOCK details
// 40 RP1 is minted per block
// 20 RP1 per block is sent to Burn pool (A farm just for burning RP1)
// 10 RP1 per block goes to RP1 syrup pool
// 9 RP1 per block goes to Yield farms and lottery
// RP1_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 17 (40 - Amount sent to burn pool)
export const RP1_PER_BLOCK = new BigNumber(40);
export const RP1_PER_YEAR = RP1_PER_BLOCK.times(BLOCKS_PER_YEAR);
