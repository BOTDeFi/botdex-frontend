import React from 'react';
import classNames from 'classnames';

import { IPoolFarmingMode, PoolFarmingMode, Token } from '@/types';

interface ICardSubtitleProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn: Token;
  tokenStake: Token;
}
const CardSubtitle: React.FC<ICardSubtitleProps> = React.memo(
  ({ className, farmMode, tokenStake, tokenEarn }) => {
    return (
      <div className={classNames(className, 'text-smd text-black')}>
        {farmMode === PoolFarmingMode.manual && tokenEarn && (
          <>
            <span className="capitalize">Earn</span> <span>{tokenEarn.symbol}</span>,{' '}
            <span>stake</span> <span className="text-upper">{tokenStake.symbol}</span>
          </>
        )}
        {farmMode === PoolFarmingMode.auto && 'Automatic restaking'}
        {farmMode === PoolFarmingMode.earn && `Stake ${tokenStake.symbol}`}
      </div>
    );
  },
);

export default CardSubtitle;
