import { SCANNERS } from '@/config';
import { getAddress } from '@/services/web3/contractHelpers';
import { Token } from '@/types';

export const getBaseScannerUrl = (chainId: number | string): string => {
  return SCANNERS[Number(chainId)];
};

export const getAddLiquidityUrl = (quoteToken: Token, token: Token): string => {
  return `/trade/liquidity/add/${getAddress(quoteToken.address)}/${getAddress(token.address)}`;
};
