import React from 'react';
import { CSSTransition } from 'react-transition-group';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import BnbImg from '@/assets/img/currency/bnb.svg';
import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import CalcImg from '@/assets/img/icons/calc.svg';
import { Button } from '@/components/atoms';
import { tokens } from '@/config/tokens';
import { useLpTokenPrice } from '@/hooks/farms/useFarmsPrices';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { FarmWithStakedValue, Precisions, Token } from '@/types';
import { getBalanceAmount, numberWithCommas } from '@/utils/formatters';
import { clog } from '@/utils/logger';

import { LiquidityPopover, MultiplierPopover } from '../Popovers';

import DetailsActionsSection from './DetailsActionsSection';
import DetailsEarnedSection from './DetailsEarnedSection';
import DetailsLinks from './DetailsLinks';
import { EARNING_TOKEN_SYMBOL } from './utils';

import './TableRow.scss';

interface ITableRowProps {
  farm: FarmWithStakedValue;
}

interface ITokensPairProps {
  lpSymbol: string;
  token: Token;
  quoteToken: Token;
}

const TokensPair: React.FC<ITokensPairProps> = ({ lpSymbol, token, quoteToken }) => {
  return (
    <div className="farms-table-row__currencies box-f-ai-c t-box-b">
      <div className="farms-table-row__currencies-pair box-f">
        <img
          className="farms-table-row__currencies-pair-item"
          src={quoteToken.logoURI}
          alt="currency"
        />
        <img className="farms-table-row__currencies-pair-item" src={token.logoURI} alt="currency" />
      </div>
      <div className="text-upper text-smd">{lpSymbol}</div>
    </div>
  );
};

const TableRow: React.FC<ITableRowProps> = observer(({ farm }) => {
  const { modals } = useMst();
  const [isOpenDetails, setOpenDetails] = React.useState<boolean>(false);

  const toggleDetails = () => {
    setOpenDetails((isOpen) => !isOpen);
  };
  const handleToggleDetailsClick = () => {
    toggleDetails();
  };
  const handleToggleDetailsKeyDown = (e: React.KeyboardEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    if (e.repeat) return;
    if (e.key === 'Enter') {
      toggleDetails();
    }
  };

  const { lpSymbol } = farm;
  const [lpSymbolWithoutLPString] = lpSymbol.split(' ');

  const { userData, token, quoteToken, multiplier, liquidity, apr = 0 } = farm;
  const { earnings = '0', stakedBalance = '0', tokenBalance = '0' } = userData || {};
  const earningsToDisplay = getBalanceAmount(new BigNumber(earnings), tokens.rp1.decimals).toFixed(
    Precisions.shortToken,
  );

  const { tokenUsdPrice: earningTokenPrice } = useRefineryUsdPrice();
  const stakingTokenPriceAsBN = useLpTokenPrice(lpSymbol);
  clog(earningTokenPrice, stakingTokenPriceAsBN.toString());
  const stakingTokenBalance = new BigNumber(stakedBalance)
    .plus(new BigNumber(tokenBalance))
    .toString();

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    modals.roi.open({
      isFarmPage: true,
      autoCompoundFrequency: 0, // is not used for farms
      performanceFee: 0, // is not used for farms
      apr,
      earningTokenSymbol: tokens.rp1.symbol,
      earningTokenPrice,
      stakingTokenSymbol: lpSymbol,
      stakingTokenPrice: stakingTokenPriceAsBN.toNumber(),
      stakingTokenBalance,
    });
  };

  const liquidityToDisplay = numberWithCommas(Number(liquidity?.toFixed(Precisions.fiat)) || 0);

  return (
    <div className="farms-table-row">
      <div
        className="farms-table-row__content"
        onClick={handleToggleDetailsClick}
        onKeyDown={handleToggleDetailsKeyDown}
        role="button"
        tabIndex={0}
      >
        <TokensPair lpSymbol={lpSymbolWithoutLPString} token={token} quoteToken={quoteToken} />
        <div className="farms-table-row__earned text-gray-2 text-smd ">
          <div className="farms-table-row__extra-text text-gray-2 text-ssm t-box-b">Earned</div>
          <span>{earningsToDisplay}</span>
        </div>
        <div className="farms-table-row__apr box-f-ai-c text-smd farms-table-row__item t-box-b">
          <div className="farms-table-row__extra-text text-gray-2 text-ssm t-box-b">APR</div>
          <span className="farms-table-row__text-md">
            {Number(apr).toFixed(2).replace('.', ',')}%
          </span>
          <div
            className="farms-table-row__apr-button"
            onClick={handleOpenRoiModal}
            onKeyDown={handleOpenRoiModal}
            role="button"
            tabIndex={0}
          >
            <img src={CalcImg} alt="calc" />
          </div>
        </div>
        <div className="farms-table-row__liquidity farms-table-row__item box-f-ai-c text-smd t-box-none">
          <span className="farms-table-row__text text-500">${liquidityToDisplay}</span>
          <LiquidityPopover />
        </div>
        <div className="farms-table-row__multiplier farms-table-row__item box-f-ai-c text-smd t-box-none">
          <span className="farms-table-row__text-md text-500">{multiplier}</span>
          <MultiplierPopover symbol={EARNING_TOKEN_SYMBOL} />
        </div>
        <div className="farms-table-row__item box-f-jc-e box-f">
          <div
            className={classNames('farms-table-row__item--mob t-box-b', {
              'farms-table-row__item--mob_active': isOpenDetails,
            })}
          >
            <img src={ArrowPurple} alt="arrow" />
          </div>
          <div className="farms-table-row__item--pc t-box-none">
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleToggleDetailsClick}
            >
              <span className="farms-table-row__details-wrapper">Details</span>
            </Button>
          </div>
        </div>
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <div className="farms-table-row__details">
          <DetailsLinks farm={farm} />
          <div className="farms-table-row__buttons box-f-ai-c t-box-b">
            <DetailsEarnedSection farm={farm} />
            <DetailsActionsSection farm={farm} />
          </div>
        </div>
      </CSSTransition>
    </div>
  );
});

export default TableRow;
