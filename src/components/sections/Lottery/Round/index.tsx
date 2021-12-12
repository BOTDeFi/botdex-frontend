import React from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import LogoImg from '../../../../assets/img/icons/logo-mini.svg';
import { useWalletConnectorContext } from '../../../../services/MetamaskConnect';
import { useMst } from '../../../../store';
import { Button, WinNumber } from '../../../atoms';

import './Round.scss';

interface IRound {
  index: number;
  handleOpenModal: () => void;
}

const Round: React.FC<IRound> = observer(({ index, handleOpenModal }) => {
  const connector = useWalletConnectorContext();
  const { user } = useMst();
  const numbers = [4, 11, 13, 2];
  const statistic = {
    matched: [
      {
        match: 4,
        winners: 0,
        prize: 1550,
      },
      {
        match: 3,
        winners: 10,
        prize: 600,
      },
      {
        match: 2,
        winners: 40,
        prize: 310,
      },
    ],
    burned: 620,
  };
  return (
    <div className="lottery-round box-shadow box-white">
      <div className="lottery-round__title text-md text-med">
        <span className="text-black">Round</span> <span className="text-yellow">#{index}</span>
        <div className="lottery-round__date text-gray text-norm">Apr 28, 2:00 UTC</div>
      </div>
      <div className="lottery-round__box lottery-round__numbers">
        <div className="lottery-round__numbers-title text-med text-black">Winning numbers</div>
        <div className="box-f-ai-c box-f-jc-sb">
          {numbers.map((numb) => (
            <WinNumber winNumber={numb} key={nextId()} />
          ))}
        </div>
      </div>
      <div className="lottery-round__box lottery-round__total">
        <div className="lottery-round__total-title text-med text-black">Total prizes</div>
        <div className="box-f-ai-c">
          <img src={LogoImg} alt="" className="lottery-round__total-img" />
          <div className="h2-lg text-black text-med lottery-round__total-coins">3,100.5</div>
          <div className="text-med text-black lottery-round__total-coins-name">CAKE</div>
        </div>
      </div>
      <div className="lottery-round__box lottery-round__statistic">
        <div className="lottery-round__statistic-row lottery-round__statistic-row-head">
          <div className="text-med text-gray text-sm">No. Matched</div>
          <div className="text-med text-gray text-sm text-center">Winners</div>
          <div className="text-med text-gray text-sm">Prize Pot</div>
        </div>
        {statistic.matched.map((row) => (
          <div className="lottery-round__statistic-row" key={nextId()}>
            <div className="text-bold text-black">{row.match}</div>
            <div className="text-bold text-black text-center">{row.winners}</div>
            <div className="text-bold text-black">{row.prize}</div>
          </div>
        ))}
        <div className="lottery-round__statistic-burned box-f-ai-c box-f-jc-sb text-bold text-black">
          <span>Burned</span>
          <span>{statistic.burned}</span>
        </div>
      </div>
      {user.address ? (
        <Button className="lottery-round__btn" onClick={handleOpenModal}>
          <span className="text-md text-black text-bold">Show Winning Tikets</span>
        </Button>
      ) : (
        <Button className="lottery-round__btn" onClick={connector.connect}>
          <span className="text-md text-black text-bold">Unlock Wallet</span>
        </Button>
      )}
    </div>
  );
});

export default Round;
