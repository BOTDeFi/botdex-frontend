import { types } from 'mobx-state-tree';

const RoiOptionsModel = types.model({
  isFarmPage: types.boolean,
  apr: types.number,
  // tokenPrice: types.number,
  earningTokenPrice: types.number,
  earningTokenSymbol: types.string,

  stakingTokenBalance: types.string,
  stakingTokenPrice: types.number,
  stakingTokenSymbol: types.string,

  autoCompoundFrequency: types.number,
  performanceFee: types.number,
});

export default RoiOptionsModel;
