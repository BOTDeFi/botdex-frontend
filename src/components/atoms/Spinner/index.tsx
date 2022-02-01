import React from 'react';

import s from './Spinner.module.scss';

const Spinner: React.FC = () => {
  return <div className={s.loader}>Loading...</div>;
};

export default Spinner;
