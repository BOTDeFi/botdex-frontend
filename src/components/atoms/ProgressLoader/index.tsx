import { FC } from 'react';

import { Logo } from '@/assets/img/sections';

import s from './ProgressLoader.module.scss';

interface ILoaderProps {
  progress?: number;
}

const ProgressLoader: FC<ILoaderProps> = ({ progress = 1 }) => {
  return (
    <div className={s.loader}>
      <div className={s.loader_progress} style={{ width: `${progress}%` }} />
      <div className={s.loader_body}>
        <img src={Logo} alt="logo" />
      </div>
    </div>
  );
};

export default ProgressLoader;
