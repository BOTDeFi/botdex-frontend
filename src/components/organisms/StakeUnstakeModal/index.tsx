import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { Button, InputNumber, Slider } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { useApprove } from '@/hooks/useApprove';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useMst } from '@/store';
import { enterStaking } from '@/store/stakes';
import { getTokenUsdPrice } from '@/utils';
import { BIG_ZERO, DEFAULT_TOKEN_POWER } from '@/utils/constants';

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

  const { user, modals } = useMst();
  const [isApproved, isApproving, handleApprove] = useApprove({
    tokenName: 'BOT',
    approvedContractName: 'BOTDEX_STAKING',
    amount: inputValue.toString(),
    walletAddress: user.address,
  });

  const modal = modals.stakeUnstake;
  const {
    // maxStakingValue: maxStakingValueRaw,
    stakingToken,
    poolId,
    // isAutoVault,
    // isStaking,
  } = modal;

  const maxStakingValueBN = useMemo(() => new BigNumber(user.balance), [user.balance]);

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

  const handleStake = useCallback(async () => {
    await enterStaking(poolId, inputValue, user.address);
  }, [user.address, inputValue, poolId]);

  const handleConfirm = async () => {
    setPendingTx(true);
    await handleStake();
    setPendingTx(false);
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

  const hasValidationErrors = user.balance < inputValue.toNumber();

  return (
    <Modal
      isVisible={modal.isOpen}
      className="stake-unstake-modal"
      handleCancel={modal.close}
      width={390}
      closeIcon
    >
      <div className="stake-unstake-modal__content">
        <div className="stake-unstake-modal__title text-smd text-bold">Stake in Pool</div>
        <div className="stake-unstake-modal__subtitle box-f-ai-c box-f-jc-sb">
          <span className="text-med text">Stake</span>
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
        <div className="stake-unstake-modal__balance text-right">Balance: {user.balance}</div>
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
        {!isApproved && (
          <Button
            className="stake-unstake-modal__btn"
            loading={isApproving}
            disabled={hasValidationErrors}
            onClick={handleApprove}
          >
            <span className="text-white text-bold text-smd">ApproveToken</span>
          </Button>
        )}
        {isApproved && (
          <Button
            className="stake-unstake-modal__btn"
            disabled={hasValidationErrors}
            loading={pendingTx}
            onClick={hasValidationErrors ? undefined : handleConfirm}
          >
            <span className="text-white text-bold text-smd">Confirm</span>
          </Button>
        )}
        <Button
          className="stake-unstake-modal__btn stake-unstake-modal__btn-get-currency"
          colorScheme="outline-purple"
          link="/trade/swap"
        >
          <span className="text-bold text-smd">Get BOT</span>
        </Button>
      </div>
    </Modal>
  );
});

export default StakeUnstakeModal;
