import { FC } from 'react';
import cn from 'classnames';

import { Bot, Calc, Lock } from '@/assets/img/sections';
import { Button } from '@/components/atoms';
import { useMst } from '@/store';
import { handleScrollTop } from '@/utils/scrollTop';

import './TableCard.scss';

type IToken = {
  symbol: string;
  img: string;
};

interface ITableCard {
  token0?: IToken;
  token1?: IToken;
  content?: string;
  apy: string;
  className?: string;
  id: number;
}

const TableCard: FC<ITableCard> = ({ token0, token1, apy, content, className, id }) => {
  const { modals } = useMst();
  const handleOpenStakingModal = () => {
    modals.stakeUnstake.open(id);
    handleScrollTop();
  };

  return (
    <div className={cn('table-card', className)}>
      <div className="table-card_name">
        <div className={token1 ? 'table-card_name-images_pair' : 'table-card_name-images'}>
          {content ? (
            <>
              <img src={Bot} alt="icon" />
              <img src={Lock} alt="lock" />
            </>
          ) : (
            <>
              <img src={token0?.img} alt="icon" />
              <img src={token1?.img} alt="icon" />
            </>
          )}
        </div>
        <div className="table-card_name_text">
          {content ? (
            <>
              {content}
              <span>Stake BOT - Earn BOT</span>
            </>
          ) : (
            <>
              {token0?.symbol}/ {token1?.symbol}
            </>
          )}
        </div>
      </div>
      <div className="table-card_apy">
        <div className="table-card_apy-title">
          <span>{content ? 'APR' : 'APY'}</span>
          {!content && (
            <Button colorScheme="icon" icon={Calc} onClick={handleScrollTop} link="/farms/calc" />
          )}
        </div>
        <div className="table-card_apy-value">
          <span>{apy}%</span>
          {/* <img src={Question} alt="icon" /> */}
        </div>
      </div>
      <Button
        link={content ? '/staking' : '/farms'}
        onClick={handleOpenStakingModal}
        colorScheme="purple-light"
        size="sm"
        className="table-card_btn"
      >
        {content ? 'Start Staking' : 'Start Farm'}
      </Button>
    </div>
  );
};

export default TableCard;
