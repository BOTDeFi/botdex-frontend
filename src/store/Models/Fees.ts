import { types } from 'mobx-state-tree';

const FeesModel = types.model({
  performanceFee: types.optional(types.maybeNull(types.number), null),
  callFee: types.optional(types.maybeNull(types.number), null),
  withdrawalFee: types.optional(types.maybeNull(types.number), null),
  withdrawalFeePeriod: types.optional(types.maybeNull(types.number), null),
});

export default FeesModel;
