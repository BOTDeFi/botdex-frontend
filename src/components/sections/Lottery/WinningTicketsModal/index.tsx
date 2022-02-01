import React from 'react';
import nextId from 'react-id-generator';
import Scrollbar from 'react-scrollbars-custom';

import { Button, WinNumber } from '../../../atoms';
import { Modal } from '../../../molecules';

import './WinningTicketsModal.scss';

interface IWinningTicketsModal {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean;
  // eslint-disable-next-line react/require-default-props
  handleClose?: () => void;
}

const WinningTicketsModal: React.FC<IWinningTicketsModal> = ({ isVisible, handleClose }) => {
  const tickets = [
    {
      numbers: [4, 11, 14, 2],
      id: 1,
    },
    {
      numbers: [4, 11, 14, 2],
      id: 2,
    },
    {
      numbers: [4, 11, 14, 2],
      id: 3,
    },
    {
      numbers: [4, 11, 14, 2],
      id: 4,
    },
  ];
  return (
    <Modal
      isVisible={!!isVisible}
      className="m-winning-tickets"
      handleCancel={handleClose}
      width={490}
      destroyOnClose
      closeIcon
    >
      <div className="m-winning-tickets__content">
        <div className="m-winning-tickets__title box-f-ai-c">
          <span className="text-md text-med text-yellow">Winning Tickets</span>
          <span className="text-blue text-med text-smd">({tickets.length})</span>
        </div>
        <Scrollbar
          className="m-winning-tickets__scroll"
          style={{
            width: '100%',
            height: tickets.length > 3 ? '580px' : `${tickets.length * 179}px`,
          }}
        >
          {tickets.map((ticket) => (
            <div className="m-winning-tickets__item" key={ticket.id}>
              <div className="box-f-ai-c box-f-jc-sb">
                {ticket.numbers.map((numb) => (
                  <WinNumber winNumber={numb} key={nextId()} />
                ))}
              </div>
              <Button
                colorScheme="outline-purple"
                size="ssm"
                className="m-winning-tickets__item-btn"
              >
                <span className="text-ssmd">Get Reward</span>
              </Button>
            </div>
          ))}
        </Scrollbar>
        <Button className="m-winning-tickets__btn">
          <span className="text-md text-bold text-white">Get All Rewards</span>
        </Button>
      </div>
    </Modal>
  );
};

export default WinningTicketsModal;
