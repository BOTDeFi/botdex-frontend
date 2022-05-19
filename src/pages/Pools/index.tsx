import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { ReactComponent as WalletImg } from '@/assets/img/icons/wallet.svg';
import { ShadowTitle } from '@/components/atoms';
import Button from '@/components/atoms/Button';
import { CollectModal, StakeUnstakeModal } from '@/components/organisms';
import { WalletModal } from '@/components/sections';
import { PoolsPreview, StakeCard } from '@/components/sections/Pools';
import useRefresh from '@/hooks/useRefresh';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
// import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';
import { addressWithDots } from '@/utils/formatters';

import './Pools.scss';

const Pools: React.FC = observer(() => {
  const { connect } = useWalletConnectorContext();
  const [isWalletModalVisible, setWalletModalVisible] = useState(false);

  const { stakes: stakeStore, user } = useMst();
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (user.address !== '') {
      stakeStore.fetchStakesData();
    }
  }, [stakeStore, user.address, fastRefresh]);

  const stakeCards = (
    <div className="pools__content-card-view">
      {stakeStore.data.map((stake: any) => (
        <StakeCard key={stake.id} stake={stake} />
      ))}
    </div>
  );

  const noStakingPools = (
    <div className="spinner">
      {!user.address ? (
        <>
          <ShadowTitle type="h2">Wallet not connected</ShadowTitle>
          <div className="subTitleDescription">
            For staking, you need to connect a wallet compatible with web3 (for example MetaMask)
            used Binance Smart Chain (BSC) network
          </div>
          <div className="breakFlex" />
          <div>
            <Button
              className="connect btn-hover-down"
              colorScheme="blue"
              size="sm"
              onClick={connect}
            >
              <WalletImg />
              <span className="text-500">Connect Wallet</span>
            </Button>
          </div>
        </>
      ) : (
        <>
          <ShadowTitle type="h2">No possibility to make stake</ShadowTitle>
          <div className="subTitleDescription">No available slots to stake. Try it late</div>
          <div className="breakFlex" />
          <div>
            <Button
              className="connect btn-hover-down"
              colorScheme="blue"
              size="sm"
              onClick={() => setWalletModalVisible(true)}
            >
              <WalletImg />
              <span className="text-bold text-address">{addressWithDots(user.address)}</span>
            </Button>
          </div>
        </>
      )}
      {user.address ? (
        <WalletModal
          isVisible={isWalletModalVisible}
          handleClose={() => setWalletModalVisible(false)}
        />
      ) : (
        ''
      )}
    </div>
  );

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <div className="pools__content">
            {stakeStore.data.length > 0 ? stakeCards : noStakingPools}
          </div>
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
