import React from 'react';

import './WinNumber.scss';

interface IWinNumber {
  winNumber: number;
}

const WinNumber: React.FC<IWinNumber> = React.memo(({ winNumber }) => {
  return (
    <div className="win-number box-f-c box-yellow">
      <span className="text-med text-white">{winNumber}</span>
    </div>
  );
});

export default WinNumber;
