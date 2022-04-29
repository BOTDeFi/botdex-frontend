import { FC } from 'react';

import { ShadowTitle } from '@/components/atoms';

import { featuresItems } from '../Home.mock';

import FeatureCard from './FeatureCard';

import './Features.scss';

const Features: FC = () => {
  return (
    <div className="features">
      <div className="features_body">
        <div className="features_body_content">
          <ShadowTitle type="h1">Unique features</ShadowTitle>
          <div className="features_body_content_cards">
            {featuresItems.map(({ title, text, img }) => {
              return <FeatureCard key={title} title={title} text={text} img={img} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
