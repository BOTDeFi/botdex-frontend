import { FC } from 'react';

import './FeatureCard.scss';

interface IFeatureCard {
  [k: string]: string;
}

const FeatureCard: FC<IFeatureCard> = ({ title, img, text }) => {
  return (
    <div
      className="feature-card"
      style={{ background: `url(${img}) left no-repeat, rgba(8, 9, 64, 1) center` }}
    >
      <div className="feature-card_title">{title}</div>
      <div className="feature-card_text">{text}</div>
    </div>
  );
};

export default FeatureCard;
