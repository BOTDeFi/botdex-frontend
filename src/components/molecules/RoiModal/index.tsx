import React from 'react';
// import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowCircleImg from '@/assets/img/icons/arrow-circle.svg';
// import OpenLinkImg from '@/assets/img/icons/open-link.svg';
import ExchangeImg from '@/assets/img/icons/trade.svg';
import { Button, InputNumber, RadioGroup, Switch } from '@/components/atoms';
import { useMst } from '@/store';
import {
  CalculatorMode,
  DEFAULT_PRINCIPAL_AS_TOKEN,
  DEFAULT_PRINCIPAL_AS_USD,
  EditingCurrency,
} from '@/store/Models/Modals/RoiModal';

// import { getBalanceAmount } from '@/utils/formatBalance';
// import { feeFormatter, numberWithCommas } from '@/utils';
// import { getApy, getRoi } from '@/utils/compoundApy';
import Modal from '../Modal';

import './RoiModal.scss';

enum Duration {
  day = '1D',
  week = '7D',
  twoWeeks = '14D',
  month = '30D',
  year = '1Y',
  fiveYears = '5Y',
}

const principalAmountOptions = ['100', '1000', 'My Balance'];

// values as indexes to retrieve stakingDuration from array (like [1, 7, 30, 365, 1825]) as O(1)
const stakedForOptions = [
  Duration.day,
  Duration.week,
  Duration.month,
  Duration.year,
  Duration.fiveYears,
].map((period, index) => ({
  text: period,
  value: index,
}));

const compoundingEveryOptions = [
  Duration.day,
  Duration.week,
  Duration.twoWeeks,
  Duration.month,
].map((period, index) => ({
  text: period,
  value: index,
}));

const FIAT = 'USD';

