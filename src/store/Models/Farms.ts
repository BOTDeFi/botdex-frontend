import { types } from 'mobx-state-tree';

import { farms as farmsConfig } from '@/config';
import priceHelperLpsConfig from '@/config/priceHelperLps';
import { FarmWithoutUserData } from '@/types';

import {
  fetchFarms,
  fetchFarmsPrices,
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from '../farms';

import AddressModel from './Address';
import TokenModel from './Token';

const UserDataModel = types.model({
  allowance: types.string,
  tokenBalance: types.string,
  stakedBalance: types.string,
  earnings: types.string,
});

const FarmModel = types.model({
  pid: types.number,
  lpSymbol: types.string,
  lpAddresses: AddressModel,
  token: TokenModel,
  quoteToken: TokenModel,
  multiplier: types.maybe(types.string),
  categoryType: types.string,
  // dual: types.maybe(
  //   types.model({
  //     rewardPerBlock: types.number,
  //     earnLabel: types.string,
  //     endBlock: types.number,
  //   }),
  // ),

  tokenAmountMc: types.maybe(types.string),
  quoteTokenAmountMc: types.maybe(types.string),
  tokenAmountTotal: types.maybe(types.string),
  quoteTokenAmountTotal: types.maybe(types.string),
  lpTotalInQuoteToken: types.maybe(types.string),
  lpTotalSupply: types.maybe(types.string),
  tokenPriceVsQuote: types.maybe(types.string),
  poolWeight: types.maybe(types.string),
  userData: types.maybe(UserDataModel),
});

const FarmsModel = types
  .model({
    data: types.optional(types.array(FarmModel), farmsConfig),
    userDataLoaded: false,
  })
  .actions((self) => ({
    async fetchFarmsPublicDataAsync(pids: number[]) {
      const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid));

      // Add price helper farms
      const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig);

      const farms = await fetchFarms(farmsWithPriceHelpers);
      const farmsWithPrices = await fetchFarmsPrices(farms);

      // Filter out price helper LP config farms (there can be farms with "pid: -1" which must be excluded)
      const farmsWithoutHelperLps = farmsWithPrices.filter((farm: FarmWithoutUserData) => {
        return farm.pid >= 0;
      });

      this.fetchFarmsPublicDataAsyncSuccess(farmsWithoutHelperLps);
    },
    fetchFarmsPublicDataAsyncSuccess(newData: FarmWithoutUserData[]) {
      self.data.forEach((farm) => {
        const liveFarmData = newData.find(({ pid }: { pid: number }) => pid === farm.pid);

        if (!liveFarmData) return;

        farm.categoryType = liveFarmData.categoryType;
        farm.lpAddresses = liveFarmData.lpAddresses;
        farm.lpSymbol = liveFarmData.lpSymbol;
        farm.lpTotalInQuoteToken = liveFarmData.lpTotalInQuoteToken;
        farm.lpTotalSupply = liveFarmData.lpTotalSupply;
        farm.multiplier = liveFarmData.multiplier;
        farm.pid = liveFarmData.pid;
        farm.poolWeight = liveFarmData.poolWeight;

        farm.quoteToken.busdPrice = liveFarmData.quoteToken.busdPrice || '';

        farm.quoteTokenAmountMc = liveFarmData.quoteTokenAmountMc;
        farm.quoteTokenAmountTotal = liveFarmData.quoteTokenAmountTotal;

        farm.token.busdPrice = liveFarmData.token.busdPrice || '';

        farm.tokenAmountMc = liveFarmData.tokenAmountMc;
        farm.tokenAmountTotal = liveFarmData.tokenAmountTotal;
        farm.tokenPriceVsQuote = liveFarmData.tokenPriceVsQuote;
      });
    },
    async fetchFarmUserDataAsync(account: string, pids: number[]) {
      const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid));
      const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch);
      const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch);
      const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch);
      const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch);

      this.fetchFarmUserDataAsyncSuccess(
        userFarmAllowances.map((farmAllowance: any, index: number) => {
          return {
            pid: farmsToFetch[index].pid,
            allowance: userFarmAllowances[index],
            tokenBalance: userFarmTokenBalances[index],
            stakedBalance: userStakedBalances[index],
            earnings: userFarmEarnings[index],
          };
        }),
      );
    },
    fetchFarmUserDataAsyncSuccess(
      newData: { pid: any; allowance: any; tokenBalance: any; stakedBalance: any; earnings: any }[],
    ) {
      newData.forEach((userData) => {
        const { pid } = userData;
        const index = self.data.findIndex((farm) => farm.pid === pid);
        self.data[index].userData = userData;
      });
      self.userDataLoaded = true;
    },
  }));

export default FarmsModel;
