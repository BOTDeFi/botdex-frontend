import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import ArrowImg from '@/assets/img/icons/arrow-btn.svg';
import InfoImg from '@/assets/img/icons/info.svg';
import RecentTxImg from '@/assets/img/icons/recent-tx-white.svg';
import SettingsImg from '@/assets/img/icons/settings-white.svg';

import { Popover } from '../../../atoms';

import './TradeBox.scss';

interface ITradeBox {
  title: string;
  subtitle?: string;
  settingsLink?: string;
  recentTxLink?: string;
  className?: string;
  titleBackLink?: boolean;
  info?: string;
}

const TradeBox: React.FC<ITradeBox> = ({
  title,
  subtitle,
  settingsLink,
  recentTxLink,
  children,
  className,
  titleBackLink,
  info,
}) => {
  return (
    <div className={cn('trade-box box-shadow box-dark-grey', className)}>
      <div className="trade-box__box-top box-f box-f-jc-sb">
        <div className="">
          {titleBackLink ? (
            <Link to="/trade/liquidity">
              <div className={cn('trade-box__title text-md text-white text-bold box-f-ai-c')}>
                <img src={ArrowImg} alt="" className="trade-box__back" />
                <span>{title}</span>
              </div>
            </Link>
          ) : (
            <div className={cn('trade-box__title text-md text-white text-bold box-f-ai-c')}>
              <span>{title}</span>
            </div>
          )}
          {subtitle ? (
            <div className="trade-box__subtitle text-gray box-f-ai-c">
              <span>{subtitle}</span>

              {info ? (
                <Popover content={<span className="text-med text text-gray">{info}</span>}>
                  <img src={InfoImg} alt="info icon" />
                </Popover>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        {recentTxLink && settingsLink ? (
          <div className="box-f-ai-c">
            {settingsLink ? (
              <Link to={settingsLink} className="trade-box__icon">
                <img src={SettingsImg} alt="advanced settings" />
              </Link>
            ) : (
              ''
            )}
            {recentTxLink ? (
              <Link to={recentTxLink} className="trade-box__icon">
                <img src={RecentTxImg} alt="advanced settings" />
              </Link>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      {children}
    </div>
  );
};

export default TradeBox;
