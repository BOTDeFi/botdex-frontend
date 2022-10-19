import { useEffect } from 'react';

import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';
// import { Stake } from '@/types';

export const useStakes = (old: boolean): any => {
  const { fastRefresh } = useRefresh();
  const { stakes: stakeStore, user } = useMst();

  useEffect(() => {
    if (user.address) {
      stakeStore.fetchStakesData(old);
    }
  }, [user.address, stakeStore, fastRefresh]);

  return { stakes: stakeStore };
};
