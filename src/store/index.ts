import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { clogData } from '@/utils/logger';

import { initialState as roiInitialState } from './Models/Modals/RoiModal';
import { DaoModel, FarmsModel, ModalsModel, PoolsModel, TokensModel, UserModel } from './Models';

const RootModel = types.model({
  user: UserModel,
  modals: ModalsModel,
  tokens: TokensModel,
  pools: PoolsModel,
  farms: FarmsModel,
  dao: DaoModel,
});
export const Store = RootModel.create({
  user: {
    address: '',
  },
  modals: {
    metamaskErr: {
      errMsg: '',
    },
    roi: {
      state: roiInitialState,
    },
    stakeUnstake: {
      isOpen: false,
      isStaking: true,
      isAutoVault: false,
      poolId: 0,
    },
    poolsCollect: {
      isOpen: false,
    },
    farmsStakeUnstake: {
      isOpen: false,
      farmId: 0,
      isStaking: false,
      maxValue: '',
      lpPrice: '',
      tokenSymbol: '',
      addLiquidityUrl: '',
    },
  },
  tokens: {
    default: [],
    top: [],
    extended: [],
    imported: [],
  },
  pools: {
    userData: {
      isLoading: true,
    },
    fees: {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    },
  },
  farms: {
    // data: [],
  },
  dao: {
    blockNumber: '0',
  },
});

const rootStore = Store;

onSnapshot(rootStore, (snapshot) => {
  clogData('Snapshot: ', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const { Provider } = RootStoreContext;

export function useMst(): RootInstance {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export default rootStore;
