import { TvlFire, TvlLock } from '@/assets/img/sections';
import { VFC } from 'react';

import s from './Tvl.module.scss';


const Tvl: VFC = () => {
  return (
    <div className={s.tvl}>
      <div className={s.tvlTop}>
        <div className={s.tvlTop__item}>
          <div className={s.tvlTop__itemIco}>
            <img src={TvlLock} alt="" />
          </div>
          <div className={s.tvlTop__itemInfo}>
            <span className={s.value}>
              $1,489,895.966
            </span>
            <span className={s.text}>
              Total Value Locked (TVL)
            </span>
          </div>
        </div>
        <div className={s.tvlTop__div}>.</div>
        <div className={s.tvlTop__item}>
          <div className={s.tvlTop__itemIco}>
            <img src={TvlFire} alt="" />
          </div>
          <div className={s.tvlTop__itemInfo}>
            <span className={s.value}>
              2,178,941.932
            </span>
            <span className={s.text}>
              Number of tokens buned
            </span>
          </div>
        </div>
      </div>
      <div className={s.tvlBottom}>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>
            Total supply
          </span>
          <span className={s.value}>
            100M
          </span>
        </div>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>
            Circulation supply
          </span>
          <span className={s.value}>
            98M
          </span>
        </div>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>
            Holders
          </span>
          <span className={s.value}>
            11K+
          </span>
        </div>
      </div>
    </div>
  );
};

export default Tvl;
