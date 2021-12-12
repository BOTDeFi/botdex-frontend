import React from 'react';

import './Preview.scss';

const Prevew: React.FC = () => {
  return (
    <div className="teams-preview">
      <div className="teams-preview__title h1-md text-white text-bold">Teams & Profiles</div>
      <div className="text text-white teams-preview__subtitle">
        Show off your stats and collectibles with your unique profile. Team features will be
        revealed soon!
      </div>
    </div>
  );
};

export default Prevew;
