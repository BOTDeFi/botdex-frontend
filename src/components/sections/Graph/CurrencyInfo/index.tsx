/* eslint-disable react/react-in-jsx-scope */
import { FC, ReactElement } from 'react';

import { ReactComponent as SwapSVG } from '@/assets/img/icons/swap-currency.svg';

import './CurrencyInfo.scss';

export interface ICurrencyInfoProps {
  icons?: [string, string] | [ReactElement, ReactElement];
  names?: [string, string];
  date?: string;
  price?: number;
  currency?: string;
  shift?: number;
  percentShift?: number;
  onSwapClick?: () => void;
}

/**
 * @param {[string, string] | [ReactElement | ReactElement]} icons - icons of the tokens
 * @param {[string | string]} names - symbols of the tokens
 * @param {string} date - date of the last info
 * @param {number} price - current price of the token
 * @param {string} currency - symbol of the token
 * @param {number} shift - shift of the tokens
 * @param {number} percentShift - shift in the percents of the tokens
 * @param {void} onSwapClick - todo: add text
 * @returns Component, which contain info of the tokens volatility
 */

const CurrencyInfo: FC<ICurrencyInfoProps> = ({
  icons,
  names,
  date,
  price,
  currency,
  shift,
  percentShift,
  onSwapClick,
}) => {
  return (
    <section className="currency-info__body">
      <div className="currency-info__body-currencies">
        <div className="currency-info__body-currencies-icon">
          {icons ? (
            <>
              {typeof icons[0] === 'string' ? (
                <>
                  {icons.map((e: any, i: number) => {
                    if (names) {
                      return <img key={names[i]} src={e} alt={names[i]} />;
                    }
                    return '';
                  })}
                </>
              ) : (
                <>
                  {icons.map((e: any) => {
                    return e || '';
                  })}
                </>
              )}
            </>
          ) : (
            ''
          )}
        </div>
        <div className="currency-info__body-currencies-names">
          {names?.map((t: string, i: number) => (
            <span
              key={t}
              className="currency-info__body-currencies-names__text text-smd text-upper"
            >
              {t}
              {i !== names.length - 1 ? ' /  ' : ''}
            </span>
          ))}
        </div>
        <button
          onClick={onSwapClick}
          type="button"
          className="currency-info__body-currencies__swap"
        >
          <SwapSVG />
        </button>
      </div>
      <div className="currency-info__body-currencies-statistic">
        <div className="currency-info__body-currencies-statistic__price h2-lg text-bold">
          {price?.toFixed(price < 10 ? 5 : 2)}
        </div>
        <span className="currency-info__body-currencies-statistic__price-symbols text-smd">
          {currency}
        </span>
        {shift ? (
          <span
            className={`currency-info__body-currencies-statistic__price-shift text-sm text-500 ${
              shift >= 0 ? 'green' : 'red'
            }`}
            title={`${shift} (${percentShift}%)`}
          >
            {shift?.toFixed(4)} ({percentShift?.toFixed(3)}%)
          </span>
        ) : (
          ''
        )}
      </div>
      <div className="currency-info__body-currencies-statistic__date">
        <span className="currency-info__body-currencies-statistic__date">{date}</span>
      </div>
    </section>
  );
};

export default CurrencyInfo;
