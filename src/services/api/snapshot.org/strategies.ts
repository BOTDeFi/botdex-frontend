import { tokens } from '@/config/tokens';

const tokenRp1 = {
  address: tokens.rp1.address,
  symbol: tokens.rp1.symbol,
  decimals: tokens.rp1.decimals,
};

// TODO: ??? refactor this if it's needed to be scaled
export const strategies = {
  // just calculates erc20 balanceOf of the addresses
  erc20BalanceOf: {
    name: 'erc20-balance-of',
    params: {
      ...tokenRp1,
    },
  },
  // just calculates erc20 balanceOf of the addresses which balance is greater than "minBalance"
  erc20WithBalance: {
    name: 'erc20-with-balance',
    params: {
      ...tokenRp1,
      minBalance: 0,
    },
  },
  // Returns 0.01 as MINIMAL_BALANCE, even when it is actually equals to 0
  cake: {
    name: 'cake',
    params: {
      // symbol: tokenRp1.symbol, // it makes no sense to declare it
    },
  },
};
