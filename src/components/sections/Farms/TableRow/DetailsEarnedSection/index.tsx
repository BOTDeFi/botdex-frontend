import React, { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, InputNumber } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { tokens } from '@/config/tokens';
import { useHarvestFarm } from '@/hooks/farms/useHarvestFarm';
import { useMst } from '@/store';
import { FarmWithStakedValue } from '@/types';
import { getBalanceAmount } from '@/utils/formatters';

import DetailsSectionTitle from '../DetailsSectionTitle';
import { EARNING_TOKEN_SYMBOL } from '../utils';

interface IDetailsEarnedSectionProps {
  className?: string;
  farm: FarmWithStakedValue;
}

const DetailsEarnedSection: React.FC<IDetailsEarnedSectionProps> = observer(
  ({ className, farm }) => {
    const { pid, userData } = farm;
    const { earnings = '0' } = userData || {};
    const hasEarnings = Boolean(Number(earnings));

    const [pendingTx, setPendingTx] = useState(false);
    const { harvestFarm } = useHarvestFarm(pid);
    const { user, farms: farmsStore } = useMst();

    const onHarvest = useCallback(async () => {
      setPendingTx(true);
      try {
        await harvestFarm();
        successNotification(
          'Harvested!',
          `Your ${EARNING_TOKEN_SYMBOL} earnings have been sent to your wallet!`,
        );
      } catch (e) {
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        setPendingTx(false);
      }

      farmsStore.fetchFarmUserDataAsync(user.address, [pid]);
    }, [farmsStore, harvestFarm, pid, user.address]);

    const harvestHandler = useMemo(() => {
      return hasEarnings ? onHarvest : undefined;
    }, [hasEarnings, onHarvest]);

    return (
      <div className={classNames(className, 'farms-table-row__details-box')}>
        <DetailsSectionTitle title="BOT Earned" />
        <InputNumber
          colorScheme="darkgray"
          value={getBalanceAmount(new BigNumber(earnings), tokens.rp1.decimals)}
          inputPrefix={
            <Button
              colorScheme="outline-purple"
              size="ssm"
              disabled={!hasEarnings || pendingTx}
              onClick={harvestHandler}
            >
              <span className="text-white text-ssmd">Harvest</span>
            </Button>
          }
          readOnly
        />
      </div>
    );
  },
);

export default DetailsEarnedSection;
