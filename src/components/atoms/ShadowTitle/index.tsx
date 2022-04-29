import { FC } from 'react';
import { ReactNode } from 'react-markdown/lib/react-markdown';
import cn from 'classnames';

import s from './ShadowTitle.module.scss';

interface IShadowTitle {
  type: 'h1' | 'h2' | 'h1Max';
  children: ReactNode;
  color?: 'white' | 'purple';
}

const ShadowTitle: FC<IShadowTitle> = ({ type, color = 'white', children }) => {
  const innerText = (
    <>
      <span>{children}</span>
      <span>{children}</span>
    </>
  );

  let Title;
  switch (type) {
    case 'h1':
      Title = <h1 className={cn(s.title, s[color])}>{innerText}</h1>;
      break;
    case 'h2':
      Title = <h2 className={cn(s.title, s[color])}>{innerText}</h2>;
      return Title;
    case 'h1Max':
      Title = <h1 className={cn(s.titleMax, s[color])}>{innerText}</h1>;
      return Title;
    default:
      Title = <h2 className={cn(s.title, s[color])}>{innerText}</h2>;
      return Title;
  }
  return <>{Title}</>;
};

export default ShadowTitle;
