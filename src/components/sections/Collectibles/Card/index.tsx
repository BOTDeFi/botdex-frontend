import React from 'react';

import CardImg from '@/assets/img/sections/collectibles/card.svg';

import { Button } from '../../../atoms';

import './Card.scss';

const Card: React.FC = () => {
  const [isDetailsOpen, setDetailsOpen] = React.useState<boolean>(false);
  return (
    <div className="collectibles-card">
      <div className="collectibles-card__img box-f-c">
        <img src={CardImg} alt="" />
      </div>
      <div className="collectibles-card__content">
        <div className="text-center text-md text-bold text-black">Mixie v1</div>
        <Button
          colorScheme="outline-purple"
          arrow
          className="collectibles-card__btn"
          size="smd"
          toggle
          isActive={isDetailsOpen}
          onToggle={(value) => setDetailsOpen(value)}
        >
          <span className="text-sm text-med">Details</span>
        </Button>
      </div>
    </div>
  );
};

export default Card;
