import { types } from 'mobx-state-tree';

/* eslint-disable no-param-reassign */
const UserModel = types
  .model({
    address: types.optional(types.string, ''),
  })
  .actions((self) => {
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const disconnect = () => {
      self.address = '';
      localStorage.refFinanceMetamask = false;
    };

    return {
      setAddress,
      disconnect,
    };
  });

/* eslint-disable no-param-reassign */
export default UserModel;
