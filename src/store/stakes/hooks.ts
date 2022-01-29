import { useEffect } from 'react';

import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';
// import { Stake } from '@/types';

export const useStakes = (): any => {
  const { fastRefresh } = useRefresh();
  const { stakes: stakeStore, user } = useMst();

  useEffect(() => {
    if (user.address) {
      stakeStore.fetchStakesData();
    }
  }, [user.address, stakeStore, fastRefresh]);

  return { stakes: stakeStore };
};
