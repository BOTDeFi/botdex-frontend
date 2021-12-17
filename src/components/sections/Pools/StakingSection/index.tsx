import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { ButtonProps } from '@/components/atoms/Button';
import {
  useApprovePool,
  useCheckVaultApprovalStatus,
  useVaultApprove,
} from '@/hooks/pools/useApprove';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContractData } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { ITokenMobx } from '@/store/Models/Modals/StakeUnstakeModal';
import { Pool } from '@/types';
import { toBigNumber } from '@/utils';
import { BIG_ZERO } from '@/utils/constants';

const StakingSection: React.FC<{
  pool: Pool;
  stakedValue: BigNumber;
  titleClassName?: string;
  tokenSymbol: string;
  buttonProps: Omit<ButtonProps, 'onClick'>;
}> = observer(({ pool, stakedValue, titleClassName, tokenSymbol, buttonProps }) => {
  const { connect, metamaskService } = useWalletConnectorContext();
  const { user, modals } = useMst();
  const { isAutoVault = false, userData, id, stakingToken, isFinished } = pool;
  const [pendingTx, setPendingTx] = useState(false);

  // Data for regular approval buttons
  const allowance = toBigNumber(userData?.allowance);
  const needsApproval = !allowance.gt(0);

  // Data for AUTO_VAULT approval buttons
  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus();

  let handleApprove: () => Promise<void>;
  if (isAutoVault) {
    handleApprove = useVaultApprove(setLastUpdated).handleApprove;
  } else {
    const [, erc20Abi] = getContractData('ERC20');
    const stakingTokenContract = metamaskService.getContract(
      getAddress(stakingToken.address),
      erc20Abi,
    );
    handleApprove = useApprovePool(stakingTokenContract, id).handleApprove;
  }

  // Not staked && Pool ended
  if (isFinished) return null;

  const approveHandler = async () => {
    setPendingTx(true);
    await handleApprove();
    setPendingTx(false);
  };

  const hasConnectedWallet = Boolean(user.address);
  const types = [
    {
      condition: !hasConnectedWallet,
      title: 'Start Earning',
      handler: connect,
      text: 'Unlock Wallet',
    },
    {
      condition: hasConnectedWallet && isAutoVault && !isVaultApproved,
      title: 'Start Staking',
      handler: approveHandler,
      text: 'Enable',
      extraButtonProps: {
        disabled: pendingTx,
      },
    },
    {
      condition: hasConnectedWallet && !isAutoVault && needsApproval,
      title: 'Start Staking',
      handler: approveHandler,
      text: 'Enable',
      extraButtonProps: {
        disabled: pendingTx,
      },
    },
    {
      condition:
        hasConnectedWallet && (!needsApproval || isVaultApproved) && !stakedValue.toNumber(),
      title: `Stake ${tokenSymbol}`,
      handler: () => {
        modals.stakeUnstake.open({
          isStaking: true,
          stakingToken: toJS(stakingToken) as ITokenMobx,
          isAutoVault: Boolean(isAutoVault),
          maxStakingValue: (userData?.stakingTokenBalance || BIG_ZERO).toNumber(),
          poolId: id,
        });
      },
      text: 'Stake',
    },
  ];

  const template = types.find(({ condition }) => condition);

  if (template) {
    const { title, handler, text, extraButtonProps } = template;
    return (
      <>
        <div className={classNames(titleClassName, 'text-black')}>{title}</div>
        <Button {...buttonProps} {...extraButtonProps} onClick={handler}>
          <span className="text-smd text-white text-bold">{text}</span>
        </Button>
      </>
    );
  }

  return null;
});

export default StakingSection;
