import BigNumber from 'bignumber.js/bignumber';

// import { convertSharesToRefinery } from './helpers';
import { pools as poolsConfig } from '@/config';
import { SmartRefinerInitializable as smartRefinerInitializableAbi } from '@/config/abi';
import { metamaskService } from '@/services/MetamaskConnect';
import { getAddress, getContract, getContractData } from '@/services/web3/contractHelpers';
import { BIG_ZERO } from '@/utils/constants';
import { multicall } from '@/utils/multicall';

export const fetchPoolsBlockLimits = async (): Promise<
  {
    id: number;
    startBlock: number;
    endBlock: number;
  }[]
> => {
  const poolsWithEnd = poolsConfig.filter((pool) => pool.id !== 0);
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    };
  });
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    };
  });

  const [, abi] = getContractData('SMART_REFINER_INITIALIZABLE');

  const starts = await multicall(abi, callsStartBlock);
  const ends = await multicall(abi, callsEndBlock);

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index];
    const endBlock = ends[index];
    return {
      id: cakePoolConfig.id,
      startBlock: new BigNumber(startBlock).toNumber(),
      endBlock: new BigNumber(endBlock).toNumber(),
    };
  });
};

export const fetchPoolsTotalStaking = async (): Promise<
  {
    id: number;
    totalStaked: string;
  }[]
> => {
  // TODO: если в будущем будет поддержка BNB, то надо будет стянуть ещё функциональность
  //       для пулов, работающих на BNB, BEP-20
  //       @see https://github.com/pancakeswap/pancake-frontend/blob/c8a7c5c3b32ae99801cf047b5d10afc5b68bf4f8/src/state/pools/fetchPools.ts#L40
  const calls = poolsConfig.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    };
  });

  const [, rocketPropellantABI] = getContractData('RP1');
  const poolsTotalStaked = await multicall<string[]>(rocketPropellantABI, calls);

  return [
    ...poolsConfig.map((pool, index) => ({
      id: pool.id,
      totalStaked: poolsTotalStaked ? new BigNumber(poolsTotalStaked[index]).toFixed() : '0',
    })),
  ];
};

export const fetchPoolStakingLimit = async (id: number): Promise<BigNumber> => {
  try {
    const [{ contractAddress }] = poolsConfig.filter((pool) => pool.id === id);

    const contract = metamaskService.getContract(
      getAddress(contractAddress),
      smartRefinerInitializableAbi,
    );

    const stakingLimit = await contract.methods.poolLimitPerUser().call();
    return new BigNumber(stakingLimit.toString());
  } catch (error) {
    return BIG_ZERO;
  }
};

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = poolsConfig
    .filter((pool) => pool.stakingToken.symbol !== 'BNB' && !pool.isFinished)
    .filter((pool) => !poolsWithStakingLimit.includes(pool.id));

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) => fetchPoolStakingLimit(validPool.id));
  const stakingLimits = await Promise.all(stakingLimitPromises);

  return stakingLimits.reduce((accumulator, stakingLimit, index) => {
    return {
      ...accumulator,
      [validPools[index].id]: stakingLimit,
    };
  }, {});
};

// export const batchRequests = (requests: Array<any>): Promise<PromiseSettledResult<any>[]> =>
//   Promise.allSettled(requests.map((req) => req()));

// Pool 0, Rp1 / Rp1 is a different kind of contract (master refinery)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
// const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
// const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonBnbPools = poolsConfig;
const nonMasterPools = poolsConfig.filter((pool) => pool.id !== 0);

export const fetchPoolsAllowance = async (
  accountAddress: string,
): Promise<Record<string, string>> => {
  const calls = nonBnbPools.map((pool) => ({
    address: getAddress(pool.stakingToken.address),
    name: 'allowance',
    params: [accountAddress, getAddress(pool.contractAddress)],
  }));
  const [, erc20Abi] = getContractData('ERC20');
  const allowances = await multicall(erc20Abi, calls);

  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.id]: new BigNumber(allowances[index]).toJSON() }),
    {},
  );
};

export const fetchUserBalances = async (
  accountAddress: string,
): Promise<Record<string, string>> => {
  // Non BNB pools
  const calls = poolsConfig.map((pool) => ({
    address: getAddress(pool.stakingToken.address),
    name: 'balanceOf',
    params: [accountAddress],
  }));
  const [, erc20Abi] = getContractData('ERC20');
  const tokenBalances = await multicall(erc20Abi, calls);

  return nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(tokenBalances[index]).toJSON(),
    }),
    {},
  );
};

export const fetchUserStakeBalances = async (
  accountAddress: string,
): Promise<Record<string, string>> => {
  const calls = nonMasterPools.map((pool) => ({
    address: getAddress(pool.contractAddress),
    name: 'userInfo',
    params: [accountAddress],
  }));
  const userInfo = await multicall(smartRefinerInitializableAbi, calls);

  const stakedBalances = nonMasterPools.reduce((acc, pool, index) => {
    const [amount] = userInfo[index];
    return {
      ...acc,
      [pool.id]: new BigNumber(amount).toJSON(),
    };
  }, {});

  // RocketPropellant1 / RocketPropellant1 pool
  const masterRefinerContract = getContract('MASTER_REFINER');
  const { amount: masterPoolAmount } = await masterRefinerContract.methods
    .userInfo('0', accountAddress)
    .call();

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() };
};

export const fetchUserPendingRewards = async (
  accountAddress: string,
): Promise<Record<string, string>> => {
  const calls = nonMasterPools.map((pool) => ({
    address: getAddress(pool.contractAddress),
    name: 'pendingReward',
    params: [accountAddress],
  }));
  const pendingRewardsRaw = await multicall(smartRefinerInitializableAbi, calls);

  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(pendingRewardsRaw[index]).toJSON(),
    }),
    {},
  );

  // RocketPropellant1 / RocketPropellant1 pool
  const masterRefinerContract = getContract('MASTER_REFINER');
  const pendingReward = await masterRefinerContract.methods.pendingRP1('0', accountAddress).call();

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() };
};
