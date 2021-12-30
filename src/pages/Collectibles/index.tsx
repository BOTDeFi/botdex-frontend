import React from 'react';

import { CollectiblesCard, CollectiblesPreview } from '../../components/sections/Collectibles';

import './Collectibles.scss';

const Collectibles: React.FC = () => {
  const cards = [
    {
      name: 'Mixie v1',
    },
    {
      name: 'Mixie v2',
    },
  ];
  return (
    <main className="collectibles">
      <div className="row">
        <CollectiblesPreview />
        <div className="collectibles__content box-f">
          {cards.map(() => (
            <CollectiblesCard />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Collectibles;
