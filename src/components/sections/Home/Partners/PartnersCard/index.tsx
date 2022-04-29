import { FC } from 'react';
import cn from 'classnames';

import './PartnersCard.scss';

type CardProps = {
  img: string;
  inSwiper?: boolean;
};

const PartnersCard: FC<CardProps> = ({ img, inSwiper = false }) => {
  return (
    <div className={cn('partners-card', { inSwiper })}>
      <img src={img} alt="icon" />
    </div>
  );
};

export default PartnersCard;
