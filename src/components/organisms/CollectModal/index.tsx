import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, RadioGroup } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { Modal } from '@/components/molecules';
import { PoolsCollectPopover } from '@/components/sections/Pools/Popovers';
import useHarvestPool from '@/hooks/pools/useHarvestPool';
import useStakePool from '@/hooks/pools/useStakePool';
import { useMst } from '@/store';
import { PoolFarmingMode } from '@/types';
import { getFullDisplayBalance } from '@/utils/formatters';
import { clogError } from '@/utils/logger';

import './CollectModal.scss';

// interface IStakeUnstakeModal {
//   isVisible?: boolean;
//   handleClose: () => void;
// }

const compoundHarvestChoices = [
  {
    text: 'Compound',
    value: 1,
  },
  {
    text: 'Harvest',
    value: 0,
  },
];

const ModalTitle: React.FC<{ className?: string; title: string }> = ({ className, title }) => {
  return <div className={classNames(className, 'text-smd text-bold text-yellow')}>{title}</div>;
};

const CollectModal: React.FC = observer(() => {
  const {
    modals: { poolsCollect },
  } = useMst();

  const { options } = poolsCollect;

  const hasCompoundHarvestChoice = options?.farmMode === PoolFarmingMode.manual;
  const [isCompounding, setCompounding] = useState(Number(hasCompoundHarvestChoice));
  const [pendingTx, setPendingTx] = useState(false);

  useEffect(() => {
    // for any 'location' changes with opened modal
    return () => {
      poolsCollect.close();
    };
  }, [poolsCollect]);

  const poolId = options?.poolId || 0;

  const { onReward } = useHarvestPool(poolId);
  const { onStake } = useStakePool(poolId);

  if (!options) return null;

  const { earnings, earningTokenDecimals, earningTokenSymbol, fullBalance } = options;

  const shouldCompound = hasCompoundHarvestChoice && isCompounding;

  const compound = async () => {
    try {
      await onStake(fullBalance, earningTokenDecimals);
      successNotification(
        'Compounded!',
        `Your ${earningTokenSymbol} earnings have been re-invested into the pool!`,
      );
      poolsCollect.close();
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  };

  const harvest = async () => {
    try {
      await onReward();
      successNotification(
        'Harvested!',
        `Your ${earningTokenSymbol} earnings have been sent to your wallet!`,
      );
      poolsCollect.close();
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  };

  const handleConfirm = async () => {
    // if (!options) return;
    setPendingTx(true);
    if (shouldCompound) {
      await compound();
    } else {
      await harvest();
    }
  };

  const handleCompoundHarvestChoiceChange = (e: any) => {
    const {
      target: { value: option },
    } = e;
    setCompounding(option);
  };

  return (
    <Modal
      isVisible={poolsCollect.isOpen}
      className="pools-collect-modal"
      handleCancel={poolsCollect.close}
      width={330}
      closeIcon
    >
      <div className="pools-collect-modal__content">
        <ModalTitle
          className="pools-collect-modal__title"
          title={`${earningTokenSymbol} ${hasCompoundHarvestChoice ? 'Collect' : 'Harvest'}`}
        />
        {hasCompoundHarvestChoice && (
          <div className="box-f-c">
            <RadioGroup
              className="pools-collect-modal__radio-group"
              buttonStyle="solid"
              defaultValue={isCompounding}
              items={compoundHarvestChoices}
              onChange={handleCompoundHarvestChoiceChange}
            />
            <PoolsCollectPopover
              className="pools-collect-modal__info"
              symbol={earningTokenSymbol}
            />
          </div>
        )}

        <div className="pools-collect-modal__profit-row box-f box-f-jc-sb">
          <div className="text-smd text-yellow">
            {shouldCompound ? 'Compounding' : 'Harvesting'}:
          </div>
          <div className="pools-collect-modal__profit text-smd text-yellow text-bold">
            {getFullDisplayBalance({
              balance: new BigNumber(earnings),
              decimals: earningTokenDecimals,
              displayDecimals: 8,
            })}{' '}
            {earningTokenSymbol}
          </div>
        </div>
        <Button className="pools-collect-modal__btn" loading={pendingTx} onClick={handleConfirm}>
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
      </div>
    </Modal>
  );
});

export default CollectModal;
