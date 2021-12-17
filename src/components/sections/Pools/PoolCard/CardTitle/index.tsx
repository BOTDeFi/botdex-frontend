import React from 'react';
import classNames from 'classnames';

import { IPoolFarmingMode, Token } from '@/types';

interface ICardTitleProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn: Token;
  tokenStake: Token;
}

const CardTitle: React.FC<ICardTitleProps> = React.memo(({ className, farmMode, tokenEarn }) => {
  return (
    <div className={classNames(className, 'text-slg text-yellow text-bold')}>
      <span className="text-capitalize">{farmMode}</span>{' '}
      <span className="text-upper">{tokenEarn.symbol}</span>
    </div>
  );
});

export default CardTitle;
