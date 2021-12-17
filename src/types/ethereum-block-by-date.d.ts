/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable */

declare module 'ethereum-block-by-date' {
  import Web3, { Eth } from 'web3';

  export default class EthereumBlockByDate {
    constructor(web3: Web3 | Eth): typeof EthereumBlockByDate;

    async getBoundaries() {}

    /**
     *
     * @param date
     * @param after
     * @returns Returns an object:
     * ```
     * {
     *    date: '2016-07-20T13:20:40Z', // searched date
     *    block: 1920000, // found block number
     *    timestamp: 1469020840 // found block timestamp
     * }
     * ```
     */
    async getDate(
      date,
      after = true,
    ): {
      date: string;
      block: number;
      timestamp: number;
    } {}

    async getEvery(duration, start, end, every = 1, after = true) {}

    async findBetter(date, predictedBlock, after, blockTime = this.blockTime) {}

    async isBetterBlock(date, predictedBlock, after) {}

    getNextBlock(date, currentBlock, skip) {}

    returnWrapper(date, block) {}

    async getBlockWrapper(block) {}
  }
}
