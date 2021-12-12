import React, { useMemo, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowPurple from '@/assets/img/icons/arrow-btn.svg';
import { Button } from '@/components/atoms';
import {
  AprColumn,
  EndsInColumn,
  RecentProfitColumn,
  TotalStakedColumn,
} from '@/components/sections/Pools/TableRow/Columns';
import { useTotalStaked } from '@/hooks/pools/useTotalStaked';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useBlock } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { getRefineryVaultEarnings, getStakingBalance } from '@/store/pools/helpers';
import { useSelectVaultData, useStakedValue } from '@/store/pools/hooks';
import { IPoolFarmingMode, Pool, PoolFarmingMode, Precisions } from '@/types';
import { BIG_ZERO } from '@/utils/constants';
import {
  feeFormatter,
  getBalanceAmount,
  getFullDisplayBalance,
  numberWithCommas,
} from '@/utils/formatters';

import { getAprData, getPoolBlockInfo, useNonAutoVaultEarnings } from '../PoolCard/utils';
import StakeUnstakeButtons from '../StakeUnstakeButtons';
import StakingSection from '../StakingSection';

import DetailsLinks from './DetailsLinks';
import RecentProfit from './RecentProfit';
import TableRowSubtitle from './TableRowSubtitle';
import TableRowTitle from './TableRowTitle';

import './TableRow.scss';

interface ITableRowProps {
  farmMode: IPoolFarmingMode;
  pool: Pool;
  columns: any[];
}

const mockData = {
  currencyToConvert: 'USD',
};

