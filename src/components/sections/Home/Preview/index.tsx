/* eslint-disable */
import { useCallback, useEffect, useState, VFC } from 'react';
import { observer } from 'mobx-react-lite';
import { SwiperSlide } from 'swiper/react/swiper-react';
import useMedia from 'use-media';
import { v1 as uuid } from 'uuid';

import { Button, ShadowTitle, Swiper } from '@/components/atoms';
import { Graph } from '@/components/molecules';
import { BOT_BNB_ADDRESS } from '@/config';
import useGetOptions from '@/hooks/home/useGetOptions';
import { useGetHoursPairs, useGetPair } from '@/services/api/refinery-finance-pairs';
import { useMst } from '@/store';

import { CurrencyInfo } from '../../Graph';
import { slides } from '../Home.mock';

import ValueCard from './ValueCard';

import './Preview.scss';
import { IBlogType } from '@/types';
import { getBlogs } from '@/utils/getBlogs';
import { Comet, Alien } from '@/assets/img/sections';
import { PriceBotData } from '@/hooks/useFetchPriceBot';

const Preview: VFC<{ priceBotData: PriceBotData | null }> = observer(({ priceBotData }) => {
  const { pairs } = useMst();
  const isWide = useMedia({ minWidth: '1412px' });
  const isMobile = useMedia({ minWidth: '769px' });
  const isUltraWide = useMedia({ minWidth: '2100px' });

  const [data, setData] = useState(pairs.getFormattedPoints());
  const [reversed, setReversed] = useState(false);
  const [currentStamp] = useState<number>(0);
  const [currencyData, setCurrencyData] = useState<any>(null);
  const [blogs, setBlogs] = useState<IBlogType[]>([]);

  const options = useGetOptions(currentStamp);

  const onGraphHovered = useCallback(
    (events: any, chartContext: any, config: any) => {
      if (pairs.currentPairData.points.length !== 0 && config.dataPointIndex !== -1) {
        setCurrencyData(pairs.getFormattedCurrentPair(config.dataPointIndex, reversed));
      }
    },
    [pairs, reversed],
  );

  const onReverseClick = useCallback(() => {
    setReversed(!reversed);
  }, [reversed]);

  const handleGetPairData = useCallback(async () => {
    const getPair = useGetPair();
    const getPairData = useGetHoursPairs();

    const response = await getPair(BOT_BNB_ADDRESS);
    const pairData = (await getPairData(24, BOT_BNB_ADDRESS)).pairHourDatas;
    if (response.pairs.length > 0) {
      pairs.setPair(response.pairs[0]);
      pairs.setCurrentPairData(BOT_BNB_ADDRESS, pairData);
      setData(pairs.getFormattedPoints());
    }
  }, [pairs]);

  const handleRequestBlogs = useCallback(() => {
    getBlogs().then((data) => {
      setBlogs(data);
    });
  }, []);

  useEffect(() => {
    handleGetPairData();
    handleRequestBlogs();
    setData(pairs.getFormattedPoints());
    if (pairs.currentPairData.points.length !== 0) {
      setCurrencyData(pairs.getFormattedCurrentPair(0, reversed));
    }
  }, [currentStamp, pairs.currentPairData.points.length, pairs, reversed, handleGetPairData]);

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
              className="h-preview_top-left_btn"
              colorScheme="pink"
              size="smd"
            >
              Trade Now
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
              {currencyData && <CurrencyInfo {...currencyData} onSwapClick={onReverseClick} />}
            </div>
            <Graph
              className="home-graph"
              id="exchange-graph"
              series={data}
              options={options}
              onHovered={onGraphHovered}
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
