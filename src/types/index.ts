import BigNumber from 'bignumber.js/bignumber';
import { Transaction } from 'web3-core';

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export interface IToken {
  logoURI?: string;
  name: string;
  symbol: string;
  address: string;
  chainId?: number;
  decimals: number | string;
}

export interface ITokens {
  from: {
    token: IToken | undefined;
    amount: number | string;
  };
  to: {
    token: IToken | undefined;
    amount: number | string;
  };
}

export interface ISettings {
  slippage: IActiveSlippage;
  txDeadline: number;
  txDeadlineUtc: number;
}

export interface IActiveSlippage {
  type: 'btn' | 'input';
  value: number;
}

export interface ITeamCard {
  place: number;
  name: string;
  details: string;
  members: number;
  win: number;
  img: string;
  id: number | string;
}

export interface IRecentTx {
  type: string;
  address: string;
  from: {
    symbol: string;
    value: number | string;
    img?: string;
  };
  to: {
    symbol: string;
    value: number | string;
    img?: string;
  };
}

export interface ILiquidityInfo {
  address: string;
  token0: {
    address: string;
    symbol: string;
    balance: number | string;
    rate: number | string;
    decimals: number | string;
    deposited?: number | string;
    receive?: number | string;
  };
  token1: {
    address: string;
    symbol: string;
    balance: number | string;
    rate: number | string;
    decimals: number | string;
    deposited?: number | string;
    receive?: number | string;
  };
}

export enum PoolFarmingMode {
  earn = 'earn',
  manual = 'manual',
  auto = 'auto',
}

export type IPoolFarmingMode = keyof typeof PoolFarmingMode;

export interface IReceipt extends Transaction {
  status: boolean;
}

export interface Address extends Record<string, string> {
  // [key: string]: string;
  '42': string;
}
export interface Token {
  symbol: string;
  address: Address;
  decimals?: number;
  projectLink?: string;
  logoURI?: string;
  busdPrice?: string;
}

export interface PoolConfig {
  id: number;
  earningToken: Token;
  stakingToken: Token;
  contractAddress: Address;
  tokenPerBlock: string;
  isFinished?: boolean;
  enableEmergencyWithdraw?: boolean;
}

interface PoolUserData {
  allowance: BigNumber;
  stakingTokenBalance: BigNumber;
  stakedBalance: BigNumber;
  pendingReward: BigNumber;
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  stakingLimit?: BigNumber;
  startBlock?: number;
  endBlock?: number;
  apr?: number;
  stakingTokenPrice?: number;
  earningTokenPrice?: number;
  isAutoVault?: boolean;
  userData?: PoolUserData;
}

export enum DetailsBadgeType {
  core = 'core',
}
export type IDetailsBadgeType = keyof typeof DetailsBadgeType;

export interface FarmConfig {
  pid: number;
  lpSymbol: string;
  lpAddresses: Address;
  token: Token;
  quoteToken: Token;
  multiplier?: string;
  categoryType: IDetailsBadgeType;
  // dual?: {
  //   rewardPerBlock: number;
  //   earnLabel: string;
  //   endBlock: number;
  // };
}

export type SerializedBigNumber = string;

interface FarmUserData {
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
}

export interface FarmWithoutUserData extends FarmConfig {
  tokenAmountMc?: SerializedBigNumber;
  quoteTokenAmountMc?: SerializedBigNumber;
  tokenAmountTotal?: SerializedBigNumber;
  quoteTokenAmountTotal?: SerializedBigNumber;
  lpTotalInQuoteToken?: SerializedBigNumber;
  lpTotalSupply?: SerializedBigNumber;
  tokenPriceVsQuote?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
}

export interface Farm extends FarmWithoutUserData {
  userData?: FarmUserData;
}

export interface FarmWithStakedValue extends Farm {
  apr?: number;
  lpRewardsApr?: number;
  liquidity?: BigNumber;
}

export enum Precisions {
  token = 10,
  shortToken = 4,
  fiat = 2, // 0.3244 USD = 0.32 USD, 100.1222 RUB = 100.12 RUB
}

export type TimestampSeconds = number;
