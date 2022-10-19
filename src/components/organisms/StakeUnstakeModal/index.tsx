import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
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
import { BIG_TEN, BIG_ZERO } from '@/utils/constants';

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

interface IStakeUnstakeModalProps {
  old: boolean;
}

const StakeUnstakeModal: React.FC<IStakeUnstakeModalProps> = observer(({ old }) => {
  const [pendingTx, setPendingTx] = useState(false);
  const [percent, setPercent] = useState(MAX_PERCENTAGE / 4);
  const [inputValue, setInputValue] = useState(BIG_ZERO);
  const { tokenUsdPrice } = useRefineryUsdPrice();
  const { user, modals } = useMst();

  const [time, setTime] = React.useState<NodeJS.Timeout | null>(null);

  const maxStakingValueBN = useMemo(() => new BigNumber(user.balance), [user.balance]);
  const inputValueAsString = useMemo(() => inputValue.toFixed(0), [inputValue]);
  const inputValueUsdToDisplay = useMemo(
    () => getTokenUsdPrice(inputValue, tokenUsdPrice),
    [inputValue, tokenUsdPrice],
  );

  const [isApproved, isApproving, handleApprove] = useApprove({
    tokenName: 'BOT',
    approvedContractName: old ? 'BOTDEX_OLD_STAKING' : 'BOTDEX_STAKING',
    amount: new BigNumber(inputValueAsString).times(BIG_TEN.pow(18)).toString(),
    walletAddress: user.address,
    old
  });

  const modal = modals.stakeUnstake;
  const {
    // maxStakingValue: maxStakingValueRaw,
    // stakingToken,
    poolId,
    // isAutoVault,
    // isStaking,
  } = modal;

  const hasValidationErrors = user.balance === 0 && user.balance < inputValue.toNumber();
  const calculateValueByPercent = useCallback(
    (newPercentValue: number) => maxStakingValueBN.times(newPercentValue).dividedBy(MAX_PERCENTAGE),
    [maxStakingValueBN],
  );
  const calculatePercentByValue = (newValue: BigNumber) =>
    newValue.times(MAX_PERCENTAGE).dividedBy(maxStakingValueBN).toNumber();

  const validateInputValue = useCallback((value: string | number | BigNumber) => {
    return new BigNumber(new BigNumber(value).toFixed(0, 1));
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
    if (time) {
      clearTimeout(time);
    }
    let timerId: NodeJS.Timeout | null = null;
    timerId = setTimeout(() => {
      updateInputValue(newValue);
      updatePercentByValue(newValue);
    }, 500);
    setTime(timerId);
  };

  const handlePercentChange = (newPercentValue: number) => {
    if (percent === newPercentValue) return;
    setPercent(newPercentValue);
    updateValueByPercent(newPercentValue);
  };

  const handleStake = useCallback(async () => {
    try {
      await enterStaking(poolId, inputValueAsString, user.address, old);
      toast.success(`Staked! Your funds have been staked!`);
    } catch (err) {
      // console.log(err);
      toast.error(
        `Error! Please try again. Confirm the transaction and make sure you are paying enough gas!`,
      );
    }
  }, [inputValueAsString, poolId, user.address, old]);

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
          max={maxStakingValueBN.toFixed(0, 1)}
          stringMode // to support high precision decimals
          onChange={handleValueChange}
        />
        <div className="stake-unstake-modal__balance text-right">Balance: {user.balance}</div>
        <Slider value={percent} onChange={handlePercentChange} />
        <div className="box-f-ai-c box-f-jc-sb stake-unstake-modal__btns">
          {percentBoundariesButtons.map(({ value, name = value }) => (
            <Button
              key={name}
              colorScheme="pink"
              size="smd"
              onClick={() => handlePercentChange(value)}
            >
              <span className="text-ssmd">{name}</span>
            </Button>
          ))}
        </div>
        {!isApproved && (
          <Button
            colorScheme="pink"
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
            colorScheme="pink"
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
