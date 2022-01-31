import React, { useCallback, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { format, millisecondsToSeconds } from 'date-fns';
import { observer } from 'mobx-react-lite';

import lock from '@/assets/img/icons/lock.svg';
import { Button } from '@/components/atoms';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import {
  calculateReward,
  collectReward,
  convertSeconds,
  getUserBalance,
  updateStakeData,
} from '@/store/stakes';
import { Stake } from '@/types';

import './StakeCard.scss';

interface IStakeCardProps {
  stake: Stake;
}
const StakeCard: React.FC<IStakeCardProps> = observer(({ stake }) => {
  const { user, stakes: stakeStore, modals } = useMst();
  const { connect } = useWalletConnectorContext();
  const [isOpenDetails, setOpenDetails] = React.useState<boolean>(false);
  const [collecting, setCollecting] = React.useState<boolean>(false);
  const [reward, setReward] = React.useState<any>(0);
  const handleConnect = useCallback(() => {
    connect();
  }, [connect]);
  const handleToggleDetailsClick = React.useCallback(() => {
    setOpenDetails(!isOpenDetails);
  }, [isOpenDetails]);
  const handleOpenStakeModal = React.useCallback(() => {
    modals.stakeUnstake.open(stake.id);
  }, [modals.stakeUnstake, stake.id]);
  const handleCollectReward = React.useCallback(async () => {
    setCollecting(true);
    await collectReward(stake.id, user.address);
    updateStakeData(stake.id, user.address).then((res) => {
      stakeStore.setUserData(stake.id, res.userData);
      stakeStore.setAmountStaked(stake.id, res.amountStaked);
    });
    setCollecting(false);
  }, [stake.id, stakeStore, user.address]);
  // const reward = React.useMemo(() => {
  //   const result = calculateReward.then((res) => {
  //     return result;
  //   });
  // }, []);

  const calculateCollectTime = React.useMemo(() => {
    if (stake.userData?.start === 0) {
      return format(Date.now() + stake.timeLockUp, 'yyyy.dd.MM');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const timeGap = millisecondsToSeconds(Date.now()) - stake.userData?.start;
    if (timeGap < stake.timeLockUp) {
      return format(Date.now() + stake.timeLockUp, 'yyyy.dd.MM');
    }
    return 0;
  }, [stake.timeLockUp, stake.userData?.start]);

  useEffect(() => {
    async function getUserData() {
      const data = await stakeStore.fetchUserData(stake.id, user.address);
      stakeStore.setUserData(stake.id, data);
    }
    if (user.address !== '') {
      getUserData().catch((err) => console.log(err));
      getUserBalance(user.address).then((res) => user.setBalance(res.toNumber()));
    }
  }, [stake.id, stakeStore, user]);

  useEffect(() => {
    updateStakeData(stake.id, user.address).then((res) => {
      stakeStore.setUserData(stake.id, res.userData);
      stakeStore.setAmountStaked(stake.id, res.amountStaked);
    });
  }, [stake.id, stakeStore, user.address]);
  useEffect(() => {
    async function getReward() {
      const result = await calculateReward(stake.id);
      setReward(result);
    }
    getReward();
  }, [stake.id, stakeStore, user.address]);

  return (
    <div className="stake-card">
      <div className="stake-card__content">
        <div className="stake-card__lock">
          <img src={lock} alt="lock" />
        </div>
        <div className="text-500">Lock for a {convertSeconds(stake.timeLockUp)}</div>
        <div className="stake-card__percent-wrapper">
          <div className="percent">{stake.APY}%</div>
          <span className="percent-token text-smd text-500">in BOT</span>
        </div>
        <div className="text-smd text-500">Start staking</div>
        {user.address === '' && (
          <Button size="sm" colorScheme="white" className="stake-card__btn" onClick={handleConnect}>
            <span className="text-ssmd text-bold">Unlock Wallet</span>
          </Button>
        )}
        {user.address !== '' && (
          <Button
            size="sm"
            colorScheme="white"
            className="stake-card__btn"
            onClick={handleOpenStakeModal}
            disabled={stake.isDead}
          >
            <span className="text-ssmd text-bold">Stake</span>
          </Button>
        )}
        {!isOpenDetails && (
          <Button
            colorScheme="outline-purple"
            size="smd"
            arrow
            toggle
            isActive={isOpenDetails}
            onToggle={handleToggleDetailsClick}
          >
            <span className="farms-table-row__details-wrapper">Details</span>
          </Button>
        )}
      </div>
      <CSSTransition
        unmountOnExit
        mountOnEnter
        in={isOpenDetails}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
        classNames="show"
      >
        <div className="details-wrapper">
          {isOpenDetails && (
            <Button
              colorScheme="outline-purple"
              size="smd"
              arrow
              toggle
              isActive={isOpenDetails}
              onToggle={handleToggleDetailsClick}
            >
              <span className="farms-table-row__details-wrapper">Details</span>
            </Button>
          )}
          <div className="label">Reward</div>
          <div className="content">{reward} BOT</div>
          <div className="label">Payment Date</div>
          {calculateCollectTime !== 0 ? (
            <div className="content">{calculateCollectTime}</div>
          ) : (
            <Button
              colorScheme="outline-purple"
              size="sm"
              loading={collecting}
              onClick={handleCollectReward}
            >
              <span className="farms-table-row__details-wrapper">Collect Reward</span>
            </Button>
          )}
        </div>
      </CSSTransition>
    </div>
  );
});

export default StakeCard;
