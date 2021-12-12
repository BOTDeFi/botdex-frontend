import React from 'react';
import classNames from 'classnames';

import { ReactComponent as RefreshAutoIcon } from '@/assets/img/icons/refresh-auto.svg';
import RefreshImg from '@/assets/img/icons/refresh.svg';
import { Button } from '@/components/atoms';
import { ColorScheme } from '@/components/atoms/Button';
import { IPoolFarmingMode, PoolFarmingMode } from '@/types';

import './FarmingModeStatus.scss';

interface IFarmingModeStatusProps {
  type: IPoolFarmingMode;
}

const FarmingModeStatus: React.FC<IFarmingModeStatusProps> = ({ type }) => {
  const isAuto = type === PoolFarmingMode.auto;
  const style = isAuto ? 'green' : 'purple';
  return (
    <Button
      className={classNames('farming-mode-status__button', {
        'farming-mode-status__button_auto': isAuto,
      })}
      size="smd"
      colorScheme={`outline-${style}` as ColorScheme}
      noclick
    >
      {isAuto ? (
        <div className="box-f-c">
          <RefreshAutoIcon />
        </div>
      ) : (
        <img src={RefreshImg} alt="" />
      )}
      <span
        className={classNames('farming-mode-status__button-text text text-med', `text-${style}`)}
      >
        {isAuto ? 'Auto' : 'Manual'}
      </span>
    </Button>
  );
};

export default FarmingModeStatus;
