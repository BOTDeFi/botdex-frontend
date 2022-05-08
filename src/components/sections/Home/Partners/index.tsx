/* eslint-disable */
import { FC } from 'react';
import { SwiperSlide } from 'swiper/react/swiper-react';
import useMedia from 'use-media';

import { ShadowTitle, Swiper } from '@/components/atoms';

import { backersItems, partnersCardItems, partnersSwiperItems } from '../Home.mock';

import PartnersCard from './PartnersCard';

import './Partners.scss';

const Partners: FC = () => {
  const isMomile = useMedia({ minWidth: '769px' });
  const isUltraWide = useMedia({ minWidth: '2100px' });

  return (
    <div className="partners">
      <div className="partners_body">
        <div className="partners_body_row">
          <div className="partners_body_row_title">
            <ShadowTitle type="h1">As featured in</ShadowTitle>
            <span>
              Read more about the accomplishments of BotSwap on the most reputable crypto resources.
            </span>
          </div>

          <Swiper
            spaceBetween={10}
            slidesPerView={isUltraWide ? 3 : isMomile ? 2 : 1}
            keyboard
            nav
            loop
            className="partners_body_row_slider"
          >
            {partnersSwiperItems.map(({ img, id }) => (
              <SwiperSlide key={id}>
                <PartnersCard inSwiper img={img} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="partners_body_grid mt-first-grid">
          <div className="partners_body_grid_content">
            <ShadowTitle type="h1">Bot planet Partners</ShadowTitle>
            <div className="partners_body_grid_content_cards">
              {partnersCardItems.map(({ img }) => (
                <PartnersCard key={img} img={img} />
              ))}
            </div>
          </div>
        </div>

        <div className="partners_body_grid">
          <div className="partners_body_grid_content">
            <ShadowTitle type="h1">Backers</ShadowTitle>
            <div className="partners_body_grid_content_cards">
              {backersItems.map(({ img }) => (
                <PartnersCard key={img} img={img} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
