/* eslint-disable object-shorthand */
import React, { useEffect } from 'react';
import moment from 'moment';

import BNBIcon from '@/assets/img/icons/BNB.svg';
import BTCIcon from '@/assets/img/icons/BTC.svg';
import { Graph } from '@/components/molecules';
import { CurrencyInfo, TimeSelector } from '@/components/sections/Graph';
import { ICurrencyInfoProps } from '@/components/sections/Graph/CurrencyInfo';
import { TTimestampSelector } from '@/components/sections/Graph/TimeSelector';

import { Liquidity, Swap, TradeNavbar } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = React.memo(() => {
  const [data, setData] = React.useState<any[]>([]);
  const [currentStamp, setCurrentStamp] = React.useState<number>(0);
  /*
  Когда будут данные, заполнять массив currentStamp данными и при наведеени брать i элемент
  */
  const [currencyData, setCurrencyData] = React.useState<ICurrencyInfoProps>({
    icons: [BNBIcon, BTCIcon],
    names: ['BNB', 'BTCB'],
    date: '18:42 30 Nov, 2021',
    price: 43.99,
    currency: 'BTCB',
    shift: 0.729,
    percentShift: 1.68,
  });

  const onUpdClick = React.useCallback(() => {
    const size = 35;
    const min = 0;
    const max = 100;
    setData(
      new Array(size)
        .fill(1)
        .map((e: any, i: number) => [
          Date.now() - i * 8640000,
          e * Math.floor(Math.random() * (max - min)) + min,
        ]),
    );
  }, []);

  const options = React.useMemo(
    () => ({
      colors: ['#FFCC00'], // color of the border
      markers: {
        size: [0],
        colors: ['#FFCC00'], // color of the marker
        strokeWidth: 3,
        hover: {
          size: 4,
          sizeOffset: 6,
        },
      },
      legeng: {
        show: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          shadeIntensity: 0.5,
          colorStops: [
            {
              offset: -22,
              color: '#FFD335',
              opacity: 1,
            },
            {
              offset: 100,
              color: '#F9F9F9',
              opacity: 1,
            },
          ],
        },
      },
      tooltip: {
        marker: {
          show: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex }: any) {
          setCurrencyData(prev => ({
            ...prev,
            price: series[seriesIndex][dataPointIndex],
          }))
          return ``;
        },
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: 0,
          style: {
            fontFamily: 'Montserrat',
            cssClass: 'xaxis-label',
          },
          formatter: function (value: any, timestamp: number) {
            return moment(timestamp).format('HH:mm a');
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onStampClick = React.useCallback(
    (id: number) => {
      return function () {
        setCurrentStamp(id);
        onUpdClick();
      };
    },
    [onUpdClick],
  );

  const selectors: TTimestampSelector[] = React.useMemo(
    () => [
      {
        text: '24h',
        onClick: onStampClick(0),
      },
      {
        text: '1W',
        onClick: onStampClick(1),
      },
      {
        text: '1M',
        onClick: onStampClick(2),
      },
      {
        text: '1Y',
        onClick: onStampClick(3),
      },
    ],
    [onStampClick],
  );

  // emulation of fetching data
  useEffect(() => {
    setTimeout(() => {
      onUpdClick();
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="trade">
      <div className="trade__body">
        <TradeNavbar />
        <div className="trade__blocks">
          <div className="trade__content">
            <Swap />
            <Liquidity />
          </div>
          <div className="trade__graph">
            <div className="trade__graph-body box-white box-shadow">
              <div className="trade__graph-body__info">
                <CurrencyInfo {...currencyData} />
                <TimeSelector currentSelector={currentStamp} selectors={selectors} />
              </div>
              <Graph id="exchange-graph" series={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

export default Trade;
