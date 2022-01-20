import { useCallback } from 'react';

import { useMst } from '@/store';

export const useUpdateView = (): any => {
  const { pools: poolsStore, user } = useMst();
  const updateViewByFetchingBlockchainData = useCallback(() => {
    poolsStore.fetchVaultPublicData();
    poolsStore.fetchVaultUserData(user.address);
    poolsStore.fetchPoolsPublicDataAsync();
  }, [poolsStore, user.address]);
  return { updateViewByFetchingBlockchainData };
};
