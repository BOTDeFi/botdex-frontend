import BigNumber from 'bignumber.js/bignumber';

import { BIG_TEN } from './constants';

/**
 * @param amount 1 (`decimals` = 18)
 * @returns 1000000000000000000 (=`amount` * 10 ** `decimals`)
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

/**
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const getBalanceAmountBN = (decimalAmount: BigNumber, decimals = 18): BigNumber => {
  return new BigNumber(decimalAmount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const getBalanceAmount = (decimalAmount: BigNumber, decimals = 18): number => {
  return getBalanceAmountBN(decimalAmount, decimals).toNumber();
};

export const getFullDisplayBalance = (params: {
  balance: BigNumber;
  decimals?: number;
  displayDecimals?: number;
}): string | number => {
  const { balance, decimals = 18, displayDecimals } = params;
  const ret = getBalanceAmount(balance, decimals);
  return typeof displayDecimals === 'number' ? ret.toFixed(displayDecimals) : ret;
};

export const numberWithCommas = (number: number): string => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export function feeFormatter(
  fee: null | undefined,
  maxValue?: number,
  noDataDummy?: string,
): string;
export function feeFormatter(fee: number, maxValue?: number, noDataDummy?: string): number;
export function feeFormatter(
  fee: number | null | undefined,
  maxValue?: number,
  noDataDummy?: string,
): number | string;
export function feeFormatter(
  fee: number | null | undefined,
  maxValue = 100,
  noDataDummy = '###',
): string | number {
  if (fee === null || fee === undefined) return noDataDummy;
  return fee / maxValue;
}

export const loadingDataFormatter = (
  value?: number | string | null | undefined | BigNumber,
  options: {
    noDataDummy?: string;
    decimals?: number;
    displayDecimals?: number;
  } = {},
): string | number => {
  const { noDataDummy = '###', ...otherOptions } = options;
  if (value === null || value === undefined) return noDataDummy;
  return getFullDisplayBalance({
    balance: BigNumber.isBigNumber(value) ? value : new BigNumber(value),
    ...otherOptions,
    // decimals: options?.decimals,
    // displayDecimals: options?.
  });
  // return getBalanceAmount(BigNumber.isBigNumber(value) ? value : new BigNumber(value));
};

export const addressShortener = (address: string, charsCountToShow = 10): string => {
  const startCharsCount = Math.floor(charsCountToShow / 2) + 1;
  const lastCharsCount = Math.floor(charsCountToShow / 2) - 1;

  const addressAsArray = address.split('');
  addressAsArray.splice(
    startCharsCount,
    address.length - (startCharsCount + lastCharsCount),
    '...',
  );
  return addressAsArray.join('');
};

export const ipfsShortener = (ipfsHash: string, charsCountToShow = 6): string => {
  return `#${ipfsHash.slice(0, charsCountToShow)}`;
};
