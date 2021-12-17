import React from 'react';
import classNames from 'classnames';

import { IPoolFarmingMode, Token } from '@/types';

interface ITableRowProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  tokenEarn: Token;
}

const TableRowTitle: React.FC<ITableRowProps> = React.memo(({ className, farmMode, tokenEarn }) => {
  return (
    <div className={classNames(className, 'text-smd')}>
      <span className="text-capitalize">{farmMode}</span>{' '}
      <span className="text-upper">{tokenEarn.symbol}</span>
    </div>
  );
});

export default TableRowTitle;
