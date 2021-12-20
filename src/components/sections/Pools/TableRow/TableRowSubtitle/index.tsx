import React from 'react';
import classNames from 'classnames';

import { IPoolFarmingMode, PoolFarmingMode, Token } from '@/types';

interface ITableRowSubtitleProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn: Token;
  tokenStake: Token;
}
const TableRowSubtitle: React.FC<ITableRowSubtitleProps> = React.memo(
  ({ className, farmMode, tokenStake, tokenEarn }) => {
    return (
      <div className={classNames(className, 'text-ssm text-gray-l-2')}>
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

export default TableRowSubtitle;
