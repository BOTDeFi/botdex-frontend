import { useCallback } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { Contract } from 'web3-eth-contract';

import { useCallWithGasPrice } from '@/services/web3/hooks';
import { DEFAULT_TOKEN_DECIMAL } from '@/utils/constants';

export const useStakeFarm = (masterRefinerContract: Contract): any => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const stakeFarm = useCallback(
    async (pid: number, amount: any) => {
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toFixed();
      if (pid === 0) {
        const tx = await callWithGasPrice({
          contract: masterRefinerContract,
          methodName: 'enterStaking',
          methodArgs: [value],
          options: {
            gas: 300000,
          },
        });
        return tx.status;
      }

      const tx = await callWithGasPrice({
        contract: masterRefinerContract,
        methodName: 'deposit',
        methodArgs: [pid, value],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    },
    [callWithGasPrice, masterRefinerContract],
  );

  return { stakeFarm };
};
