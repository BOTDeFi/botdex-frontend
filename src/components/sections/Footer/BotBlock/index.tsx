import { useCallback, useState, VFC } from 'react';
import cn from 'classnames';

import { ArrowTopWhite, BotLittle, Cap, Geko, Scaner } from '@/assets/img/sections';
import { FooterDropDown } from '@/components/organisms';

import s from './BotBlock.module.scss';
import { PriceBotData } from '@/hooks/useFetchPriceBot';

const BotBlock: VFC<{ priceBotData: PriceBotData | null }> = ({ priceBotData }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleChangeModalVisible = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);


  return (
    <div className={s.bot}>
      <img src={BotLittle} alt="" />
      <div className={s.bot_price}>$BOT: ${priceBotData?.price.toFixed(5) || 'updating'}</div>
      <a href="https://coinmarketcap.com/currencies/bot-planet/" target="_blank" rel="noreferrer">
        <img src={Cap} alt="cap" className={s.bot_cap} />
      </a>
      <a href="https://www.botpla.net/coming-soon/" target="_blank" rel="noreferrer">
        <img src={Geko} alt="geko" />
      </a>
      <a
        href="https://bscscan.com/address/0x1ab7e7deda201e5ea820f6c02c65fce7ec6bed32#code"
        target="_blank"
        rel="noreferrer"
      >
        <img src={Scaner} alt="scaner" className={s.bot_scaner} />
      </a>
      <button
        type="button"
        className={cn(s.btn, s.btnHoverDown, { [s.isOpen]: isModalVisible }, 'btnBot')}
        onClick={handleChangeModalVisible}
      >
        <span>
          Buy $BOT
          <img
            src={ArrowTopWhite}
            alt="arrow"
            className={cn({ [s.rotate]: isModalVisible }, 'btnBotImg')}
          />
        </span>
      </button>
      {isModalVisible && <FooterDropDown onClose={() => setModalVisible(false)} />}
    </div>
  );
};

export default BotBlock;
