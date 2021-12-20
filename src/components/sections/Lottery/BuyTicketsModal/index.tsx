import React from 'react';
import { InputNumber } from 'antd';

import { Button } from '../../../atoms';
import { Modal } from '../../../molecules';

import './BuyTicketsModal.scss';

interface IBuyTicketsModal {
  isVisible?: boolean;
  handleClose?: () => void;
}

const BuyTicketsModal: React.FC<IBuyTicketsModal> = ({ isVisible, handleClose }) => {
  const [counter, setCounter] = React.useState<number>(1);

  const handleDecreaseCounter = (): void => {
    if (counter > 1) {
      setCounter((c) => c - 1);
    }
  };
  const handleIncreaseCounter = (): void => {
    if (counter < 50) {
      setCounter((c) => c + 1);
    }
  };

  return (
    <Modal
      isVisible={!!isVisible}
      className="m-buy-tickets"
      handleCancel={handleClose}
      width={490}
      destroyOnClose
      closeIcon
    >
      <div className="m-buy-tickets__content">
        <div className="m-buy-tickets__title text-lg text-yellow text-bold">Buy Tickets</div>
        <div className="m-buy-tickets__counter box-f-ai-c">
          <div
            className="m-buy-tickets__counter-btn box-f-c text-md text-black"
            onClick={handleDecreaseCounter}
            onKeyDown={handleDecreaseCounter}
            role="button"
            tabIndex={0}
          >
            -
          </div>
          <div className="m-buy-tickets__counter-box box-f-c">
            <InputNumber
              type="number"
              value={counter}
              min={1}
              max={50}
              onChange={(value: number) => setCounter(value)}
              className="m-buy-tickets__counter-input text-yellow h2 text-bold"
            />
          </div>
          <div
            className="m-buy-tickets__counter-btn box-f-c text-md text-black"
            onClick={handleIncreaseCounter}
            onKeyDown={handleIncreaseCounter}
            role="button"
            tabIndex={0}
          >
            +
          </div>
        </div>
        <Button className="m-buy-tickets__btn">
          <div className="text-bold text-md text-white">Buy Tickets</div>
        </Button>
      </div>
    </Modal>
  );
};

export default BuyTicketsModal;
