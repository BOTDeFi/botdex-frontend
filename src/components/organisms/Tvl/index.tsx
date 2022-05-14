// import React, { VFC } from 'react';
import React, { useState } from 'react';

import { TvlFire, TvlLock } from '@/assets/img/sections';

import s from './Tvl.module.scss';

const Tvl: React.FC = () => {
  // value is the current value;
  // setValue is an updater function;
  // We can also pass an initial value into useState as an argument.
  const [valueTVL, setValueTVL] = useState('0');
  const [valueBurned, setValueBurned] = useState('0');
  const [valueTotalSupply, setValueTotalSupply] = useState('0');
  const [valueCirculationSupply, setValueCirculationSupply] = useState('0');
  const [valueHolders, setValueHolders] = useState('0');

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  fetch('http://apibotplanet.com:5000/api/dashboards/screen1/702635ce-85e4-4ea6-9124-043117eb15e5')
    .then((response3) => {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response3.json();
    })
    .then((data) => {
      // `data` is the parsed version of the JSON returned from the above endpoint.
      // window.console.debug('Blockchain data (TVL, burned, etc)', data);
      const roundedTVL: number = Math.round((data.tvl + Number.EPSILON) * 100) / 100;
      setValueTVL(numberWithCommas(roundedTVL));
      const roundedBurned: number = Math.round((data.burned + Number.EPSILON) * 1000) / 1000;
      setValueBurned(numberWithCommas(roundedBurned));
      const millTotalSupply: number = data.totalSupply / 1000000000000000000 / 1000000;
      const roundedTotalSupply: number = Math.round((millTotalSupply + Number.EPSILON) * 1) / 1;
      setValueTotalSupply(numberWithCommas(roundedTotalSupply).concat('M'));
      const millCirculationSupply: number = data.circulationSupply / 1000000000000000000 / 1000000;
      const roundedCirculationSupply: number =
        Math.round((millCirculationSupply + Number.EPSILON) * 1) / 1;
      setValueCirculationSupply(numberWithCommas(roundedCirculationSupply).concat('M'));
      const milHolders: number = data.holders / 1000;
      const roundedHolders: number = Math.round((milHolders + Number.EPSILON) * 1) / 1;
      setValueHolders(numberWithCommas(roundedHolders).concat('K+'));
      return data;
    })
    .catch((error) => {
      window.console.log('Fetch blockchain data error (TVL, burned, etc)', error);
    });

  return (
    <div className={s.tvl}>
      <div className={s.tvlTop}>
        <div className={s.tvlTop__item}>
          <div className={s.tvlTop__itemIco}>
            <img src={TvlLock} alt="" />
          </div>
          <div className={s.tvlTop__itemInfo}>
            <span className={s.value}>${valueTVL}</span>
            <span className={s.text}>Total Value Locked (TVL)</span>
          </div>
        </div>
        <div className={s.tvlTop__div}>.</div>
        <div className={s.tvlTop__item}>
          <div className={s.tvlTop__itemIco}>
            <img src={TvlFire} alt="" />
          </div>
          <div className={s.tvlTop__itemInfo}>
            <span className={s.value}>{valueBurned}</span>
            <span className={s.text}>Number of tokens burned</span>
          </div>
        </div>
      </div>
      <div className={s.tvlBottom}>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>Total supply</span>
          <span className={s.value}>{valueTotalSupply}</span>
        </div>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>Circulation supply</span>
          <span className={s.value}>{valueCirculationSupply}</span>
        </div>
        <div className={s.tvlBottom__item}>
          <span className={s.text}>Holders</span>
          <span className={s.value}>{valueHolders}</span>
        </div>
      </div>
    </div>
  );
};

export default Tvl;
