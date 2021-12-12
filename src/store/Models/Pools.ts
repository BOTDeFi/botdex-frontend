import BigNumber from 'bignumber.js/bignumber';
import { types } from 'mobx-state-tree';

import { pools as poolsConfig } from '@/config';
import { metamaskService } from '@/services/MetamaskConnect';
import {
  getAddress,
  getContract,
  getContractAddress,
  getContractData,
} from '@/services/web3/contractHelpers';
import { getTokenPricesFromFarms } from '@/store/farms';
import {
  fetchPoolsAllowance,
  // fetch block limits (ends in)
  fetchPoolsBlockLimits,
  fetchPoolsStakingLimits,
  fetchPoolsTotalStaking,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from '@/store/pools';
import { convertSharesToRefinery } from '@/store/pools/helpers';
import { toBigNumber } from '@/utils';
import { getPoolApr } from '@/utils/apr';
import { BIG_ZERO, DEFAULT_TOKEN_DECIMAL } from '@/utils/constants';
import { getBalanceAmount } from '@/utils/formatters';
import { clog, clogError } from '@/utils/logger';
import { multicall } from '@/utils/multicall';

import AddressModel from './Address';
import FeesModel from './Fees';
import TokenModel from './Token';

const UserDataModel = types.model({
  allowance: types.string,
  stakingTokenBalance: types.string,
  stakedBalance: types.string,
  pendingReward: types.string,
});

const PoolModel = types.model({
  id: types.number,
  earningToken: TokenModel,
  stakingToken: TokenModel,
  contractAddress: AddressModel,
  tokenPerBlock: types.string,

  isFinished: types.optional(types.boolean, false),
  enableEmergencyWithdraw: types.optional(types.boolean, false),

  totalStaked: types.optional(types.string, '0'),
  stakingLimit: types.optional(types.string, '0'),
  startBlock: types.optional(types.number, 0),
  endBlock: types.optional(types.number, 0),
  apr: types.optional(types.number, 0),
  stakingTokenPrice: types.optional(types.number, 0),
  earningTokenPrice: types.optional(types.number, 0),
  isAutoVault: types.optional(types.boolean, false),
  userData: types.optional(UserDataModel, {
    allowance: '',
    stakingTokenBalance: '',
    stakedBalance: '',
    pendingReward: '',
  }),
});

const PoolsModel = types
  .model({
    data: types.optional(types.array(PoolModel), poolsConfig),
    totalShares: types.optional(types.maybeNull(types.string), null),
    pricePerFullShare: types.optional(types.maybeNull(types.string), null),
    totalRefineryInVault: types.optional(types.maybeNull(types.string), null),
    estimatedRefineryBountyReward: types.optional(types.maybeNull(types.string), null),
    availableRefineryAmountToCompound: types.optional(types.string, '0'),
    fuelTokensAmount: types.optional(types.string, '0'),
    fees: FeesModel,
    userData: types.model({
      isLoading: types.boolean,
      userShares: types.maybeNull(types.string),
      lastDepositedTime: types.maybeNull(types.string),
      lastUserActionTime: types.maybeNull(types.string),
      refineryAtLastUserAction: types.maybeNull(types.string),
    }),
  })
  .actions((self) => ({
    setEstimated(value: number) {
      self.estimatedRefineryBountyReward = new BigNumber(value)
        .multipliedBy(DEFAULT_TOKEN_DECIMAL)
        .toJSON();
    },

    fetchVaultFeesSuccess(aggregatedCallsResponse: any) {
      // if (!aggregatedCallsResponse) throw new Error('MultiCallResponse is null');
      const callsResult = aggregatedCallsResponse?.flat();
      const [
        performanceFee,
        callFee,
        withdrawalFee,
        withdrawalFeePeriod,
      ] = callsResult?.map((result: any) => Number(result));

      // console.log(performanceFee, callFee, withdrawalFee, withdrawalFeePeriod);
      self.fees = {
        performanceFee,
        callFee,
        withdrawalFee,
        withdrawalFeePeriod,
      };
    },
    fetchVaultFeesError(error: any) {
      clogError(error);
      self.fees = {
        performanceFee: null,
        callFee: null,
        withdrawalFee: null,
        withdrawalFeePeriod: null,
      };
    },
    fetchVaultFees() {
      const [address, abi] = getContractData('REFINERY_VAULT') as [string, []];
      const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map(
        (method) => ({
          address,
          name: method,
        }),
      );
      multicall(abi, calls).then(this.fetchVaultFeesSuccess, this.fetchVaultFeesError);
    },

    fetchVaultPublicDataSuccess(aggregatedCallsResponse: Array<string[]>) {
      // if (!aggregatedCallsResponse) throw new Error('MultiCallResponse is null');
      const callsResult = aggregatedCallsResponse.flat();
      const [
        sharePrice,
        shares,
        estimatedRefineryBountyReward,
        availableRefineryAmountToCompound,
        // totalPendingRefineryHarvest,
      ] = callsResult;

      const totalSharesAsBigNumber = toBigNumber(shares);
      const sharePriceAsBigNumber = toBigNumber(sharePrice);
      const totalRefineryInVaultEstimate = convertSharesToRefinery(
        totalSharesAsBigNumber,
        sharePriceAsBigNumber,
      );

      self.totalShares = totalSharesAsBigNumber.toJSON();
      self.pricePerFullShare = sharePriceAsBigNumber.toJSON();
      self.totalRefineryInVault = totalRefineryInVaultEstimate.refineryAsBigNumber.toJSON();
      self.estimatedRefineryBountyReward = new BigNumber(
        estimatedRefineryBountyReward.toString(),
      ).toJSON();
      self.availableRefineryAmountToCompound = toBigNumber(
        availableRefineryAmountToCompound,
      ).toJSON();
    },
    fetchVaultPublicDataError(error: any) {
      clogError(error);
      self.totalShares = null;
      self.pricePerFullShare = null;
      self.totalRefineryInVault = null;
      self.estimatedRefineryBountyReward = null;
      // totalPendingRefineryHarvest: new BigNumber(totalPendingRefineryHarvest.toString()).toJSON(),
    },
    fetchVaultPublicData() {
      const [address, abi] = getContractData('REFINERY_VAULT') as [string, []];
      const calls = [
        'getPricePerFullShare',
        'totalShares',
        'calculateHarvestRefineryRewards',
        'available', // to retrieve available amount of RP1 which is needed to compound // is used to correct totalStaked amount of MASTER Contract (Manual Pool)
        // 'calculateTotalPendingRefineryRewards',
      ].map((method) => ({
        address,
        name: method,
      }));
      multicall(abi, calls).then(this.fetchVaultPublicDataSuccess, this.fetchVaultPublicDataError);

      this.fetchVaultFuelTokensAmount();
    },

    fetchVaultFuelTokensAmountSuccess(response: { amount: string; rewardDebt: string }) {
      const { amount } = response;
      self.fuelTokensAmount = amount;
    },
    fetchVaultFuelTokensAmountError() {
      self.fuelTokensAmount = '0';
    },
    fetchVaultFuelTokensAmount() {
      const masterRefinerContract = getContract('MASTER_REFINER');
      const refineryVaultAddress = getContractAddress('REFINERY_VAULT');
      masterRefinerContract.methods
        .userInfo('0', refineryVaultAddress)
        .call()
        .then(this.fetchVaultFuelTokensAmountSuccess, this.fetchVaultFuelTokensAmountError);
    },

    fetchVaultUserDataError(error: any) {
      clogError(error);
      self.userData = {
        isLoading: true,
        userShares: null,
        lastDepositedTime: null,
        lastUserActionTime: null,
        refineryAtLastUserAction: null,
      };
    },
    fetchVaultUserDataSuccess(response: any) {
      const {
        shares,
        lastDepositedTime,
        lastUserActionTime,
        refineryAtLastUserAction: refineryAtLastUserActionAsString,
      } = response;
      self.userData = {
        isLoading: false,
        userShares: new BigNumber(shares).toFixed(),
        lastDepositedTime,
        lastUserActionTime,
        refineryAtLastUserAction: new BigNumber(refineryAtLastUserActionAsString).toFixed(),
      };
    },
    fetchVaultUserData(address: string) {
      const contract = getContract('REFINERY_VAULT');
      contract.methods
        .userInfo(address)
        .call()
        .then(this.fetchVaultUserDataSuccess, this.fetchVaultUserDataError);
    },

    fetchPoolsPublicData() {
      this.fetchPoolsPublicDataAsync();
      this.fetchPoolsStakingLimitsAsync();
    },

    async fetchPoolsPublicDataAsync() {
      const currentBlock = await metamaskService.web3Provider.eth.getBlockNumber();

      const blockLimits = await fetchPoolsBlockLimits();
      const totalStakings = await fetchPoolsTotalStaking();

      const prices = getTokenPricesFromFarms();

      clog(Object.freeze(prices));

      const livePoolsData = poolsConfig.map((pool) => {
        const blockLimit = blockLimits.find((entry) => entry.id === pool.id);
        const totalStaking = totalStakings.find((entry) => entry.id === pool.id);
        const isPoolEndBlockExceeded =
          currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false;
        const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded;

        const stakingTokenAddress = pool.stakingToken.address
          ? getAddress(pool.stakingToken.address).toLowerCase()
          : null;
        const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0;

        const earningTokenAddress = pool.earningToken.address
          ? getAddress(pool.earningToken.address).toLowerCase()
          : null;
        const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0;
        const calculatedApr = getPoolApr(
          stakingTokenPrice,
          earningTokenPrice,
          getBalanceAmount(
            new BigNumber(totalStaking ? totalStaking.totalStaked : 0),
            pool.stakingToken.decimals,
          ),
          parseFloat(pool.tokenPerBlock),
        );
        const apr = !isPoolFinished && calculatedApr !== null ? calculatedApr : 0;

        return {
          ...blockLimit,
          ...totalStaking,
          stakingTokenPrice,
          earningTokenPrice,
          apr,
          isFinished: isPoolFinished,
        };
      });

      this.setPoolsPublicData(livePoolsData);
    },
    // @note livePoolsData type just copied from type derivation
    setPoolsPublicData(
      livePoolsData: Array<{
        stakingTokenPrice: number;
        earningTokenPrice: number;
        apr: number;
        isFinished: boolean;
        id?: number;
        totalStaked?: string;
        startBlock?: number;
        endBlock?: number;
      }>,
    ) {
      self.data.forEach((pool) => {
        const livePoolData = livePoolsData.find(({ id }) => id === pool.id);
        if (livePoolData) {
          pool.stakingTokenPrice = livePoolData.stakingTokenPrice;
          pool.earningTokenPrice = livePoolData.earningTokenPrice;
          pool.apr = livePoolData.apr;

          if (livePoolData.isFinished !== undefined) {
            pool.isFinished = livePoolData.isFinished;
          }

          if (livePoolData.totalStaked !== undefined) {
            pool.totalStaked = livePoolData.totalStaked;
          }
          if (livePoolData.startBlock !== undefined) {
            pool.startBlock = livePoolData.startBlock;
          }
          if (livePoolData.endBlock !== undefined) {
            pool.endBlock = livePoolData.endBlock;
          }
        }
      });
    },

    async fetchPoolsStakingLimitsAsync() {
      const poolsWithStakingLimit = self.data
        .filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
        .map((pool) => pool.id);

      const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit);

      const stakingLimitData = poolsConfig.map((pool) => {
        if (poolsWithStakingLimit.includes(pool.id)) {
          return { id: pool.id };
        }
        const stakingLimit = stakingLimits[pool.id] || BIG_ZERO;
        return {
          id: pool.id,
          stakingLimit: stakingLimit.toJSON(),
        };
      });

      this.setPoolsPublicData(stakingLimitData);
    },

    async updateUserAllowance(poolId: number, accountAddress: string) {
      const allowances = await fetchPoolsAllowance(accountAddress);
      this.updatePoolsUserData({ poolId, field: 'allowance', value: allowances[poolId] });
    },

    async updateUserBalance(poolId: number, accountAddress: string) {
      const tokenBalances = await fetchUserBalances(accountAddress);
      this.updatePoolsUserData({
        poolId,
        field: 'stakingTokenBalance',
        value: tokenBalances[poolId],
      });
    },

    async updateUserStakedBalance(poolId: number, accountAddress: string) {
      const stakedBalances = await fetchUserStakeBalances(accountAddress);
      this.updatePoolsUserData({ poolId, field: 'stakedBalance', value: stakedBalances[poolId] });
    },

    async updateUserPendingReward(poolId: number, accountAddress: string) {
      const pendingRewards = await fetchUserPendingRewards(accountAddress);
      this.updatePoolsUserData({ poolId, field: 'pendingReward', value: pendingRewards[poolId] });
    },

    updatePoolsUserData({
      field,
      value,
      poolId,
    }: {
      poolId: number;
      field: string;
      value: string;
    }) {
      const foundPool = self.data.find((p) => p.id === poolId);
      if (!foundPool) return;
      (foundPool.userData as any)[field] = value;
    },

    // FETCH ALLOWANCES ETC. FOR POOLS
    async fetchPoolsUserDataAsync(accountAddress: string) {
      const allowances = await fetchPoolsAllowance(accountAddress);
      const stakingTokenBalances = await fetchUserBalances(accountAddress);
      const stakedBalances = await fetchUserStakeBalances(accountAddress);
      const pendingRewards = await fetchUserPendingRewards(accountAddress);

      const userData = poolsConfig.map((pool) => ({
        id: pool.id,
        allowance: allowances[pool.id],
        stakingTokenBalance: stakingTokenBalances[pool.id],
        stakedBalance: stakedBalances[pool.id],
        pendingReward: pendingRewards[pool.id],
      }));

      this.setPoolsUserData(userData);
    },

    setPoolsUserData(
      userData: Array<{
        id: number;
        allowance: string;
        stakingTokenBalance: string;
        stakedBalance: string;
        pendingReward: string;
      }>,
    ) {
      userData.forEach((newUserData) => {
        const foundPool = self.data.find((pool) => newUserData.id === pool.id);
        if (foundPool) {
          foundPool.userData = newUserData;
        }
      });
      // self.data.forEach((pool) => {
      //   const userPoolData = userData.find((entry) => entry.id === pool.id);
      //   if (userPoolData) {
      //     userPoolData
      //   }
      //   return { ...pool, userData: userPoolData }
      // })
      // state.userDataLoaded = true
    },
  }));

export default PoolsModel;
