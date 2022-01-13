import React, { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { Button, Skeleton } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { tokens } from '@/config';
import { useRefineryUsdPrice } from '@/hooks/useTokenUsdPrice';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { useMst } from '@/store';
import { useSelectVaultData } from '@/store/pools/hooks';
import { IReceipt, Precisions } from '@/types';
import { loadingDataFormatter } from '@/utils/formatters';
import { clogError } from '@/utils/logger';

import { AutoBountyPopover } from '../Popovers';

import './Preview.scss';

const gasOptions = { gas: 300000 };

const ClaimBounty: React.FC = observer(() => {
  const [pendingTx, setPendingTx] = useState(false);
  const { tokenUsdPrice } = useRefineryUsdPrice();
  const { user, pools: poolsStore } = useMst();
  const { connect } = useWalletConnectorContext();
  const { callWithGasPrice } = useCallWithGasPrice();

  const tokenSymbol = tokens.rp1.symbol;

  const updateViewByFetchingBlockchainData = useCallback(() => {
    poolsStore.fetchPoolsPublicDataAsync();
    poolsStore.fetchVaultPublicData();
  }, [poolsStore]);

  const handleClaimBounty = async () => {
    setPendingTx(true);
    try {
      const contract = getContract('REFINERY_VAULT');
      const tx = await callWithGasPrice({
        contract,
        methodName: 'harvest',
        options: gasOptions,
      });
      if ((tx as IReceipt).status) {
        successNotification(
          'Bounty collected!',
          `${tokenSymbol} bounty has been sent to your wallet.`,
        );
        updateViewByFetchingBlockchainData();
      }
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setPendingTx(false);
    }
  };

  const { fees, estimatedRefineryBountyReward } = useSelectVaultData();

  const displayBountyReward = useMemo(
    () =>
      loadingDataFormatter(estimatedRefineryBountyReward, {
        displayDecimals: Precisions.shortToken,
      }),
    [estimatedRefineryBountyReward],
  );

  const displayBountyRewardUsd = useMemo(
    () =>
      loadingDataFormatter(
        new BigNumber(estimatedRefineryBountyReward || 0).multipliedBy(tokenUsdPrice),
        {
          displayDecimals: Precisions.fiat,
        },
      ),
    [estimatedRefineryBountyReward, tokenUsdPrice],
  );

  const isLoadingBountyData = estimatedRefineryBountyReward === null;

  return (
    <div className="pools-preview__bounty">
      <div className="pools-preview__bounty-title box-f-ai-c">
        <span className="text-upper text-ssm">Auto {tokenSymbol} Bounty</span>
        <AutoBountyPopover symbol={tokenSymbol} fee={fees.callFee} />
      </div>
      <div className="pools-preview__bounty-box box-f-ai-c box-f-jc-sb">
        <div>
          {isLoadingBountyData ? (
            <Skeleton.Input style={{ width: 60 }} size="small" active />
          ) : (
            <div className="text-lg">{displayBountyReward}</div>
          )}
          <div className="pools-preview__bounty-usd text-med text-gray-2">
            ~{' '}
            {isLoadingBountyData ? (
              <Skeleton.Input style={{ width: 40 }} size="small" active />
            ) : (
              displayBountyRewardUsd
            )}{' '}
            USD
          </div>
        </div>
        {!user.address ? (
          <Button className="pools-preview__bounty-btn" onClick={connect}>
            <span className="text-white text-smd text-bold">Connect Wallet</span>
          </Button>
        ) : (
          <Button
            className="pools-preview__bounty-btn"
            loading={pendingTx}
            disabled={!estimatedRefineryBountyReward?.toNumber()}
            onClick={estimatedRefineryBountyReward?.toNumber() ? handleClaimBounty : undefined}
          >
            <span className="text-white text-smd text-bold">Claim</span>
          </Button>
        )}
      </div>
    </div>
  );
});

const Preview: React.FC = observer(() => {
  return (
    <div className="pools-preview box-f-ai-c box-f-jc-sb">
      <div className="pools-preview__box">
        <h1 className="pools-preview__title h1-lg text-bold">Staking</h1>
        <div className="pools-preview__subtitle">
          Simply stake tokens to earn. <br />
          High APR, low risk.
        </div>
      </div>
      <ClaimBounty />
    </div>
  );
});

export default Preview;
