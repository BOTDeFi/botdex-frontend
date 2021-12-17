import BigNumber from 'bignumber.js/bignumber';
import { types } from 'mobx-state-tree';

import { getBlockNumber } from '@/services/web3/helpers';

const DaoModel = types
  .model({
    blockNumber: types.string,
  })
  .views((self) => ({
    get blockNumberAsBN() {
      return new BigNumber(self.blockNumber);
    },
    get blockNumberAsNumber() {
      return Number(self.blockNumber);
    },
  }))
  .actions((self) => ({
    setBlockNumber(blockNumber: BigNumber) {
      self.blockNumber = blockNumber.toFixed();
    },
    async getBlockNumberAsync() {
      const blockNumber = await getBlockNumber();
      this.setBlockNumber(new BigNumber(blockNumber));
      return blockNumber;
    },
  }));
export default DaoModel;
