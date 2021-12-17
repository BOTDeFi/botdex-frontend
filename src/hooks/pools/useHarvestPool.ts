import { useCallback } from 'react';
import { Contract } from 'web3-eth-contract';

// import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as SmartRefinerInitializableAbi } from '@/config/abi';
import { useHarvestFarm } from '@/hooks/farms/useHarvestFarm';
import { metamaskService } from '@/services/MetamaskConnect';
import { getAddress } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';

const useHarvestPoolDeposit = (smartRefinerInitContract: Contract) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const harvestPool = useCallback(async () => {
    const tx = await callWithGasPrice({
      contract: smartRefinerInitContract,
      methodName: 'deposit',
      methodArgs: ['0'],
      options: {
        gas: 300000,
      },
    });
    return tx.status;
  }, [callWithGasPrice, smartRefinerInitContract]);

  return { harvestPool };
};

const useHarvestPool = (poolId: number) => {
  const { user, pools } = useMst();

  const [foundPool] = poolsConfig.filter((pool) => pool.id === poolId);
  const smartRefinerInitContract = metamaskService.getContract(
    getAddress(foundPool.contractAddress),
    SmartRefinerInitializableAbi,
  );
  const { harvestPool } = useHarvestPoolDeposit(smartRefinerInitContract);
  const { harvestFarm } = useHarvestFarm(0);

  const handleHarvest = useCallback(async () => {
    if (poolId === 0) {
      await harvestFarm();
    } else {
      await harvestPool();
    }
    pools.updateUserPendingReward(poolId, user.address);
    pools.updateUserBalance(poolId, user.address);
  }, [harvestFarm, harvestPool, poolId, pools, user.address]);

  return { onReward: handleHarvest };
};

export default useHarvestPool;
