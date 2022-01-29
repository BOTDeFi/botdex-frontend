import { types } from 'mobx-state-tree';

import { getStakesData, getStakesLength, getUserData } from '@/store/stakes';

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
  userData: types.optional(types.maybeNull(UserDataModel), {
    amount: 0,
    start: 0,
  }),
});

const StakesModel = types
  .model({
    data: types.array(StakeModel),
  })
  .actions((self) => ({
    setData(data: any) {
      self.data = data;
    },
    setUserData(i: number, data: any) {
      self.data[i].userData = data;
    },
    setAmountStaked(i: number, amount: number) {
      self.data[i].amountStaked = amount;
    },
    async fetchStakesData() {
      const stakesLength = await getStakesLength();
      const data = await getStakesData(stakesLength);
      this.setData(data);
    },
    async fetchUserData(id: number, address: string) {
      const data = await getUserData(id, address);
      this.setUserData(id, data);
    },
  }));

export default StakesModel;
