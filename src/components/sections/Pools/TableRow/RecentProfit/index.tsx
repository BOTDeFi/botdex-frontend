import React from 'react';
import { observer } from 'mobx-react-lite';

import { InputNumber } from '@/components/atoms';
import { useMst } from '@/store';
import { IPoolFarmingMode, PoolFarmingMode, Token } from '@/types';

import CollectButton from '../../CollectButton';

interface IRecentProfitProps {
  farmMode: IPoolFarmingMode;
  tokenStake: Token;
  earnings: number;
  isFinished?: boolean;
  onCollect: () => void;
}

const RecentProfit: React.FC<IRecentProfitProps> = observer(
  ({ farmMode, tokenStake, earnings, isFinished, onCollect }) => {
    const { user } = useMst();
    const hasConnectedWallet = Boolean(user.address);

    if (isFinished && earnings === 0) {
      return null;
    }

    return (
      <div className="pools-table-row__details-box">
        <div className="pools-table-row__details-title text-yellow text-ssm text-med text-upper">
          recent {tokenStake.symbol} profit
        </div>
        <InputNumber
          colorScheme="white"
          value={earnings}
          inputPrefix={
            hasConnectedWallet &&
            (farmMode === PoolFarmingMode.earn || farmMode === PoolFarmingMode.manual) &&
            !isFinished ? (
              <CollectButton farmMode={farmMode} value={earnings} collectHandler={onCollect} />
            ) : undefined
          }
          readOnly
        />
      </div>
    );
  },
);

export default RecentProfit;
