import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { CollectModal, StakeUnstakeModal } from '@/components/organisms';
import { PoolsPreview, StakeCard } from '@/components/sections/Pools';
// import useRefresh from '@/hooks/useRefresh';
import { stakesTemp } from '@/pages/Pools/mock';
import { useMst } from '@/store';

import './Pools.scss';


const Pools: React.FC = observer(() => {
  const { stakes } = useMst();

  // const { slowRefresh, fastRefresh } = useRefresh();
  useEffect(() => {
    stakes.getStakesData();
  }, [stakes]);
  // <-- Fetch Vault Data -->
  // useEffect(() => {
  //   poolsStore.fetchVaultPublicData();
  // }, [poolsStore, fastRefresh]);
  //
  // useEffect(() => {
  //   if (user.address) {
  //     poolsStore.fetchVaultUserData(user.address);
  //   }
  // }, [poolsStore, user.address, fastRefresh]);
  //
  // useEffect(() => {
  //   poolsStore.fetchVaultFees();
  // }, [poolsStore]);
  //
  // // <-- Fetch Pools Data -->
  // useEffect(() => {
  //   poolsStore.fetchPoolsPublicData();
  // }, [poolsStore, slowRefresh]);

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <div className="pools__content">
            <div className="pools__content-card-view">
              {stakesTemp.map((stake) => (
                <StakeCard key={stake.name} stake={stake} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
