import { Instance, types } from 'mobx-state-tree';

const PoolsCollectOptions = types.model({
  poolId: types.identifierNumber,
  earnings: types.string,
  farmMode: types.string,
  earningTokenSymbol: types.string,
  fullBalance: types.string,
  earningTokenDecimals: types.number,
});

const PoolsCollectModal = types
  .model({
    options: types.maybeNull(PoolsCollectOptions),
  })
  .views((self) => ({
    get isOpen() {
      return Boolean(self.options);
    },
  }))
  .actions((self) => ({
    close() {
      self.options = null;
    },
    open(options: Instance<typeof PoolsCollectOptions>) {
      self.options = options;
    },
  }));

export default PoolsCollectModal;
