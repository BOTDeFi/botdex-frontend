import React from 'react';

import BnbImg from '@/assets/img/currency/bnb.svg';

import { ITokens } from '../../../../types';
import { ChooseTokens, TradeBox } from '..';

import './ImportPool.scss';

const ImportPool: React.FC = () => {
  const [tokensData, setTokensData] = React.useState<ITokens>({
    from: {
      token: {
        logoURI: BnbImg,
        name: 'Binance',
        symbol: 'BNB',
        address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
        decimals: 8,
      },
      amount: NaN,
    },
    to: {
      token: undefined,
      amount: NaN,
    },
  });

  const handleSetTokens = (tokens: ITokens) => {
    setTokensData(tokens);
  };

  return (
    <TradeBox
      className="import-pool"
      title="Import Pool"
      subtitle="Import an existing pool"
      settingsLink="/trade/liquidity/settings"
      recentTxLink="/trade/liquidity/history"
      titleBackLink
    >
      <ChooseTokens handleChangeTokens={handleSetTokens} initialTokenData={tokensData} />
      <div className="text-gray import-pool__text text-center">
        Select a token to find your liquidity.
      </div>
    </TradeBox>
  );
};

export default ImportPool;
