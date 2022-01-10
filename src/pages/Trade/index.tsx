/* eslint-disable object-shorthand */
import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { Graph } from '@/components/molecules';
import { CurrencyInfo, TimeSelector } from '@/components/sections/Graph';
import { TTimestampSelector } from '@/components/sections/Graph/TimeSelector';
import { useGetDaysPairs, useGetHoursPairs } from '@/services/api/refinery-finance-pairs';
import { useMst } from '@/store';

import { Liquidity, Swap, TradeNavbar } from '../../components/sections/Trade';

import './Trade.scss';

const Trade: React.FC = observer(() => {
  const { pairs } = useMst();

  const [data, setData] = React.useState(pairs.getFormattedPoints());
  const [reversed, setReversed] = React.useState(false);
  const [currentStamp, setCurrentStamp] = React.useState<number>(0);
  const [currencyData, setCurrencyData] = React.useState<any>(null);

  const options = React.useMemo(
    () => ({
      chart: {
        width: '100%',
      },
      colors: ['rgba(255, 255, 255, 0.1)'], // color of the border
      markers: {
        size: [0],
        colors: ['#F4F4F4'], // color of the marker
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
        type: 'solid',
        colors: ['#000000'],
        opacity: 0.3,
      },
      tooltip: {
        marker: {
          show: false,
        },
        // eslint-disable-next-line func-names
        custom: function () {
          return ``;
        },
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
        hideOverlappingLabels: true,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          rotate: 0,
          style: {
            fontFamily: 'Poppins',
            cssClass: 'xaxis-label',
            colors: '#f4f4f4',
          },
          // eslint-disable-next-line func-names
          formatter: function (value: any, timestamp: number) {
            let format: string;
            switch (currentStamp) {
              case 1: {
                format = 'MMM DD YY';
                break;
              }
              case 2: {
                format = 'MMM DD YY';
                break;
              }
              case 3: {
                format = 'MMM DD YY';
                break;
              }
              default: {
                format = 'HH:mm a';
                break;
              }
            }
            return moment(timestamp).format(format);
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
        padding: {
          right: -26,
          top: -20,
          left: 0,
          bottom: 0,
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStamp],
  );

  const onStampClick = React.useCallback((id: number) => {
    setCurrentStamp(id);
  }, []);

  const onGraphHovered = useCallback(
    (events: any, chartContext: any, config: any) => {
      if (pairs.currentPairData.points.length !== 0 && config.dataPointIndex !== -1) {
        setCurrencyData(pairs.getFormattedCurrentPair(config.dataPointIndex, reversed));
      }
    },
    [pairs, reversed],
  );

  const getByHours = useGetHoursPairs();
  const getByDays = useGetDaysPairs();

  const selectors: TTimestampSelector[] = React.useMemo(
    () => [
      {
        text: '24h',
        onClick: async () => {
          onStampClick(0);
          const response = await getByHours(24, pairs.currentPairData.id);
          pairs.setCurrentPairData(pairs.currentPairData.id, response.pairHourDatas);
        },
      },
      {
        text: '1W',
        onClick: async () => {
          onStampClick(1);
          const response = await getByHours(24 * 7, pairs.currentPairData.id);
          pairs.setCurrentPairData(pairs.currentPairData.id, response.pairHourDatas);
        },
      },
      {
        text: '1M',
        onClick: async () => {
          onStampClick(2);
          const response = await getByDays(30, pairs.currentPairData.id);
          pairs.setCurrentPairData(pairs.currentPairData.id, response.pairDayDatas);
        },
      },
      {
        text: '1Y',
        onClick: async () => {
          onStampClick(3);
          const response = await getByDays(365, pairs.currentPairData.id);
          pairs.setCurrentPairData(pairs.currentPairData.id, response.pairDayDatas);
        },
      },
    ],
    [getByDays, getByHours, onStampClick, pairs],
  );

  useEffect(() => {
    setData(pairs.getFormattedPoints());
    if (pairs.currentPairData.points.length !== 0) {
      setCurrencyData(pairs.getFormattedCurrentPair(0, reversed));
    }
  }, [currentStamp, pairs.currentPairData.points.length, pairs, reversed]);

  const onReverseClick = React.useCallback(() => {
    setReversed(!reversed);
  }, [reversed]);

  return (
    <main className="trade">
      <div className="trade__body">
        <TradeNavbar />
        <div className="trade__blocks">
          <div className="trade__content">
            <Swap />
            <Liquidity />
          </div>
          {window.location.pathname === '/trade/bridge' ? (
            ''
          ) : (
            <div className="trade__graph">
              <div className="trade__graph-body">
                <div className="trade__graph-body__info">
                  {currencyData && <CurrencyInfo {...currencyData} onSwapClick={onReverseClick} />}
                  <TimeSelector currentSelector={currentStamp} selectors={selectors} />
                </div>
                <Graph
                  id="exchange-graph"
                  series={data}
                  options={options}
                  onHovered={onGraphHovered}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
});

export default Trade;
