/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { Graph } from '@/components/molecules';
import { CurrencyInfo, TimeSelector } from '@/components/sections/Graph';
import { TTimestampSelector } from '@/components/sections/Graph/TimeSelector';
import { Liquidity, Swap } from '@/components/sections/Trade';


import './Trade.scss';
import PriceBotData from '@/store/PriceBot/';

const Trade: React.FC = observer(() => {
  const [currentStamp, setCurrentStamp] = React.useState<number>(0);
  const [currencyData, setCurrencyData] = React.useState<any>(null);
  const [isGraphVisible, setGraphVisible] = React.useState(true);
  const [data, setData] = useState({})
  const [isReversed, setIsReversed] = useState(false)

  const location = useLocation();

  const selectors: TTimestampSelector[] = React.useMemo(
    () => [
      {
        text: '1H',
        onClick: async () => {
          setPriceInfo('minuts')
        },
      },
      {
        text: '1D',
        onClick: async () => {
          setPriceInfo('hours')
        },
      },
      {
        text: '1M',
        onClick: async () => {
          setPriceInfo('days')
        },
      },
      {
        text: '1Y',
        onClick: async () => {
          setPriceInfo('months')
        },
      },
    ],
    [],
  );

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
      legend: {
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
        x: {
          show: true,
          formatter: function (value: any) {
            let format = 'MMM DD hh:mm a';
            switch (currentStamp) {
              case 0: {
                format = 'MMM DD hh:mm a';
                break;
              }
              case 1: {
                format = 'MMM DD hh:mm a';
                break;
              }
              case 2: {
                format = 'MMM DD';
                break;
              }
              case 3: {
                format = 'MMM DD';
                break;
              }
              default: {
                format = 'MMM DD hh:mm a';
                break;
              }
            }
            return ` ${moment(value * 1000).format(format)} `;
          },
        },
        y: {
          show: true,
          formatter: function (value: any) {
            return `${value.toFixed(5)} BUSD`;
          },
        },
      },
      xaxis: {
        type: 'datetime',
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
          style: {
            fontFamily: 'Poppins',
            cssClass: 'xaxis-label',
            colors: '#f4f4f4',
          },
          // eslint-disable-next-line func-names
          formatter: function (value: any, timestamp: number) {
            let format = 'HH:mm';
            switch (currentStamp) {
              case 0: {
                // format = 'HH:mm';
                format = 'mm';
                break;
              }
              case 1: {
                format = 'hh a';
                break;
              }
              case 2: {
                format = 'DD';
                break;
              }
              case 3: {
                format = 'MMM';
                break;
              }
              default: {
                format = 'HH:mm';
                break;
              }
            }
            return ` ${moment(timestamp * 1000).format(format)} `;
          },
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
    [currentStamp],
  );

  const setPriceInfo = async (opt: string) => {
    await PriceBotData.setPriceData(opt)
    setData({})
    switch (opt) {
      case 'minuts':
        setCurrentStamp(0)
        break;
      case 'hours':
        setCurrentStamp(1)
        break;
      case 'days':
        setCurrentStamp(2)
        break;
      case 'months':
        setCurrentStamp(3)
        break;

      default:
        setCurrentStamp(2)
        break;
    }
    setData(PriceBotData.getPriceByMin())
  }

  const setCurrentPriceInfo = async (reversed: boolean) => {
    await PriceBotData.setCurrentPrice()
    await PriceBotData.setCurrencyShift()
    if (reversed) {
      setCurrencyData({
        icons: ['321', '123'],
        names: ['BUSD', 'BOT'],
        price: 1 / PriceBotData.getCurrentPrice(),
        currency: 'BOT',
        shift: PriceBotData.getCurrencyShiftReversed(),
        percentShift: PriceBotData.getCurrencyShiftPercentReversed(),
        date: moment(new Date).format('ddd MMM DD YYYY'),
      })
    } else {
      setCurrencyData({
        icons: ['123', '321'],
        names: ['BOT', 'BUSD'],
        price: PriceBotData.getCurrentPrice(),
        currency: 'BUSD',
        shift: PriceBotData.getCurrencyShift(),
        percentShift: PriceBotData.getCurrencyShiftPercent(),
        date: moment(new Date).format('ddd MMM DD YYYY'),
      })
    }
  }

  const onReverseClick = () => {
    setIsReversed(!isReversed)
  }

  useEffect(() => {
    setPriceInfo('days')
  }, [])

  useEffect(() => {
    if (
      window.innerWidth < 1024 &&
      (location.pathname === '/trade/swap/settings' ||
        location.pathname === '/trade/swap/history' ||
        location.pathname === '/trade/liquidity/remove' ||
        location.pathname === '/trade/liquidity/receive' ||
        location.pathname === '/trade/liquidity/history' ||
        location.pathname === '/trade/liquidity/settings')
    ) {
      setGraphVisible(false);
    } else {
      setGraphVisible(true);
    }
  }, [location]);

  useEffect(() => {
    setCurrentPriceInfo(isReversed)
  }, [isReversed])

  return (
    <div className="trade-wrapper">
      <main className="trade">
        <div className="trade__body">
          {/* <TradeNavbar /> */}
          <div className="trade__blocks">
            <div className="trade__content">
              <Swap />
              <Liquidity />
            </div>
            {isGraphVisible && (
              <div className="trade__graph">
                <div className="trade__graph-body">
                  <div className="trade__graph-body__info">
                    {currencyData && (
                      <CurrencyInfo {...currencyData} onSwapClick={onReverseClick} />
                    )}
                    <TimeSelector currentSelector={currentStamp} selectors={selectors} />
                  </div>
                  <Graph
                    id="exchange-graph"
                    series={data}
                    options={options}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main >
    </div >
  );
});

export default Trade;
