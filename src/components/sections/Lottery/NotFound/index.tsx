import React from 'react';

import { ReactComponent as LupaImg } from '../../../../assets/img/icons/lupa.svg';

import './NotFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="lottery-not-found box-shadow box-white box-f box-f-fd-c box-f-ai-c">
      <LupaImg />
      <div className="text-md text-yellow lottery-not-found__text">No Results Found</div>
    </div>
  );
};

export default NotFound;
