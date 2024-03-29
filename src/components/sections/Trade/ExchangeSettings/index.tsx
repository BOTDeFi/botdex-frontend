import React from 'react';
import nextId from 'react-id-generator';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';
import moment from 'moment';

import { ISettings } from '@/types';

import CrossImg from '../../../../assets/img/icons/cross-2.svg';
import { Button, InputNumber } from '../../../atoms';

import './ExchangeSettings.scss';

export interface IActiveSlippage {
  type: 'btn' | 'input';
  value: number;
}

interface IExchangeSettings {
  savedSettings: ISettings;
  handleSave: (settings: ISettings) => void;
  isSlippage?: boolean;
}

const ExchangeSettings: React.FC<IExchangeSettings> = React.memo(
  ({ savedSettings, handleSave, isSlippage = true }) => {
    const history = useHistory();
    const [slippage, setSlippage] = React.useState<IActiveSlippage>(savedSettings.slippage);
    const [txDeadline, setTxDeadline] = React.useState<number>(savedSettings.txDeadline);
    const [txDeadlineUtc, setTxDeadlineUtc] = React.useState<number>(savedSettings.txDeadlineUtc);
    const [isAudio] = React.useState<boolean>(savedSettings.isAudio);

    const [slippageInputValue, setSlippageInputValue] = React.useState<number>(
      savedSettings.slippage.type === 'input' ? savedSettings.slippage.value : NaN,
    );
    const btns = [0.1, 0.5, 1];

    const handleSaveSettings = () => {
      handleSave({
        slippage,
        txDeadline,
        txDeadlineUtc,
        isAudio,
      });
      history.goBack();
    };

    const handleChangeSlippage = (data: IActiveSlippage): void => {
      setSlippage(data);
    };

    const handleChangeTxDeadline = (value: number | string): void => {
      setTxDeadlineUtc(moment.utc().add(value, 'm').unix());
      setTxDeadline(+value);
    };

    const handleFocusSlippageInput = () => {
      if (+slippageInputValue) {
        handleChangeSlippage({
          type: 'input',
          value: slippageInputValue,
        });
      }
    };

    const handleChangeSlippageInput = (value: number | string) => {
      setSlippageInputValue(+value);
      if (+value) {
        handleChangeSlippage({
          type: 'input',
          value: +value,
        });
      } else {
        handleChangeSlippage({ type: 'btn', value: 0.1 });
      }
    };

    const handleClose = (): void => {
      history.goBack();
    };

    return (
      <div className="exchange exch-settings">
        <div className="box-f-jc-sb box-f-ai-c exch-settings__box-title">
          <div className="text-md text-500">Advanced Settings</div>
          <div
            className="exch-settings__close"
            onClick={handleClose}
            onKeyDown={handleClose}
            role="link"
            tabIndex={0}
          >
            <img src={CrossImg} alt="" />
          </div>
        </div>
        {isSlippage ? (
          <div className="exch-settings__section">
            <div className="exch-settings__section-title text-500">Slippage tolerance</div>
            <div className="box-f box-f-jc-sb">
              {btns.map((btn) => (
                <Button
                  key={nextId()}
                  size="sm"
                  colorScheme="outline"
                  onClick={() => handleChangeSlippage({ type: 'btn', value: btn })}
                  className={cn('exch-settings__slippage-btn', {
                    active: slippage.type === 'btn' && slippage.value === btn,
                  })}
                >
                  {btn}%
                </Button>
              ))}
              <InputNumber
                value={slippageInputValue}
                colorScheme="outline"
                inputSize="sm"
                min={0.1}
                max={49}
                inputPrefix="%"
                onFocus={handleFocusSlippageInput}
                onChange={handleChangeSlippageInput}
                className={cn('exch-settings__slippage-input', {
                  active: slippage.type === 'input' && slippage.value,
                })}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="exch-settings__section">
          <div className="exch-settings__section-title-2 text-500">Transaction deadline</div>
          <div className="box-f-ai-c">
            <InputNumber
              colorScheme="outline"
              inputSize="sm"
              value={txDeadline}
              onChange={handleChangeTxDeadline}
              className="exch-settings__txdeadline-input"
              placeholder="0"
            />
            <span className="text-500">Minutes</span>
          </div>
        </div>
        <div className="exch-settings__section">
          {/* <div className="exch-settings__section-title-2 text-500">Audio</div>
          <Switch
            colorScheme="purple"
            switchSize="bg"
            value={isAudio}
            onChange={() => setIsAudio(!isAudio)}
          /> */}
        </div>
        <Button
          colorScheme="pink"
          className="exch-settings__btn btn-hover-down"
          onClick={handleSaveSettings}
        >
          <span className="text-smd text-white">Save and close</span>
        </Button>
      </div>
    );
  },
);

export default ExchangeSettings;
