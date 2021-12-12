import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { Button, InputNumber, Slider } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { Modal } from '@/components/molecules';
import useStakeFarms from '@/hooks/farms/useStakeFarms';
import useUnstakeFarms from '@/hooks/farms/useUnstakeFarms';
import { useMst } from '@/store';
import { Precisions } from '@/types';
import { getTokenUsdPrice } from '@/utils';
import { BIG_ZERO, DEFAULT_TOKEN_POWER } from '@/utils/constants';
import { getBalanceAmountBN } from '@/utils/formatters';
import { clog, clogError } from '@/utils/logger';

import './FarmsStakeUnstakeModal.scss';

const mockData = {
  additionalCurrency: 'USD',
};

const MAX_PERCENTAGE = 100;
const percentBoundariesButtons = [
  {
    value: 25,
    name: '25%',
  },
  {
    value: 50,
    name: '50%',
  },
  {
    value: 75,
    name: '75%',
  },
  {
    value: MAX_PERCENTAGE,
    name: 'Max',
  },
];

const FarmsStakeUnstakeModal: React.FC = observer(() => {
  const [pendingTx, setPendingTx] = useState(false);
  const [percent, setPercent] = useState(MAX_PERCENTAGE / 4);
  const [inputValue, setInputValue] = useState(BIG_ZERO);

  const { modals, farms: farmsStore, user } = useMst();
  const modal = modals.farmsStakeUnstake;
  const { isStaking, farmId, maxValue: maxStakeUnstakeValueRaw } = modal;
  const tokenUsdPrice = modal.lpPrice;
  const { onStake } = useStakeFarms(farmId);
  const { onUnstake } = useUnstakeFarms(farmId);

  const maxStakeUnstakeValueBN = useMemo(
    () => getBalanceAmountBN(new BigNumber(maxStakeUnstakeValueRaw)),
    [maxStakeUnstakeValueRaw],
  );

  const calculateValueByPercent = useCallback(
    (newPercentValue: number) =>
      maxStakeUnstakeValueBN.times(newPercentValue).dividedBy(MAX_PERCENTAGE),
    [maxStakeUnstakeValueBN],
  );
  const calculatePercentByValue = (newValue: BigNumber) =>
    newValue.times(MAX_PERCENTAGE).dividedBy(maxStakeUnstakeValueBN).toNumber();

  const validateInputValue = useCallback((value: string | number | BigNumber) => {
    return new BigNumber(new BigNumber(value).toFixed(DEFAULT_TOKEN_POWER));
  }, []);

  const updateInputValue = useCallback(
    (newValue: string | number | BigNumber) => {
      setInputValue(validateInputValue(newValue));
    },
    [validateInputValue],
  );

  const updateValueByPercent = useCallback(
    (newPercent: number) => {
      updateInputValue(calculateValueByPercent(newPercent));
    },
    [updateInputValue, calculateValueByPercent],
  );
  const updatePercentByValue = (newValue: string | number | BigNumber) => {
    const validatedValue = validateInputValue(newValue);
    setPercent(calculatePercentByValue(validatedValue));
  };

  const handleValueChange = (newValue: ValueType | null) => {
    if (newValue === null) return;
    updateInputValue(newValue);
    updatePercentByValue(newValue);
  };

  const handlePercentChange = (newPercentValue: number) => {
    if (percent === newPercentValue) return;
    setPercent(newPercentValue);
    updateValueByPercent(newPercentValue);
  };

  const inputValueAsString = useMemo(() => inputValue.toFixed(), [inputValue]);
  const handleStake = useCallback(async () => {
    try {
      await onStake(inputValueAsString);
      farmsStore.fetchFarmUserDataAsync(user.address, [farmId]);
      successNotification('Staked!', 'Your funds have been staked in the farm!');
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [user.address, farmId, inputValueAsString, farmsStore, onStake]);

  const handleUnstake = useCallback(async () => {
    try {
      await onUnstake(inputValueAsString);
      farmsStore.fetchFarmUserDataAsync(user.address, [farmId]);
      successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet!');
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  }, [user.address, farmId, inputValueAsString, farmsStore, onUnstake]);

  const handleConfirm = async () => {
    clog(inputValue);
    setPendingTx(true);
    if (isStaking) {
      await handleStake();
    } else {
      await handleUnstake();
    }
    modal.close();
  };

  useEffect(() => {
    updateValueByPercent(percent);
  }, [percent, updateValueByPercent]);

  useEffect(() => {
    // for any 'location' changes with opened modal
    return () => {
      modal.close();
    };
  }, [modal]);

  const inputValueUsdToDisplay = useMemo(() => getTokenUsdPrice(inputValue, tokenUsdPrice), [
    inputValue,
    tokenUsdPrice,
  ]);
  const balanceToDisplay = useMemo(() => maxStakeUnstakeValueBN.toFixed(Precisions.shortToken), [
    maxStakeUnstakeValueBN,
  ]);

  const isNotEnoughBalanceToStake = maxStakeUnstakeValueRaw === '0';
  const hasValidationErrors = isNotEnoughBalanceToStake || inputValue.eq(0) || inputValue.isNaN();

  const { addLiquidityUrl, tokenSymbol } = modal;

  return (
    <Modal
      isVisible={modal.isOpen}
      className="farms-stake-unstake-modal"
      handleCancel={modal.close}
      width={390}
      closeIcon
    >
      <div className="farms-stake-unstake-modal__content">
        <div className="farms-stake-unstake-modal__title text-smd text-bold text-yellow">
          {isStaking ? 'Stake in Farm' : 'Unstake'}
        </div>
        <div className="farms-stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-yellow text-med text">{isStaking ? 'Stake' : 'Unstake'}</span>
          <div className="box-f-ai-c farms-stake-unstake-modal__currency text-smd text-yellow">
            <span>{tokenSymbol}</span>
          </div>
        </div>
        <InputNumber
          className="farms-stake-unstake-modal__input"
          value={inputValueAsString}
          colorScheme="outline"
          inputSize="md"
          inputPrefix={
            <span className="text-ssm text-gray">
              ~{inputValueUsdToDisplay} {mockData.additionalCurrency}
            </span>
          }
          prefixPosition="button"
          min={0}
          max={maxStakeUnstakeValueBN.toFixed()}
          stringMode // to support high precision decimals
          onChange={handleValueChange}
        />
        <div className="farms-stake-unstake-modal__balance text-right">
          Balance: {balanceToDisplay}
        </div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb farms-stake-unstake-modal__btns">
          {percentBoundariesButtons.map(({ value, name = value }) => (
            <Button
              colorScheme="yellow-l"
              size="smd"
              key={name}
              onClick={() => handlePercentChange(value)}
            >
              <span className="text-ssmd">{name}</span>
            </Button>
          ))}
        </div>
        <Button
          className="farms-stake-unstake-modal__btn"
          loading={pendingTx}
          disabled={hasValidationErrors}
          onClick={hasValidationErrors ? undefined : handleConfirm}
        >
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        {isStaking && (
          <Button
            className="farms-stake-unstake-modal__btn farms-stake-unstake-modal__btn-get-currency"
            colorScheme="outline-purple"
            link={addLiquidityUrl}
          >
            <span className="text-bold text-smd">Get {tokenSymbol}</span>
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default FarmsStakeUnstakeModal;
