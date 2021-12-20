import { useCallback } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { clog, clogError } from '@/utils/logger';

import { useUpdateView } from './useUpdateView';

const gasOptions = { gas: 380000 };

export const useVaultStake = (onFinally: () => void) => {
  const { updateViewByFetchingBlockchainData } = useUpdateView();
  const { callWithGasPrice } = useCallWithGasPrice();

  const refineryVaultContract = getContract('REFINERY_VAULT');

  const vaultStake = useCallback(
    async (valueToStakeDecimal: BigNumber) => {
      clog('STAKING AUTO ', valueToStakeDecimal.toFixed());
      try {
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'deposit',
          methodArgs: [valueToStakeDecimal.toFixed()],
          options: gasOptions,
        });
        if (tx.status) {
          successNotification('Staked!', 'Your funds have been staked in the pool');
          updateViewByFetchingBlockchainData();
        }
      } catch (error) {
        clogError(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        onFinally();
      }
    },
    [refineryVaultContract, callWithGasPrice, updateViewByFetchingBlockchainData, onFinally],
  );

  return { vaultStake };
};
