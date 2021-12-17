import BigNumber from 'bignumber.js/bignumber';

import { getAddress, getContractAddress, getContractData } from '@/services/web3/contractHelpers';
import rootStore from '@/store';
import { Farm, FarmConfig, SerializedBigNumber } from '@/types';
import { toBigNumber } from '@/utils';
import { BIG_ONE, BIG_TEN, BIG_ZERO } from '@/utils/constants';
import { multicall } from '@/utils/multicall';

export const getTokenPricesFromFarms = (): Record<string, number> => {
  const farms = rootStore.farms.data.slice() as Farm[];
  return farms.reduce((prices: Record<string, number>, farm) => {
    const quoteTokenAddress = getAddress(farm.quoteToken.address).toLocaleLowerCase();
    const tokenAddress = getAddress(farm.token.address).toLocaleLowerCase();
    if (farm.quoteToken.busdPrice !== undefined) {
      if (!prices[quoteTokenAddress]) {
        prices[quoteTokenAddress] = new BigNumber(farm.quoteToken.busdPrice).toNumber();
      }
    }

    if (farm.token.busdPrice !== undefined) {
      if (!prices[tokenAddress]) {
        prices[tokenAddress] = new BigNumber(farm.token.busdPrice).toNumber();
      }
    }
    return prices;
  }, {});
};

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (
  farms: Farm[],
  preferredQuoteTokens: string[] = ['BUSD', 'WBNB'],
): Farm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken;
    });
  });
  return preferredFarm || farms[0];
};

const getFarmFromTokenSymbol = (
  farms: Farm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): Farm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol);
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens);
  return filteredFarm;
};

const getFarmBaseTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSD') {
    // hasTokenPriceVsQuote
    return toBigNumber(farm.tokenPriceVsQuote);
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return farm.tokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO;
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'WBNB') {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm?.tokenPriceVsQuote || BIG_ZERO);
    return farm.tokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote;
    return farm.tokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO;
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO;
};

const getFarmQuoteTokenPrice = (
  farm: Farm,
  quoteTokenFarm: Farm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSD') {
    return BIG_ONE;
  }

  if (farm.quoteToken.symbol === 'WBNB') {
    return bnbPriceBusd;
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WBNB') {
    return quoteTokenFarm.tokenPriceVsQuote
      ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    return toBigNumber(quoteTokenFarm.tokenPriceVsQuote);
  }

  return BIG_ZERO;
};

export const fetchFarmsPrices = async (farms: Farm[]): Promise<Farm[]> => {
  // TODO: probably bug
  const bnbBusdFarm = farms.find((farm: Farm) => farm.pid === 252);
  const bnbPriceBusd = bnbBusdFarm?.tokenPriceVsQuote
    ? BIG_ONE.div(bnbBusdFarm.tokenPriceVsQuote)
    : BIG_ZERO;

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol);
    const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd);
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd);
    const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() };
    const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() };
    return { ...farm, token, quoteToken };
  });

  return farmsWithPrices;
};

type PublicFarmData = {
  tokenAmountMc: SerializedBigNumber;
  quoteTokenAmountMc: SerializedBigNumber;
  tokenAmountTotal: SerializedBigNumber;
  quoteTokenAmountTotal: SerializedBigNumber;
  lpTotalInQuoteToken: SerializedBigNumber;
  lpTotalSupply: SerializedBigNumber;
  tokenPriceVsQuote: SerializedBigNumber;
  poolWeight: SerializedBigNumber;
  multiplier: string;
};

export const fetchPublicFarmData = async (farm: Farm): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken } = farm;
  const lpAddress = getAddress(lpAddresses);
  const [masterRefinerAddress, masterRefinerAbi] = getContractData('MASTER_REFINER');
  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [masterRefinerAddress],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
  ];

  const [, erc20Abi] = getContractData('ERC20');
  const [
    tokenBalanceLP,
    quoteTokenBalanceLP,
    lpTokenBalanceMC,
    lpTotalSupply,
    tokenDecimals,
    quoteTokenDecimals,
  ] = await multicall(erc20Abi, calls);

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(
    BIG_TEN.pow(quoteTokenDecimals),
  );

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio);
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));

  // Only make masterchef calls if farm has pid (there can be farms with "pid: -1" which must be excluded)
  const [info, totalAllocPoint] =
    pid >= 0
      ? await multicall(masterRefinerAbi, [
          {
            address: masterRefinerAddress,
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: masterRefinerAddress,
            name: 'totalAllocPoint',
          },
        ])
      : [null, null];

  const [, allocPointRaw] = info || [];
  const allocPoint = toBigNumber(allocPointRaw);
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
  };
};

export const fetchFarm = async (farm: Farm): Promise<Farm> => {
  const farmPublicData = await fetchPublicFarmData(farm);
  return { ...farm, ...farmPublicData };
};

export const fetchFarms = (farmsToFetch: FarmConfig[]): Promise<Farm[]> => {
  return Promise.all(
    farmsToFetch.map((farmConfig) => {
      return fetchFarm(farmConfig);
    }),
  );
};

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterRefinerAddress = getContractAddress('MASTER_REFINER');

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return {
      address: lpContractAddress,
      name: 'allowance',
      params: [account, masterRefinerAddress],
    };
  });

  const [, erc20Abi] = getContractData('ERC20');
  const rawLpAllowances = await multicall(erc20Abi, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance: any) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    };
  });

  const [, erc20Abi] = getContractData('ERC20');
  const rawTokenBalances = await multicall(erc20Abi, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance: any) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const [masterRefinerAddress, masterRefinerAbi] = getContractData('MASTER_REFINER');

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterRefinerAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterRefinerAbi, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance: any) => {
    return new BigNumber(stakedBalance[0]).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const [masterRefinerAddress, masterRefinerAbi] = getContractData('MASTER_REFINER');

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterRefinerAddress,
      name: 'pendingRP1',
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterRefinerAbi, calls);
  const parsedEarnings = rawEarnings.map((earnings: any) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
