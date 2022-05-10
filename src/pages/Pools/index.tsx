import { ReactComponent as WalletImg } from '@/assets/img/icons/wallet.svg';
import Button from '@/components/atoms/Button';
import { CollectModal, StakeUnstakeModal } from '@/components/organisms';
import { WalletModal } from '@/components/sections';
import { PoolsPreview, StakeCard } from '@/components/sections/Pools';
import useRefresh from '@/hooks/useRefresh';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
// import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';
import { addressWithDots } from '@/utils/formatters';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
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

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <div className="pools__content">
            {stakeStore.data.length > 0 ? (
              <div className="pools__content-card-view">
                {stakeStore.data.map((stake: any) => (
                  <StakeCard key={stake.id} stake={stake} />
                ))}
              </div>
            ) : (
              <div className="spinner">
                <h2 className="ShadowTitle_title__1a_EI ShadowTitle_white__1EFkK">
                  <span>No possibility to make stake</span>
                  <span>No possibility to make stake</span>
                </h2>
                <div className="subTitleDescription">
                  No available slots to stake. Try it late!
                </div>
                <div className="breakFlex" />
                <div className="divCenter">
                  {!user.address ? (
                    <Button
                      className="connect btn-hover-down"
                      colorScheme="blue"
                      size="sm"
                      onClick={connect}
                    >
                      <WalletImg />
                      <span className="text-500">Connect Wallet</span>
                    </Button>
                  ) : (
                    <Button
                      className="connect btn-hover-down"
                      colorScheme="blue"
                      size="sm"
                      onClick={() => setWalletModalVisible(true)}
                    >
                      <WalletImg />
                      <span className="text-bold text-address">{addressWithDots(user.address)}</span>
                    </Button>
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
              </div>
            )
            }
          </div>
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
