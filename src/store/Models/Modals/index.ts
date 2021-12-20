import { types } from 'mobx-state-tree';

import FarmsStakeUnstakeModal from './FarmsStakeUnstakeModal';
import MetamaskErrModal from './MetamaskErrModal';
import PoolsCollectModal from './PoolsCollectModal';
import RoiModal from './RoiModal';
import StakeUnstakeModal from './StakeUnstakeModal';

const ModalsModel = types.model({
  metamaskErr: MetamaskErrModal,
  roi: RoiModal,
  stakeUnstake: StakeUnstakeModal,
  poolsCollect: PoolsCollectModal,
  farmsStakeUnstake: FarmsStakeUnstakeModal,
});

export default ModalsModel;
