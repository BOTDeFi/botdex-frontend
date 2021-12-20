import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { Contract } from 'web3-eth-contract';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { pools as poolsConfig, tokens } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { metamaskService } from '@/services/MetamaskConnect';
import { getAddress, getContract, getContractAddress } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { IReceipt } from '@/types';
import { MAX_UINT_256 } from '@/utils/constants';
import { clogError } from '@/utils/logger';

import useLastUpdated from '../useLastUpdated';

const gasOptions = { gas: 300000 };

export const useApprovePool = (lpContract: Contract, poolId: number) => {
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { callWithGasPrice } = useCallWithGasPrice();
  const { user, pools: poolsStore } = useMst();
  const foundPool = poolsConfig.find((pool) => pool.id === poolId);
  if (!foundPool) throw new Error('Specify the correct poolId');
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const tx = await callWithGasPrice({
        contract: lpContract,
        methodName: 'approve',
        methodArgs: [smartRefinerInitContract.options.address, MAX_UINT_256],
        options: gasOptions,
      });

      poolsStore.updateUserAllowance(poolId, user.address);
      if ((tx as IReceipt).status) {
        successNotification(
          'Contract Enabled!',
          `You can now stake in the ${foundPool.earningToken.symbol} pool!`,
        );
      } else {
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      }
      setRequestedApproval(false);
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    }
  }, [
    callWithGasPrice,
    lpContract,
    poolId,
    poolsStore,
    smartRefinerInitContract,
    user.address,
    foundPool.earningToken.symbol,
  ]);

  return { handleApprove, requestedApproval };
};

// Approve RP1 auto pool
export const useVaultApprove = (setLastUpdated: () => void) => {
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { callWithGasPrice } = useCallWithGasPrice();

  const rocketPropellantContract = getContract('RP1');
  const vaultAddress = getContractAddress('REFINERY_VAULT');

  const handleApprove = async () => {
    const tx = await callWithGasPrice({
      contract: rocketPropellantContract,
      methodName: 'approve',
      methodArgs: [vaultAddress, MAX_UINT_256],
      options: gasOptions,
    });
    setRequestedApproval(true);
    if ((tx as IReceipt).status) {
      successNotification(
        'Contract Enabled!',
        `You can now stake in the ${tokens.rp1.symbol} vault!`,
      );
      setLastUpdated();
    } else {
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    }
    setRequestedApproval(false);
  };

  return { handleApprove, requestedApproval };
};

export const useCheckVaultApprovalStatus = () => {
  const [isVaultApproved, setIsVaultApproved] = useState(false);
  const { user } = useMst();
  const rocketPropellantContract = getContract('RP1');
  const vaultAddress = getContractAddress('REFINERY_VAULT');
  const { lastUpdated, setLastUpdated } = useLastUpdated();
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await rocketPropellantContract.methods
          .allowance(user.address, vaultAddress)
          .call();
        const currentAllowance = new BigNumber(response.toString());
        setIsVaultApproved(currentAllowance.gt(0));
      } catch (error) {
        setIsVaultApproved(false);
      }
    };

    checkApprovalStatus();
  }, [user.address, vaultAddress, lastUpdated, rocketPropellantContract.methods]);

  return { isVaultApproved, setLastUpdated };
};
