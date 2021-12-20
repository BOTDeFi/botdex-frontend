import { useCallback } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { Contract } from 'web3-eth-contract';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { useUnstakeFarm } from '@/hooks/farms/useUnstakeFarm';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { BIG_TEN } from '@/utils/constants';

const gasOptions = {
  gas: 300000,
};

export const useSmartRefinerUnstake = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const smartRefinerUnstake = useCallback(
    async (amount: string, decimals = 18) => {
      const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed();
      const tx = await callWithGasPrice({
        contract: smartRefinerInitContract,
        methodName: 'withdraw',
        methodArgs: [value],
        options: gasOptions,
      });
      return tx.status;
    },
    [callWithGasPrice, smartRefinerInitContract],
  );

  return { smartRefinerUnstake };
};

const useUnstakePool = (poolId: number) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { smartRefinerUnstake } = useSmartRefinerUnstake(smartRefinerInitContract);

  const masterRefinerContract = getContract('MASTER_REFINER');
  const { unstakeFarm } = useUnstakeFarm(masterRefinerContract);

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (poolId === 0) {
        await unstakeFarm(0, amount);
      } else {
        await smartRefinerUnstake(amount, decimals);
      }
      pools.updateUserStakedBalance(poolId, user.address);
      pools.updateUserBalance(poolId, user.address);
      pools.updateUserPendingReward(poolId, user.address);
    },
    [poolId, pools, user.address, smartRefinerUnstake, unstakeFarm],
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakePool;

export const useNonVaultUnstake = (poolId: number, onFinally: () => void) => {
  const { onUnstake } = useUnstakePool(poolId);

  const nonVaultUnstake = useCallback(
    async (valueToUnstake: string, stakingTokenDecimals: number, stakingTokenSymbol = '') => {
      try {
        await onUnstake(valueToUnstake, stakingTokenDecimals);
        successNotification(
          'Unstaked!',
          `Your ${stakingTokenSymbol} earnings have also been harvested to your wallet!`,
        );
      } catch (e) {
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        onFinally();
      }
    },
    [onUnstake, onFinally],
  );

  return { nonVaultUnstake };
};
