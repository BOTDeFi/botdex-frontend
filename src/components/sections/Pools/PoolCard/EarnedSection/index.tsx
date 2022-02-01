import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { Skeleton } from '@/components/atoms';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { IPoolFarmingMode, Pool, Precisions } from '@/types';
import { getFullDisplayBalance } from '@/utils/formatters';

import CollectButton from '../../CollectButton';
import { useNonAutoVaultEarnings } from '../utils';

interface IEarnedSectionProps {
  className?: string;
  farmMode: IPoolFarmingMode;
  pool: Pool;
}

const EarnedSection: React.FC<IEarnedSectionProps> = observer(({ pool, farmMode }) => {
  const { user, modals } = useMst();

  const { id: poolId, earningToken, isFinished } = pool;
  const { nonAutoVaultEarnings, nonAutoVaultEarningsAsString } = useNonAutoVaultEarnings(pool);
  const { tokenUsdPrice: refineryUsdPrice } = useRefineryUsdPrice();

  const collectHandler = () => {
    modals.poolsCollect.open({
      isOpen: true,
      poolId,
      farmMode,
      earningTokenSymbol: earningToken.symbol,
      earnings: nonAutoVaultEarningsAsString,
      earningTokenDecimals: Number(earningToken.decimals),
      fullBalance: getFullDisplayBalance({
        balance: nonAutoVaultEarnings,
        decimals: earningToken.decimals,
      }).toString(),
    });
  };

  const nonAutoVaultEarningsToDisplay = useMemo(
    () =>
      getFullDisplayBalance({
        balance: nonAutoVaultEarnings,
        decimals: earningToken.decimals,
        displayDecimals: Precisions.shortToken,
      }),
    [nonAutoVaultEarnings, earningToken.decimals],
  );

  const convertedNonAutoVaultEarnings = useMemo(() => {
    return nonAutoVaultEarnings.times(refineryUsdPrice);
  }, [nonAutoVaultEarnings, refineryUsdPrice]);

  const convertedNonAutoVaultEarningsToDisplay = useMemo(
    () =>
      getFullDisplayBalance({
        balance: convertedNonAutoVaultEarnings,
        decimals: earningToken.decimals,
        displayDecimals: Precisions.fiat,
      }),
    [convertedNonAutoVaultEarnings, earningToken.decimals],
  );

  if (isFinished && nonAutoVaultEarnings.eq(0)) {
    return null;
  }

  const isNonAutoVaultEarningsLoading = nonAutoVaultEarnings.isNaN();

  const hasConnectedWallet = Boolean(user.address);

  if (hasConnectedWallet) {
    return (
      <div className="p-card__earned box-f box-f-jc-sb">
        <div>
          <div className="text-smd text-black">{earningToken.symbol} Earned</div>
          <div className="p-card__earned-profit-value text-blue-d text-smd">
            {isNonAutoVaultEarningsLoading ? (
              <Skeleton.Input style={{ width: 60 }} size="small" active />
            ) : (
              nonAutoVaultEarningsToDisplay
            )}
          </div>
          <div className="text-gray text-smd">
            ~
            {isNonAutoVaultEarningsLoading ? (
              <Skeleton.Input style={{ width: 40 }} size="small" active />
            ) : (
              convertedNonAutoVaultEarningsToDisplay
            )}
            USD
          </div>
        </div>
        {!isFinished && (
          <CollectButton
            farmMode={farmMode}
            value={nonAutoVaultEarnings.toNumber()}
            collectHandler={collectHandler}
          />
        )}
      </div>
    );
  }

  return null;
});

export default EarnedSection;
