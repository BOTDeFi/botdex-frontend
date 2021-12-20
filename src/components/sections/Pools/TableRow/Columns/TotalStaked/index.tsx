import React from 'react';
import classNames from 'classnames';

import { Skeleton } from '@/components/atoms';

import { IColumn } from '../types';

interface ITotalStakedColumnProps extends IColumn {
  value: string;
  currencySymbol: string;
}

const TotalStaked: React.FC<ITotalStakedColumnProps> = ({
  value,
  currencySymbol,
  onlyDesktop = false,
}) => {
  const isLoading = Number.isNaN(Number(value));
  return (
    <div
      className={classNames(
        'pools-table-row__total-staked',
        'pools-table-row__item',
        'box-f-ai-c',
        'text-smd',
        {
          't-box-none': onlyDesktop,
        },
      )}
    >
      {isLoading ? (
        <Skeleton.Input style={{ width: 120 }} size="small" active />
      ) : (
        <span className="text-med text-yellow">
          {value} {currencySymbol}
        </span>
      )}
    </div>
  );
};

export default TotalStaked;
