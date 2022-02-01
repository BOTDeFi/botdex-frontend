import { useEffect } from 'react';

import { farms as farmsConfig } from '@/config/farms';
import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';
import { Farm } from '@/types';
import { toBigNumber } from '@/utils';

export const useFarms = (): { farms: Farm[] } => {
  const { farms } = useMst();
  return { farms: farms.data.slice() as Farm[] };
};

export const usePollFarmsData = (): any => {
  const { slowRefresh } = useRefresh();
  const { user, farms: farmsStore } = useMst();

  useEffect(() => {
    // const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);

    farmsStore.fetchFarmsPublicDataAsync(pids);

    if (user.address) {
      farmsStore.fetchFarmUserDataAsync(user.address, pids);
    }
  }, [farmsStore, user.address, slowRefresh]);
};

export const useFarmUserData = (farm: Farm): any => {
  return {
    allowance: toBigNumber(farm.userData?.allowance),
    tokenBalance: toBigNumber(farm.userData?.tokenBalance),
    stakedBalance: toBigNumber(farm.userData?.stakedBalance),
    earnings: toBigNumber(farm.userData?.earnings),
  };
};
