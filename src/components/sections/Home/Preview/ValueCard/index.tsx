import { FC } from 'react';

import './ValueCard.scss';

interface IValueCard {
  title: string;
  img: string;
  type: string;
  value: number | string;
}

const ValueCard: FC<IValueCard> = ({ value, title, img, type }) => {
  return (
    <div className="v-card">
      <img src={img} alt="icon" className={type} />
      <div>
        <h3>{title}</h3>
        {/* <span>{typeof value === 'number' ? `${value / 1000000} M` : value}</span> */}
        <span>{value} M</span>
      </div>
    </div>
  );
};

export default ValueCard;
