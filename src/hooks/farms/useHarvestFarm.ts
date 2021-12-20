import { useCallback } from 'react';

import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';

export const useHarvestFarm = (pid: number) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const masterRefinerContract = getContract('MASTER_REFINER');

  const harvestFarm = useCallback(async () => {
    if (pid === 0) {
      const tx = await callWithGasPrice({
        contract: masterRefinerContract,
        methodName: 'leaveStaking',
        methodArgs: ['0'],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    }

    const tx = await callWithGasPrice({
      contract: masterRefinerContract,
      methodName: 'deposit',
      methodArgs: [pid, '0'],
      options: {
        gas: 300000,
      },
    });
    return tx.status;
  }, [callWithGasPrice, masterRefinerContract, pid]);

  return { harvestFarm };
};
