import React from 'react';

// import { LogoMd, LogoTextMd } from '@/assets/img';
// import { ReactComponent as LogoMd } from '@/assets/img/icons/logo_md.svg';
// import { ReactComponent as LogoTextMd } from '@/assets/img/icons/logo_text_md.svg';
// import mothership from '@/assets/img/mothership.png';
import { ShadowTitle } from '@/components/atoms';

import s from './ComingSoon.module.scss';

const ComingSoon: React.FC = () => {
  return (
    <div className={s.coming_soon_wrapper}>
      {/* <div className={s.logo_wrapper}>
        <LogoMd />
        <LogoTextMd />
      </div> */}
      <div className={s.coming_soon}>
        {/* <img src={mothership} alt="" /> */}
        <div className={s.title}>
          <ShadowTitle type="h1Max">Coming Soon</ShadowTitle>
        </div>
        {/* <div className={s.title}>Coming Soon</div> */}
      </div>
    </div>
  );
};

export default ComingSoon;