const TableRow: React.FC<ITableRowProps> = observer(({ farmMode, pool, columns }) => {
  const {
    user,
    modals,
    pools: {
      fees: { performanceFee: globalPerformanceFee },
    },
  } = useMst();
  const [currentBlock] = useBlock();
  const {
    shouldShowBlockCountdown,
    // blocksUntilStart,
    // blocksRemaining,
    // hasPoolStarted,
    blocksToDisplay,
  } = getPoolBlockInfo(pool, currentBlock);
  const {
    pricePerFullShare,
    userData: { userShares, refineryAtLastUserAction },
  } = useSelectVaultData();
  const { earningToken, stakingToken, apr, earningTokenPrice, stakingTokenPrice } = pool;
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const [isOpenDetails, setOpenDetails] = useState(false);

  const toggleDetails = () => {
    setOpenDetails((isOpen) => !isOpen);
  };
  const handleToggleDetailsClick = () => {
    toggleDetails();
  };
  const handleToggleDetailsKeyDown = (e: React.KeyboardEvent): void => {
    if (e.repeat) return;
    if (e.key === 'Enter') {
      toggleDetails();
    }
  };

  const performanceFee =
    farmMode === PoolFarmingMode.auto ? Number(feeFormatter(globalPerformanceFee)) : 0;
  const { apr: earningsPercentageToDisplay, autoCompoundFrequency } = getAprData(
    pool,
    performanceFee,
  );

  const { hasStakedValue, stakedValue } = useStakedValue(farmMode, pool);
  const stakingTokenBalance = stakedValue.plus(getStakingBalance(pool));

  const handleOpenRoiModal = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation();
    modals.roi.open({
      isFarmPage: false,
      autoCompoundFrequency,
      performanceFee,
      apr: apr || 0,
      earningTokenSymbol: earningToken.symbol,
      earningTokenPrice: earningTokenPrice || 0,
      stakingTokenSymbol: stakingToken.symbol,
      stakingTokenPrice: Number(stakingTokenPrice),
      stakingTokenBalance: stakingTokenBalance.toString(),
    });
  };

  const { totalStakedBalanceToDisplay } = useTotalStaked(pool, farmMode);

  const stakedValueAsString = useMemo(
    () =>
      getFullDisplayBalance({
        balance: stakedValue,
        decimals: pool.stakingToken.decimals,
        displayDecimals: Precisions.shortToken,
      }).toString(),
    [stakedValue, pool.stakingToken.decimals],
  );

  const { nonAutoVaultEarnings, nonAutoVaultEarningsAsString } = useNonAutoVaultEarnings(pool);

  const collectHandler = () => {
    modals.poolsCollect.open({
      poolId: pool.id,
      farmMode,
      earningTokenSymbol: pool.earningToken.symbol,
      earnings: nonAutoVaultEarningsAsString,
      earningTokenDecimals: Number(pool.earningToken.decimals),
      fullBalance: getFullDisplayBalance({
        balance: nonAutoVaultEarnings,
        decimals: pool.earningToken.decimals,
      }).toString(),
    });
  };

  const hasConnectedWallet = Boolean(user.address);

  const convertedStakedValue = useMemo(() => {
    return new BigNumber(stakedValueAsString).times(refineryUsdPrice);
  }, [stakedValueAsString, refineryUsdPrice]);
  const convertedStakedValueAsString = useMemo(
    () => convertedStakedValue.toFixed(Precisions.fiat),
    [convertedStakedValue],
  );

  const recentProfit = useMemo(() => {
    if (farmMode === PoolFarmingMode.auto) {
      const {
        // hasAutoEarnings,
        autoRefineryToDisplay: autoRefineryVaultRecentProfit,
      } = getRefineryVaultEarnings(
        user.address,
        refineryAtLastUserAction || BIG_ZERO,
        userShares || BIG_ZERO,
        pricePerFullShare || BIG_ZERO,
      );
      return autoRefineryVaultRecentProfit;
    }
    return getBalanceAmount(nonAutoVaultEarnings, pool.earningToken.decimals);
  }, [
    farmMode,
    pricePerFullShare,
    refineryAtLastUserAction,
    user.address,
    userShares,
    nonAutoVaultEarnings,
    pool.earningToken.decimals,
  ]);
  const recentProfitToDisplay = recentProfit.toFixed(Precisions.shortToken);

  const convertedRecentProfit = useMemo(() => {
    return recentProfit * refineryUsdPrice;
  }, [recentProfit, refineryUsdPrice]);
  const convertedRecentProfitToDisplay = convertedRecentProfit.toFixed(Precisions.fiat);

  return (
    <div className="pools-table-row">
      <div
        className="pools-table-row__content"
        onClick={handleToggleDetailsClick}
        onKeyDown={handleToggleDetailsKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="pools-table-row__currencies box-f-ai-c t-box-b">
          <div className="box pools-table-row__currencies-item">
            <img
              src={earningToken.logoURI}
              alt="currency"
              className="pools-table-row__currencies-item-image"
            />
          </div>
          <div className="box">
            <TableRowTitle farmMode={farmMode} tokenEarn={earningToken} />
            <TableRowSubtitle
              farmMode={farmMode}
              tokenEarn={earningToken}
              tokenStake={stakingToken}
            />
          </div>
        </div>
        <RecentProfitColumn
          name={columns[0].name}
          value={recentProfitToDisplay}
          usdValue={convertedRecentProfitToDisplay}
        />
        <AprColumn
          name={columns[1].name}
          value={earningsPercentageToDisplay}
          modalHandler={handleOpenRoiModal}
        />
        <TotalStakedColumn
          value={totalStakedBalanceToDisplay.toString()}
          currencySymbol={stakingToken.symbol}
          onlyDesktop
        />
        <EndsInColumn
          value={shouldShowBlockCountdown ? numberWithCommas(blocksToDisplay) : ''}
          onlyDesktop
        />
        <div className="pools-table-row__item box-f-jc-e box-f">
          <div
            className={classNames('pools-table-row__item--mob t-box-b', {
              'pools-table-row__item--mob_active': isOpenDetails,
            })}
          >
            <img src={ArrowPurple} alt="arrow" />
          </div>
          <div className="pools-table-row__item--pc t-box-none">
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleToggleDetailsClick}
            >
              <span>Details</span>
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
        <div className="pools-table-row__details box-yellow-l">
          <DetailsLinks farmMode={farmMode} pool={pool} />
          {pool.isFinished && !hasStakedValue ? null : (
            <div className="pools-table-row__buttons box-f-ai-c t-box-b">
              <RecentProfit
                farmMode={farmMode}
                tokenStake={stakingToken}
                earnings={recentProfit}
                isFinished={pool.isFinished}
                onCollect={collectHandler}
              />
              <div className="pools-table-row__details-box">
                {hasConnectedWallet && hasStakedValue ? (
                  <>
                    <div className="pools-table-row__details-title text-ssm text-upper text-yellow text-med">
                      {stakingToken.symbol} Staked{' '}
                      {farmMode === PoolFarmingMode.auto && '(compounding)'}
                    </div>
                    <div className="box-f box-f-jc-sb box-f-ai-e">
                      <div className="pools-table-row__details-staked-values-group">
                        <div className="pools-table-row__details-staked-value text-blue-d text-smd">
                          {stakedValueAsString}
                        </div>
                        <div className="text-gray text-smd">
                          ~{convertedStakedValueAsString} {mockData.currencyToConvert}
                        </div>
                      </div>
                      <StakeUnstakeButtons pool={pool} />
                    </div>
                  </>
                ) : (
                  <StakingSection
                    pool={pool}
                    titleClassName="pools-table-row__details-title text-ssm text-upper"
                    buttonProps={{
                      className: 'pools-table-row__details-box-start-staking-button',
                      size: 'lg',
                    }}
                    tokenSymbol={stakingToken.symbol}
                    stakedValue={stakedValue}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
});

export default TableRow;
