import React from 'react';

import { Farm } from '@/types';

import { FarmsTableRow } from '..';

import './Table.scss';

interface ITableProps {
  data: Farm[];
}

const Table: React.FC<ITableProps> = React.memo(({ data }) => {
  return (
    <div className="farms-table box-shadow box-white box-overflow-v">
      <div className="farms-table__head t-box-none">
        <div />
        <div className="text-ssm text-gray-l-2">Earned</div>
        <div className="text-bold text-black farms-table--apr">APR</div>
        <div className="text-bold text-black farms-table--liquidity">Liquidity</div>
        <div className="text-bold text-black farms-table--multiplier">Multiplier</div>
      </div>

      {data.map((farm) => {
        return <FarmsTableRow key={farm.pid} farm={farm} />;
      })}
    </div>
  );
});

export default Table;
