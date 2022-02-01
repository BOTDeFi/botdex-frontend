import { useCallback } from 'react';

import { useUnstakeFarm } from '@/hooks/farms/useUnstakeFarm';
import { getContract } from '@/services/web3/contractHelpers';

const useUnstakeFarms = (pid: number): any => {
  const masterRefineryContract = getContract('MASTER_BOTDEX');
  const { unstakeFarm } = useUnstakeFarm(masterRefineryContract);

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(pid, amount);
    },
    [pid, unstakeFarm],
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;
