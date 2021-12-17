import React from 'react';

import CalcImg from '@/assets/img/icons/calc.svg';

import { IColumn } from '../types';

interface IAprColumnProps extends IColumn {
  value: string | number;
  modalHandler: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const Apr: React.FC<IAprColumnProps> = ({ name, value, modalHandler }) => {
  return (
    <div className="pools-table-row__apr pools-table-row__item box-f-ai-c text-smd t-box-b">
      <div className="pools-table-row__extra-text t-box-b text-gray text-ssm">{name}</div>
      <span className="pools-table-row__text-md">
        {Number(value).toFixed(2).replace('.', ',')}%
      </span>
      <div
        className="pools-table-row__apr_button"
        onClick={modalHandler}
        onKeyDown={modalHandler}
        role="button"
        tabIndex={0}
      >
        <img className="pools-table-row__item-img-info" src={CalcImg} alt="calculator" />
      </div>
    </div>
  );
};

export default Apr;
