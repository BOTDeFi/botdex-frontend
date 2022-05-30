/* eslint-disable */
import React, { useCallback, useEffect, useState, VFC } from 'react';
import { observer } from 'mobx-react-lite';
import { SwiperSlide } from 'swiper/react/swiper-react';
import useMedia from 'use-media';
import { v1 as uuid } from 'uuid';

import { Button, ShadowTitle, Swiper } from '@/components/atoms';
import { Graph } from '@/components/molecules';

import { CurrencyInfo, TimeSelector } from '../../Graph';
import { slides } from '../Home.mock';

import ValueCard from './ValueCard';

import './Preview.scss';
import { IBlogType } from '@/types';
import { getBlogs } from '@/utils/getBlogs';
import { Comet, Alien } from '@/assets/img/sections';

import { TTimestampSelector } from '@/components/sections/Graph/TimeSelector';
import PriceBotDataInfo from '@/store/PriceBot/';
import moment from 'moment';
import { PriceBotData } from '@/hooks/useFetchPriceBot';

const Preview: VFC<{ priceBotData: PriceBotData | null }> = observer(({ priceBotData }) => {
  const isWide = useMedia({ minWidth: '1412px' });
  const isMobile = useMedia({ minWidth: '769px' });
  const isChartMobile = useMedia({ maxWidth: '500px' });
  const isUltraWide = useMedia({ minWidth: '2100px' });

  const [blogs, setBlogs] = useState<IBlogType[]>([]);
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
        tickPlacement: 'on',
        tickAmount: isChartMobile ? 4 : 6,
        offsetX: 40,
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
                format = 'mm';
                break;
              }
              case 1: {
                format = 'hh a';
                break;
              }
              case 2: {
                format = 'DD MMM';
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
    [currentStamp, isChartMobile],
  );


  const [data, setData] = useState({})
  const [isReversed, setIsReversed] = useState(false)

  const setPriceInfo = async (opt: string) => {
    await PriceBotDataInfo.setPriceData(opt)
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
    setData(PriceBotDataInfo.getPriceByMin())
  }

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

  const setCurrentPriceInfo = async (reversed: boolean) => {
    await PriceBotDataInfo.setCurrentPrice()
    await PriceBotDataInfo.setCurrencyShift()
    if (reversed) {
      setCurrencyData({
        icons: ['321', '123'],
        names: ['BUSD', 'BOT'],
        price: 1 / PriceBotDataInfo.getCurrentPrice(),
        currency: 'BOT',
        shift: PriceBotDataInfo.getCurrencyShiftReversed(),
        percentShift: PriceBotDataInfo.getCurrencyShiftPercentReversed(),
        date: moment(new Date).format('ddd MMM DD YYYY'),
      })
    } else {
      setCurrencyData({
        icons: ['123', '321'],
        names: ['BOT', 'BUSD'],
        price: PriceBotDataInfo.getCurrentPrice(),
        currency: 'BUSD',
        shift: PriceBotDataInfo.getCurrencyShift(),
        percentShift: PriceBotDataInfo.getCurrencyShiftPercent(),
        date: moment(new Date).format('ddd MMM DD YYYY'),
      })
    }
  }

  const handleRequestBlogs = useCallback(() => {
    getBlogs().then((data) => {
      setBlogs(data);
    });
  }, []);

  useEffect(() => {
    handleRequestBlogs();
  }, [currentStamp]);

  useEffect(() => {
    setPriceInfo('days')
    setCurrentPriceInfo(isReversed)
  }, [isReversed])

  const onReverseClick = () => {
    setIsReversed(!isReversed)
  }

  return (
    <div className="h-preview">
      <div className="h-preview_body">
        <div className="h-preview_top">
          <div className="h-preview_top-left">
            <div className="h-preview_top-left-title">
              <span className="h-preview_top-left-title-span big">
                <ShadowTitle type="h2">
                  Dive deeper into the Crypto World
                </ShadowTitle>
              </span>
            </div>
            <div className="h-preview_top-left_subtitle">
              Discover the next level of Farming and Staking on BotSwap!
            </div>
            <Button
              link="/trade/swap"
              className="h-preview_top-left_btn btn-hover-down"
              colorScheme="pink"
              size="smd"
            >
              <span>
                Trade Now
              </span>
            </Button>
            <div className="h-preview_top-left_info">
              <ValueCard
                title="Market Cap"
                value={priceBotData ? (priceBotData.market_cap / 1000000).toFixed(2) : 'updating'}
                img={Comet}
                type="comet"
              />
              <ValueCard
                title="Daily trading volume"
                value={priceBotData ? (priceBotData.daily_volume / 1000000).toFixed(2) : 'updating'}
                img={Alien}
                type="alian"
              />
            </div>
          </div>
          <div className="h-preview_top-right">
            <div className="trade__graph-body__info-main">
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
        <div className="h-preview_slides">
          <Swiper
            slidesPerView={isUltraWide ? 4 : isWide ? 3 : isMobile ? 2 : 1}
            spaceBetween={10}
            className="h-preview_slides_body"
            keyboard
            loop
            allowTouchMove
            mousewheel
            nav
          >
            {blogs.length
              ? blogs.map(({ post_link, image_link }) => (
                <SwiperSlide key={uuid()}>
                  <div className="h-preview_slides_top_item">
                    <a href={post_link} target="_blank" rel="noreferrer">
                      <span>
                        <img src={image_link} alt="slide" />
                      </span>
                      <span>
                        Benefits of using Binance Smart Chain over Ethereum for Bot Planet NFT.
                      </span>
                      <span>
                        Read more
                      </span>
                    </a>
                  </div>
                </SwiperSlide>
              ))
              : slides.map(({ img }) => (
                <SwiperSlide key={uuid()}>
                  <div className="h-preview_slides_top_item">
                    <a href="https://google.com" target="_blank" rel="noreferrer">
                      <span>
                        <img src={img} alt="slide" />
                      </span>
                      <span className="h-preview_slides_top_item-title">
                        Benefits of using Binance Smart Chain over Ethereum for Bot Planet NFT.
                      </span>
                      <span className="h-preview_slides_top_item-more">
                        Read more
                      </span>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
});

export default Preview;
