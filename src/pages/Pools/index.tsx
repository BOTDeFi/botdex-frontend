import React, { useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { observer } from 'mobx-react-lite';

import { CollectModal, StakeUnstakeModal } from '@/components/organisms';
import { PoolsPreview, StakeCard } from '@/components/sections/Pools';
import useRefresh from '@/hooks/useRefresh';
// import useRefresh from '@/hooks/useRefresh';
import { useMst } from '@/store';

import './Pools.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 96 }} spin />;

const Pools: React.FC = observer(() => {
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
              <Spin className="spinner" size="large" indicator={antIcon} />
            )}
          </div>
        </div>
      </main>
      <StakeUnstakeModal />
      <CollectModal />
    </>
  );
});

export default Pools;
