import { useCallback } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { Contract } from 'web3-eth-contract';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { useStakeFarm } from '@/hooks/farms/useStakeFarm';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { BIG_TEN } from '@/utils/constants';
import { clogError } from '@/utils/logger';

export const useSmartRefinerStake = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();

  const smartRefinerStake = useCallback(
    async (amount: string, decimals = 18) => {
      const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed();
      const tx = await callWithGasPrice({
        contract: smartRefinerInitContract,
        methodName: 'deposit',
        methodArgs: [value],
        options: {
          gas: 300000,
        },
      });
      return tx.status;
    },
    [callWithGasPrice, smartRefinerInitContract],
  );

  return { smartRefinerStake };
};

const useStakePool = (poolId: number) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { smartRefinerStake } = useSmartRefinerStake(smartRefinerInitContract);
  // const { harvestPool } = useHarvestPoolDeposit(smartRefinerInitContract);

  const masterRefinerContract = getContract('MASTER_REFINER');
  const { stakeFarm } = useStakeFarm(masterRefinerContract);
  // const { harvestFarm } = useHarvestFarm(masterRefinerContract, 0);

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (poolId === 0) {
        await stakeFarm(0, amount);
      } else {
        await smartRefinerStake(amount, decimals);
      }
      pools.updateUserStakedBalance(poolId, user.address);
      pools.updateUserBalance(poolId, user.address);
    },
    [poolId, pools, user.address, smartRefinerStake, stakeFarm],
  );

  return { onStake: handleStake };
};

export default useStakePool;

export const useNonVaultStake = (poolId: number, onFinally: () => void) => {
  const { onStake } = useStakePool(poolId);

  const nonVaultStake = useCallback(
    async (valueToStake: string, stakingTokenDecimals: number, stakingTokenSymbol = '') => {
      try {
        await onStake(valueToStake, stakingTokenDecimals);
        successNotification(
          'Staked!',
          `Your ${stakingTokenSymbol} funds have been staked in the pool!`,
        );
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
    [onStake, onFinally],
  );

  return { nonVaultStake };
};
