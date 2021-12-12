import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { Skeleton } from '@/components/atoms';
import OpenLink from '@/components/sections/Pools/OpenLink';
import { getPoolBlockInfo } from '@/components/sections/Pools/PoolCard/utils';
import { TotalStakedPopover } from '@/components/sections/Pools/Popovers';
import { useTotalStaked } from '@/hooks/pools/useTotalStaked';
import { useScannerUrl } from '@/hooks/useScannerUrl';
import { getAddress, getContractAddress } from '@/services/web3/contractHelpers';
import { useBlock } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { IPoolFarmingMode, Pool, PoolFarmingMode } from '@/types';
import { feeFormatter, numberWithCommas } from '@/utils/formatters';

const CardDetails: React.FC<{ type: IPoolFarmingMode; pool: Pool }> = observer(({ pool, type }) => {
  const {
    pools: {
      fees: { performanceFee },
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
  const { earningToken, stakingToken } = pool;
  const seeTokenInfoLink = useScannerUrl(`token/${getAddress(earningToken.address)}`);
  const viewContractLink = useScannerUrl(
    `address/${
      type === PoolFarmingMode.auto
        ? getContractAddress('REFINERY_VAULT')
        : getAddress(pool.contractAddress)
    }`,
  );

  const { totalStakedBalance, totalStakedBalanceToDisplay } = useTotalStaked(pool, type);

  const performanceRow = useMemo(() => {
    return type === PoolFarmingMode.auto
      ? [
          {
            title: 'Performance Fee:',
            value: <>{feeFormatter(performanceFee)}%</>,
          },
        ]
      : [];
  }, [performanceFee, type]);

  const endsInRow = useMemo(() => {
    return shouldShowBlockCountdown
      ? [
          {
            title: 'Ends in:',
            value: (
              <>
                <span>{numberWithCommas(blocksToDisplay)} blocks</span>
                {/* TODO: copy/paste value like in table row */}
              </>
            ),
          },
        ]
      : [];
  }, [shouldShowBlockCountdown, blocksToDisplay]);
  const items = useMemo(() => {
    return [
      {
        title: 'Total staked:',
        value: (
          <>
            {totalStakedBalance ? (
              <span>{totalStakedBalanceToDisplay}</span>
            ) : (
              <Skeleton.Input style={{ width: 60 }} size="small" active />
            )}
            <TotalStakedPopover symbol={stakingToken.symbol} />
          </>
        ),
      },
      ...performanceRow,
      ...endsInRow,
    ];
  }, [
    endsInRow,
    performanceRow,
    stakingToken.symbol,
    totalStakedBalance,
    totalStakedBalanceToDisplay,
  ]);
  const links = [
    {
      href: earningToken.address ? seeTokenInfoLink : '',
      text: 'See Token Info',
    },
    {
      href: earningToken.projectLink,
      text: 'View Project Site',
    },
    {
      href: viewContractLink,
      text: 'View Contract',
    },
  ];
  return (
    <div className="p-card__details">
      {items.map(({ title, value }) => {
        return (
          <div key={title} className="p-card__details-item box-f-ai-c box-f-jc-sb ">
            <div className="p-card__details-item-name text-black text-med">{title}</div>
            <div className="p-card__details-item-value text-smd box-f-ai-c">{value}</div>
          </div>
        );
      })}
      {links.map(({ href, text }) => (
        <OpenLink key={href + text} className="p-card__details-item" href={href} text={text} />
      ))}
    </div>
  );
});

export default CardDetails;
