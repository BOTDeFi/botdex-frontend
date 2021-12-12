import React from 'react';

import { Skeleton } from '@/components/atoms';

import { IColumn } from '../types';

interface IRecentProfitColumnProps extends IColumn {
  value: string;
  usdValue: string;
}

const RecentProfit: React.FC<IRecentProfitColumnProps> = ({ name, value, usdValue }) => {
  const isLoading = value === 'NaN';
  return (
    <div className="pools-table-row__recent-profit text-gray-l-2 text-smd">
      <div className="pools-table-row__extra-text t-box-b text-gray text-ssm">{name}</div>
      <div className="pools-table-row__recent-profit-value">
        {isLoading ? (
          <Skeleton.Input style={{ width: 60 }} size="small" active />
        ) : (
          <>
            <div className="text-smd">{value}</div>
            <div className="text-ssm">
              <span>{usdValue} </span>
              <span>USD</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentProfit;
