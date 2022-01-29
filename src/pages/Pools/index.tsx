import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { CollectModal, StakeUnstakeModal } from '@/components/organisms';
import { PoolsPreview, StakeCard } from '@/components/sections/Pools';
// import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';

import './Pools.scss';

const Pools: React.FC = observer(() => {
  const { stakes: stakeStore, user } = useMst();
  const [stakes, setStakes] = useState<any>(null);

  // const { slowRefresh, fastRefresh } = useRefresh();
  useEffect(() => {
    if (user.address !== '' && stakeStore.data.length === 0) {
      stakeStore.fetchStakesData();
      setStakes(stakeStore.data);
    }
  }, [user.address, stakeStore]);

  return (
    <>
      <main className="pools">
        <div className="row">
          <PoolsPreview />
          <div className="pools__content">
            <div className="pools__content-card-view">
              {stakes && stakes.map((stake: any) => <StakeCard key={stake.id} stake={stake} />)}
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
