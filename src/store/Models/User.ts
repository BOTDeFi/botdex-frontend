import { types } from 'mobx-state-tree';

const UserModel = types
  .model({
    address: types.optional(types.string, ''),
    type: types.optional(types.string, 'from'),
    balance: types.number,
  })
  .actions((self) => {
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const changeType = (type: 'to' | 'from') => {
      self.type = type;
    };
    const setBalance = (value: number) => {
      self.balance = value;
    };
    const disconnect = () => {
      self.address = '';
      self.type = 'from';
      localStorage.refFinanceMetamask = false;
    };

    return {
      setAddress,
      changeType,
      setBalance,
      disconnect,
    };
  });

/* eslint-disable no-param-reassign */
export default UserModel;
