import React from 'react';
// import classNames from 'classnames';
// import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

// import { Button } from '@/components/atoms';
// import { useMst } from '@/store';
// import { ITokenMobx } from '@/store/Models/Modals/StakeUnstakeModal';
// import { convertSharesToRefinery, getStakingBalance } from '@/store/pools/helpers';
// import { useSelectVaultData } from '@/store/pools/hooks';
import { Pool } from '@/types';
// import { BIG_ZERO } from '@/utils/constants';

import './StakeUnstakeButtons.scss';

const StakeUnstakeButtons: React.FC<{
  className?: string;
  pool: Pool;
}> = observer(({ className, pool }) => {
  // const { id: poolId, isAutoVault, stakingToken, userData, isFinished } = pool;
  // const {
  //   pricePerFullShare,
  //   userData: { userShares },
  // } = useSelectVaultData();

  // const { modals } = useMst();
  //
  // const maxStakingValue = useMemo(() => {
  //   return getStakingBalance(pool);
  // }, [pool]);
  //
  // const maxUnstakingValue = useMemo(() => {
  //   if (!userShares || !pricePerFullShare) return BIG_ZERO;
  //   if (isAutoVault) {
  //     return convertSharesToRefinery(userShares, pricePerFullShare).refineryAsBigNumber;
  //   }
  //   return userData?.stakedBalance || BIG_ZERO;
  // }, [isAutoVault, pricePerFullShare, userData?.stakedBalance, userShares]);
  // const clonedStakingToken = toJS(stakingToken) as ITokenMobx;
  // const buttons = [
  //   {
  //     handler: () => {
  //       modals.stakeUnstake.open({
  //         isStaking: false,
  //         maxStakingValue: maxUnstakingValue.toNumber(),
  //         stakingToken: clonedStakingToken,
  //         isAutoVault: Boolean(isAutoVault),
  //         poolId,
  //       });
  //     },
  //     text: '-',
  //   },
  //   {
  //     disabled: isFinished,
  //     handler: () => {
  //       modals.stakeUnstake.open({
  //         isStaking: true,
  //         maxStakingValue: maxStakingValue.toNumber(),
  //         stakingToken: clonedStakingToken,
  //         isAutoVault: Boolean(isAutoVault),
  //         poolId,
  //       });
  //     },
  //     text: '+',
  //   },
  // ];
  // return (
  //   <div className={classNames(className, 'pools-stake-unstake-buttons', 'box-f')}>
  //     {buttons.map(({ text, handler, disabled = false }) => (
  //       <Button
  //         key={text}
  //         colorScheme="outline-purple"
  //         size="ssm"
  //         disabled={disabled}
  //         onClick={disabled ? undefined : handler}
  //       >
  //         <span className="text-smd text-yellow text-bold">{text}</span>
  //       </Button>
  //     ))}
  //   </div>
  // );
  return <div>1</div>
});

export default StakeUnstakeButtons;
