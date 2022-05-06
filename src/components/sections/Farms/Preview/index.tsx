import React from 'react';

import './Preview.scss';

const Preview: React.FC = React.memo(() => {
  return (
    <div className="farms-preview">
      <div className="farms-preview-box">
        <h1 className="farms-preview__title h1-lg text-bold">Farms</h1>
        <div className="farms-preview__descr">Farm season with high yield</div>
        <div className="farms-preview__subtitle">Stake Liquidity Pool (LP) tokens to earn.</div>
      </div>
    </div>
  );
});

export default Preview;
