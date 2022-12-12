import { FC } from 'react';
import cn from 'classnames';

import { Bot, CalcWhite, Lock } from '@/assets/img/sections';
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

  let token0img = token0?.img;
  if (token0 !== undefined && token0.symbol === 'BOT' && (token0.img === undefined || token0.img === null || token0.img.length === 0)) {
    token0img = "https://assets.coingecko.com/coins/images/24650/small/McLc4iA.png?1648612075";
  }

  let token1img = token1?.img;
  if (token1 !== undefined && token1.symbol === 'BOT' && (token1.img === undefined || token1.img === null || token1.img.length === 0)) {
    token1img = "https://assets.coingecko.com/coins/images/24650/small/McLc4iA.png?1648612075";
  }

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
              <img src={token0img} alt="icon" />
              <img src={token1img} alt="icon" />
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
            <Button colorScheme="icon" icon={CalcWhite} onClick={handleScrollTop} link="/farms/calc" />
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
        colorScheme="pink"
        size="sm"
        className="table-card_btn btn-hover-down"
      >
        {content ? 'Start Staking' : 'Start Farm'}
      </Button>
    </div>
  );
};

export default TableCard;
