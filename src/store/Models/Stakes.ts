import { types } from 'mobx-state-tree';

const UserDataModel = types.model({
  amount: types.number,
  start: types.number,
});

const StakeModel = types.model({
  id: types.number,
  amountStaked: types.number,
  timeLockUp: types.number,
  APY: types.number,
  isDead: types.boolean,
  userData: types.optional(UserDataModel, {
    amount: 0,
    start: 0,
  }),
});

const StakesModel = types
  .model({
    data: types.array(StakeModel),
    length: types.optional(types.number, 0),
  })
  .actions((self) => ({
    getStakesData() {

    },
  }));

export default StakesModel;
