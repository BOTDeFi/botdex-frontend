import { FC } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { bitget, bitmart, Pancakeswap } from '@/assets/img/sections';

import s from './styles.module.scss';

interface IFooterDropDown {
  onClose: () => void;
}

const FooterDropDown: FC<IFooterDropDown> = ({ onClose }) => {
  const handleCloseModal = (event: any) => {
    const btnAll = document.querySelector('.btnBot');
    const btnImg = document.querySelector('.btnBotImg');
    if (event.target === btnAll || event.target === btnImg) return;
    onClose();
  };
  return (
    <OutsideClickHandler onOutsideClick={handleCloseModal}>
      <div className={s.container}>
        <a href="https://www.botpla.net/coming-soon/" target="_blank" rel="noreferrer">
          <img src={Pancakeswap} alt="pancakeswap" />
        </a>
        <a href="https://www.bitget.com/en/spot/BOTUSDT_SPBL" target="_blank" rel="noreferrer">
          <img src={bitget} alt="pancakeswap" />
        </a>
        <a
          href="https://www.bitmart.com/trade/en?layout=basic&symbol=BOT_USDT"
          target="_blank"
          rel="noreferrer"
        >
          <img src={bitmart} alt="pancakeswap" />
        </a>
      </div>
    </OutsideClickHandler>
  );
};

export default FooterDropDown;
