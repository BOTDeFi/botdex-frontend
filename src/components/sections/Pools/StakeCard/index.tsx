import React, { useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import lock from '@/assets/img/icons/lock.svg';
import { Button } from '@/components/atoms';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';

import './StakeCard.scss';

type Stake = {
  name: string;
  period: string;
  percent: string;
};
interface IStakeCardProps {
  stake: Stake;
}
const StakeCard: React.FC<IStakeCardProps> = observer(({ stake }) => {
  const { user } = useMst();
  const { connect } = useWalletConnectorContext();
  const [isOpenDetails, setOpenDetails] = React.useState<boolean>(false);

  const handleConnect = useCallback(() => {
    connect();
    console.log(user);
    console.log(user.address === '');
  }, [connect, user]);
  const handleToggleDetailsClick = React.useCallback(() => {
    setOpenDetails((isOpen) => !isOpen);
  }, []);

  return (
    <div className={cn('stake-card', stake.name)}>
      <div className="stake-card__lock">
        <img src={lock} alt="lock" />
      </div>
      <div className="text-500">Lock for a {stake.period}</div>
      <div className={cn('stake-card__percent-wrapper', stake.name)}>
        <div className="percent">{stake.percent}</div>
        <span className="percent-token text-smd text-500">in BOT</span>
      </div>
      <div className="text-smd text-500">Start staking</div>
      {user.address === '' && (
        <Button
          size="sm"
          colorScheme="white"
          className={cn('stake-card__btn', stake.name)}
          onClick={handleConnect}
        >
          <span className="text-ssmd text-bold">Unlock Wallet</span>
        </Button>
      )}
      {user.address !== '' && (
        <Button
          size="sm"
          colorScheme="white"
          className={cn('stake-card__btn', stake.name)}
          onClick={() => {}}
        >
          <span className="text-ssmd text-bold">Stake</span>
        </Button>
      )}
      <Button
        colorScheme="outline-purple"
        size="smd"
        arrow
        toggle
        isActive={isOpenDetails}
        onToggle={() => handleToggleDetailsClick}
      >
        <span className="farms-table-row__details-wrapper">Details</span>
      </Button>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      />
    </div>
  );
});

export default StakeCard;
