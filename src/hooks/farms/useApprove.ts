import { useCallback } from 'react';
import { Contract } from 'web3-eth-contract';

import { getContractAddress } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { MAX_UINT_256 } from '@/utils/constants';
import { clogError } from '@/utils/logger';

const masterRefinerContractAddress = getContractAddress('MASTER_REFINER');
const gasOptions = { gas: 300000 };

const useApproveFarm = (lpContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const handleApprove = useCallback(async () => {
    try {
      const tx = await callWithGasPrice({
        contract: lpContract,
        methodName: 'approve',
        methodArgs: [masterRefinerContractAddress, MAX_UINT_256],
        options: gasOptions,
      });

      return tx.status;
    } catch (error) {
      clogError('Approve error', error);
      return false;
    }
  }, [lpContract, callWithGasPrice]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;