const RoiModal: React.FC = observer(() => {
  const { modals } = useMst();

  const modal = modals.roi;
  const { options, state } = modal;

  // const [compounding, setIsCompounding] = useState(true);

  // const [stakingDurationIndex, setStakingDuration] = useState(3); // value as index associated with stakedOptions

  const { principalAsToken, principalAsUSD, roiUSD, roiTokens, roiPercentage } = state.data;
  const { editingCurrency, mode: calculatorMode, compounding } = state.controls;
  const {
    toggleEditingCurrency,
    toggleCompounding,
    setCalculatorMode,
    setPrincipalFromTokenValue,
    setPrincipalFromUSDValue,
    setStakingDuration,
    setTargetRoi,
    setCompoundingFrequency,
  } = state;

  if (!options) return null;

  const {
    stakingTokenSymbol,
    // stakingTokenBalance,
    // stakingTokenPrice,
    earningTokenSymbol,
    // earningTokenPrice,
    autoCompoundFrequency,
  } = options;

  // direct exactly the same as CalculatorMode.ROI_BASED_ON_PRINCIPAL (first input)
  const setDirectCalculatorMode = () => setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL);
  const setIndirectCalculatorMode = () => setCalculatorMode(CalculatorMode.PRINCIPAL_BASED_ON_ROI);

  const handleClose = () => {
    modals.roi.close();
  };

  // TODO: /trade/swap page must apply for outputCurrency (or other) as a param
  // const apyModalLink = stakingToken.address
  //   ? `/trade/swap?outputCurrency=${getAddress(stakingToken.address)}`
  //   : '/trade/swap';

  return (
    <Modal
      isVisible={modals.roi.isOpen}
      className="m-roi"
      width={360}
      handleCancel={handleClose}
      closeIcon
    >
      <div className="m-roi__content">
        <div className="m-roi__title text-md text-black">
          <span className="text-upper">Roi</span> Calculator
        </div>

        <div className="m-roi__row m-roi__staked-row">
          <div className="m-roi__row-title text-black text-bold text-upper">
            {stakingTokenSymbol} Staked
          </div>
          <div className="m-roi__staked-row-inputs-container">
            {editingCurrency === EditingCurrency.TOKEN && (
              <InputNumber
                className="m-roi__staked-row-input"
                value={principalAsToken}
                placeholder={DEFAULT_PRINCIPAL_AS_TOKEN}
                colorScheme="outline"
                inputSize="md"
                inputPrefix={
                  <span className="text-ssm text-gray" style={{ flexWrap: 'nowrap' }}>
                    ~{principalAsUSD} <span>{FIAT}</span>
                  </span>
                }
                prefixPosition="button"
                min={0}
                // max={getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals)}
                // readOnly={!isBalanceFetched}
                onChange={setPrincipalFromTokenValue}
                onFocus={setDirectCalculatorMode}
              />
            )}
            {editingCurrency === EditingCurrency.USD && (
              <InputNumber
                className="m-roi__staked-row-input"
                value={principalAsUSD}
                placeholder={DEFAULT_PRINCIPAL_AS_USD}
                colorScheme="outline"
                inputSize="md"
                inputPrefix={
                  <span className="text-ssm text-gray">
                    ~<span>{principalAsToken}</span> <span>{stakingTokenSymbol}</span>
                  </span>
                }
                prefixPosition="button"
                min={0}
                // max={getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals)}
                // readOnly={!isBalanceFetched}
                onChange={setPrincipalFromUSDValue}
                onFocus={setDirectCalculatorMode}
              />
            )}
            <Button
              className="m-roi__staked-row-input-container-button"
              icon={ExchangeImg}
              colorScheme="white"
              onClick={toggleEditingCurrency}
            />
          </div>
          <div className="m-roi__staked-row-principal-amounts box-f-ai-c box-f-jc-sb">
            {principalAmountOptions.map((principalAmountAsText, index, arr) => (
              <Button
                key={principalAmountAsText}
                colorScheme="yellow-l"
                size="ssm"
                onClick={() => setPrincipalFromUSDValue(principalAmountAsText)}
              >
                <span className="text-ssmd">
                  {index !== arr.length - 1 && '$'}
                  {principalAmountAsText}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="m-roi__row">
          <div className="m-roi__row-title text-black text-bold text-upper">Staked for</div>
          <RadioGroup
            className="box-f box-f-jc-sb"
            buttonStyle="solid"
            defaultValue={stakedForOptions[3].value}
            items={stakedForOptions}
            onChange={({ target: { value } }) => setStakingDuration(value)}
          />
        </div>

        {autoCompoundFrequency === 0 && (
          <div className="m-roi__row m-roi__compounding-every-row">
            <div className="m-roi__row-title text-black text-bold text-upper">
              Compounding every
            </div>
            <div className="box-f m-roi__compounding-every-row-container">
              <Switch
                colorScheme="white"
                defaultChecked={compounding}
                onChange={toggleCompounding}
              />
              <RadioGroup
                className={classNames(
                  'm-roi__compounding-every-row-radio-group',
                  'box-f box-f-jc-sb',
                  {
                    'm-roi__compounding-every-row-radio-group_disabled': !compounding,
                  },
                )}
                buttonStyle="solid"
                defaultValue={compoundingEveryOptions[0].value}
                items={compoundingEveryOptions}
                disabled={!compounding}
                onChange={({ target: { value: index } }) => setCompoundingFrequency({ index })}
              />
            </div>
          </div>
        )}

        <div className="m-roi__row m-roi__arrow-row">
          <div className="box-circle box-f-c">
            <img
              className={classNames('m-roi__arrow-row-img', {
                'm-roi__arrow-row-img_reverted': Boolean(calculatorMode),
              })}
              style={{ width: '25px' }}
              src={ArrowCircleImg}
              alt=""
            />
          </div>
        </div>

        <div className="m-roi__row">
          <div className="m-roi__row-title text-black text-bold text-upper">
            ROI at current rates
          </div>
          <InputNumber
            className="m-roi__staked-row-input"
            value={roiUSD}
            placeholder={DEFAULT_PRINCIPAL_AS_TOKEN}
            colorScheme="outline"
            inputSize="md"
            inputPrefix={
              <span className="text-ssm text-gray">
                ~<span>{roiTokens}</span> <span>{earningTokenSymbol}</span> (
                <span>
                  {roiPercentage.toLocaleString('en', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                %)
              </span>
            }
            prefixPosition="button"
            min={0}
            onFocus={setIndirectCalculatorMode}
            // max={getBalanceAmount(new BigNumber(modal.maxStakingValue), modal.stakingToken?.decimals)}
            // readOnly={!isBalanceFetched}
            onChange={setTargetRoi}
          />
        </div>
      </div>
    </Modal>
  );
});

export default RoiModal;
