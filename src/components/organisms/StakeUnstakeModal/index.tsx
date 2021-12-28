import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, InputNumber, Slider } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { useNonVaultStake } from '@/hooks/pools/useStakePool';
import { useVaultStake } from '@/hooks/pools/useStakeVault';
import { useNonVaultUnstake } from '@/hooks/pools/useUnstakePool';
import { useVaultUnstake } from '@/hooks/pools/useUnstakeVault';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { Precisions } from '@/types';
import { getTokenUsdPrice } from '@/utils';
import { BIG_ZERO, DEFAULT_TOKEN_POWER } from '@/utils/constants';
import { getBalanceAmountBN, getDecimalAmount } from '@/utils/formatters';
import { clog } from '@/utils/logger';

import './StakeUnstakeModal.scss';

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

const StakeUnstakeModal: React.FC = observer(() => {
  const [pendingTx, setPendingTx] = useState(false);
  const [percent, setPercent] = useState(MAX_PERCENTAGE / 4);
  const [inputValue, setInputValue] = useState(BIG_ZERO);
  const { tokenUsdPrice } = useRefineryUsdPrice();

  const { modals } = useMst();
  const modal = modals.stakeUnstake;
  const {
    maxStakingValue: maxStakingValueRaw,
    stakingToken,
    poolId,
    isAutoVault,
    isStaking,
  } = modal;

  const maxStakingValueBN = useMemo(
    () => getBalanceAmountBN(new BigNumber(maxStakingValueRaw), stakingToken?.decimals),
    [maxStakingValueRaw, stakingToken?.decimals],
  );

  const calculateValueByPercent = useCallback(
    (newPercentValue: number) => maxStakingValueBN.times(newPercentValue).dividedBy(MAX_PERCENTAGE),
    [maxStakingValueBN],
  );
  const calculatePercentByValue = (newValue: BigNumber) =>
    newValue.times(MAX_PERCENTAGE).dividedBy(maxStakingValueBN).toNumber();

  const validateInputValue = useCallback(
    (value: string | number | BigNumber) => {
      return new BigNumber(
        new BigNumber(value).toFixed(stakingToken ? stakingToken.decimals : DEFAULT_TOKEN_POWER),
      );
    },
    [stakingToken],
  );

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

  const onTxFinished = () => {
    setPendingTx(false);
  };

  const { vaultStake } = useVaultStake(onTxFinished);
  const { vaultUnstake } = useVaultUnstake(onTxFinished);

  const { nonVaultStake } = useNonVaultStake(poolId, onTxFinished);
  const { nonVaultUnstake } = useNonVaultUnstake(poolId, onTxFinished);

  const handleStake = useCallback(async () => {
    if (isAutoVault) {
      const valueToStakeDecimal = getDecimalAmount(inputValue, stakingToken?.decimals);
      await vaultStake(valueToStakeDecimal);
    } else {
      await nonVaultStake(
        inputValue.toFixed(),
        stakingToken?.decimals || DEFAULT_TOKEN_POWER,
        stakingToken?.symbol,
      );
    }
  }, [
    isAutoVault,
    stakingToken?.decimals,
    stakingToken?.symbol,
    inputValue,
    vaultStake,
    nonVaultStake,
  ]);

  const handleUnstake = useCallback(async () => {
    if (isAutoVault) {
      const valueToUnstakeDecimal = getDecimalAmount(inputValue, stakingToken?.decimals);
      await vaultUnstake(valueToUnstakeDecimal);
    } else {
      await nonVaultUnstake(
        inputValue.toFixed(),
        stakingToken?.decimals || DEFAULT_TOKEN_POWER,
        stakingToken?.symbol,
      );
    }
  }, [
    isAutoVault,
    stakingToken?.decimals,
    stakingToken?.symbol,
    inputValue,
    vaultUnstake,
    nonVaultUnstake,
  ]);

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

  const inputValueAsString = useMemo(() => inputValue.toFixed(), [inputValue]);
  const inputValueUsdToDisplay = useMemo(
    () => getTokenUsdPrice(inputValue, tokenUsdPrice),
    [inputValue, tokenUsdPrice],
  );
  const balanceToDisplay = useMemo(
    () => maxStakingValueBN.toFixed(Precisions.shortToken),
    [maxStakingValueBN],
  );

  const isNotEnoughBalanceToStake = maxStakingValueRaw === 0;
  const hasValidationErrors = isNotEnoughBalanceToStake || inputValue.eq(0) || inputValue.isNaN();

  return (
    <Modal
      isVisible={modal.isOpen}
      className="stake-unstake-modal"
      handleCancel={modal.close}
      width={390}
      closeIcon
    >
      <div className="stake-unstake-modal__content">
        <div className="stake-unstake-modal__title text-smd text-bold text-black">
          {isStaking ? 'Stake in Pool' : 'Unstake'}
        </div>
        <div className="stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-black text-med text">{isStaking ? 'Stake' : 'Unstake'}</span>
          <div className="box-f-ai-c stake-unstake-modal__currency text-smd text-black">
            <img
              className="stake-unstake-modal__currency-icon"
              src={stakingToken?.logoURI || UnknownImg}
              alt=""
            />
            <span>{stakingToken?.symbol}</span>
          </div>
        </div>
        <InputNumber
          className="stake-unstake-modal__input"
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
          max={maxStakingValueBN.toFixed()}
          stringMode // to support high precision decimals
          onChange={handleValueChange}
        />
        <div className="stake-unstake-modal__balance text-right">Balance: {balanceToDisplay}</div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb stake-unstake-modal__btns">
          {percentBoundariesButtons.map(({ value, name = value }) => {
            const percentChangeHandler = () => handlePercentChange(value);
            return (
              <Button key={name} colorScheme="yellow-l" size="smd" onClick={percentChangeHandler}>
                <span className="text-ssmd">{name}</span>
              </Button>
            );
          })}
        </div>
        <Button
          className="stake-unstake-modal__btn"
          loading={pendingTx}
          disabled={hasValidationErrors}
          onClick={hasValidationErrors ? undefined : handleConfirm}
        >
          <span className="text-white text-bold text-smd">Confirm</span>
        </Button>
        {isStaking && (
          <Button
            className="stake-unstake-modal__btn stake-unstake-modal__btn-get-currency"
            colorScheme="outline-purple"
            link="/trade/swap"
          >
            <span className="text-bold text-smd">Get RP1</span>
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default StakeUnstakeModal;
