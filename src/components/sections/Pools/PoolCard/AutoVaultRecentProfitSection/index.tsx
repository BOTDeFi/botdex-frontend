import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/store';
import { getRefineryVaultEarnings } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { Precisions } from '@/types';
import { BIG_ZERO } from '@/utils/constants';

import TextUnstakingFee from '../TextUnstakingFee';

import UnstakingFeeTimer from './UnstakingFeeTimer';

interface IAutoVaultRecentProfitSectionProps {
  hasStakedValue: boolean;
  stakingTokenSymbol: string;
}

const AutoVaultRecentProfitSection: React.FC<IAutoVaultRecentProfitSectionProps> = observer(
  ({ hasStakedValue, stakingTokenSymbol }) => {
    const { user } = useMst();

    const {
      pricePerFullShare,
      userData: { userShares, refineryAtLastUserAction },
    } = useSelectVaultData();

    const {
      // hasAutoEarnings,
      autoRefineryToDisplay: autoRefineryVaultRecentProfit,
    } = getRefineryVaultEarnings(
      user.address,
      refineryAtLastUserAction || BIG_ZERO,
      userShares || BIG_ZERO,
      pricePerFullShare || BIG_ZERO,
    );

    const autoRefineryToDisplay = autoRefineryVaultRecentProfit.toFixed(Precisions.shortToken);

    if (user.address && !hasStakedValue) {
      return (
        <div className="p-card__auto">
          <div className="p-card__auto-title text-black text-smd">
            Recent {stakingTokenSymbol} profit:
          </div>
          <TextUnstakingFee className="p-card__auto-profit" />
        </div>
      );
    }

    if (user.address && hasStakedValue) {
      return (
        <div className="p-card__auto">
          <div className="p-card__auto-title box-f box-f-jc-sb text-black text-smd">
            <div className="">Recent {stakingTokenSymbol} profit:</div>
            <div>{autoRefineryToDisplay}</div>
          </div>

          <div className="p-card__auto-profit box-f box-f-jc-sb">
            <TextUnstakingFee className="p-card__auto-info" />
            <UnstakingFeeTimer />
          </div>
        </div>
      );
    }

    return null;
  },
);

export default AutoVaultRecentProfitSection;
