/* eslint-disable */
import { FC, ReactNode } from 'react';
import cn from 'classnames';
import SwiperCore, { Keyboard, Mousewheel, Navigation, SwiperOptions } from 'swiper';
import { Swiper as SwiperSlider } from 'swiper/react/swiper-react';

import { SliderArrow } from '@/assets/img/sections';
// import { ArrowLeft, ArrowRight } from '@/assets/img/sections';

import 'swiper/swiper.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/navigation/navigation.scss';
import './Swiper.scss';

interface ISwiperItems extends SwiperOptions {
  children: ReactNode;
  className?: string;
  nav?: boolean;
}

const Swiper: FC<ISwiperItems> = ({ children, className, nav = false, ...props }) => {
  SwiperCore.use([Navigation, Keyboard, Mousewheel]);

  const navigation = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  };
  return (
    <SwiperSlider
      {...props}
      mousewheel
      className={cn('swiper', className)}
      direction="horizontal"
      navigation={nav ? navigation : false}
    >
      {nav && (
        <div className="swiper-button-prev">
          <div className="swiper_btn">
            <div className="swiper_btn_left">
              <img src={SliderArrow} alt="left" />
            </div>
          </div>
        </div>
      )}
      {children}
      {nav && (
        <div className="swiper-button-next">
          <div className="swiper_btn">
            <div className="swiper_btn_right">
              <img src={SliderArrow} alt="right" />
            </div>
          </div>
        </div>
      )}
    </SwiperSlider>
  );
};
export default Swiper;
