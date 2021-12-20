import BigNumber from 'bignumber.js/bignumber';

import { Precisions } from '@/types';

import { BIG_ZERO } from './constants';

/**
 * Converts value to BigNumber. If it's `undefined` returns `new BigNumber(0)`
 *
 * If `nullable` is `true` return null when input equals to `null`
 */
export function toBigNumber(value: string | number | BigNumber | undefined): BigNumber;
export function toBigNumber(
  value: string | number | BigNumber | undefined | null,
  nullable: true,
): BigNumber | null;
export function toBigNumber(
  value: string | number | BigNumber | undefined | null,
): BigNumber | null {
  if (value === null) return null;
  if (value === undefined) return BIG_ZERO;
  if (BigNumber.isBigNumber(value)) return value;
  return new BigNumber(value);
}

/**
 * Converts tokens amount to usd amount.
 */
export function getTokenUsdPrice(
  tokens: BigNumber,
  tokenUsdPrice: number | string | BigNumber,
): string;
export function getTokenUsdPrice(
  tokens: BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly: true,
): string;
export function getTokenUsdPrice(
  tokens: BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly: false,
): BigNumber;
export function getTokenUsdPrice(
  tokens: BigNumber,
  tokenUsdPrice: number | string | BigNumber,
  humanFriendly = true,
): BigNumber | string {
  const tokenUsdPriceAsBigNumber = toBigNumber(tokenUsdPrice);
  const convertedTokenPrice = tokens.times(tokenUsdPriceAsBigNumber);
  return humanFriendly ? convertedTokenPrice.toFixed(Precisions.fiat) : convertedTokenPrice;
}
