import React, { useCallback, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import classNames from 'classnames';

import { Button, Skeleton } from '@/components/atoms';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import useApproveFarm from '@/hooks/farms/useApprove';
import { useLpTokenPrice } from '@/hooks/farms/useFarmsPrices';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { getAddress, getContractData } from '@/services/web3/contractHelpers';
import { useMst } from '@/store';
import { useFarmUserData } from '@/store/farms/hooks';
import { FarmWithStakedValue, Precisions } from '@/types';
import { getBalanceAmount } from '@/utils/formatters';
import { clog, clogError } from '@/utils/logger';
import { getAddLiquidityUrl } from '@/utils/urlConstructors';

import FarmsStakeUnstakeButtons from '../../FarmsStakeUnstakeButtons';
import DetailsSectionTitle from '../DetailsSectionTitle';

interface IDetailsActionsSectionProps {
  className?: string;
  farm: FarmWithStakedValue;
}

const useErc20 = (address: string) => {
  const { metamaskService } = useWalletConnectorContext();
  const [, erc20Abi] = getContractData('ERC20');
  return metamaskService.getContract(address, erc20Abi);
};

const CURRENCY_CONVERT_TO = 'USD';

const DetailsActionsSection: React.FC<IDetailsActionsSectionProps> = ({ className, farm }) => {
  const { user, farms: farmsStore } = useMst();
  const hasConnectedWallet = Boolean(user.address);
  const { connect } = useWalletConnectorContext();

  const { allowance, tokenBalance, stakedBalance } = useFarmUserData(farm);
  const needsApproval = !allowance.gt(0);
  const { userDataLoaded } = farmsStore;
  const [requestedApproval, setRequestedApproval] = useState(false);

  const { pid, lpAddresses, lpSymbol, quoteToken, token } = farm;
  const lpAddress = getAddress(lpAddresses);
  const lpContract = useErc20(lpAddress);
  const { onApprove } = useApproveFarm(lpContract);

  const handleApprove = useCallback(async () => {
    setRequestedApproval(true);
    try {
      const txStatus = await onApprove();
      farmsStore.fetchFarmUserDataAsync(user.address, [pid]);

      if (txStatus) {
        successNotification('Contract Enabled!', `You can now stake in the ${lpSymbol} farm!`);
      } else {
        clog(txStatus);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      }
    } catch (error) {
      clogError(error);
      errorNotification(
        'Error',
        'Please try again. Confirm the transaction and make sure you are paying enough gas!',
      );
    } finally {
      setRequestedApproval(false);
    }
  }, [onApprove, pid, lpSymbol, farmsStore, user.address]);

  const { modals } = useMst();

  const lpPrice = useLpTokenPrice(lpSymbol);

  const handleStake = useCallback(() => {
    modals.farmsStakeUnstake.open({
      isStaking: true,
      maxValue: tokenBalance.toString(),
      lpPrice: lpPrice.toString(),
      tokenSymbol: lpSymbol,
      farmId: pid,
      addLiquidityUrl: getAddLiquidityUrl(quoteToken, token),
    });
  }, [lpPrice, lpSymbol, modals.farmsStakeUnstake, pid, tokenBalance, quoteToken, token]);

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = new BigNumber(getBalanceAmount(stakedBalance));
    // if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
    //   return stakedBalanceBigNumber.toFixed(10);
    // }
    // if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
    //   return getFullDisplayBalance({ balance: stakedBalance });
    // }
    return stakedBalanceBigNumber.toFixed(Precisions.shortToken);
  }, [stakedBalance]);

  const displayBalanceAsUsd = useCallback(() => {
    return getBalanceAmount(stakedBalance.times(lpPrice)).toFixed(Precisions.fiat);
  }, [lpPrice, stakedBalance]);

  const renderActions = useMemo(() => {
    // Initial Workflow State
    if (!hasConnectedWallet) {
      return (
        <>
          <DetailsSectionTitle title="Start Farming" />
          <Button size="lg" onClick={connect}>
            <span className="text-smd text-white text-bold">Unlock Wallet</span>
          </Button>
        </>
      );
    }

    // Has Connected Wallet & Approved in Farm
    if (!needsApproval) {
      // Staked in Farm
      if (stakedBalance.gt(0)) {
        return (
          <>
            <DetailsSectionTitle title={`${lpSymbol} Staked`} />
            <div className="box-f box-f-jc-sb box-f-ai-e">
              <div className="farms-table-row__details-staked-values-group">
                <div className="farms-table-row__details-staked-value text-blue-d text-smd">
                  {displayBalance()}
                </div>
                <div className="text-gray text-smd">
                  ~{displayBalanceAsUsd()} {CURRENCY_CONVERT_TO}
                </div>
              </div>
              <FarmsStakeUnstakeButtons farm={farm} />
            </div>
          </>
        );
      }

      // Not Staked in Farm
      return (
        <>
          <DetailsSectionTitle title={`Stake ${lpSymbol}`} />
          <Button size="lg" onClick={handleStake}>
            <span className="text-smd text-white text-bold">Stake LP</span>
          </Button>
        </>
      );
    }

    if (!userDataLoaded) {
      return <Skeleton.Input style={{ width: 100 }} size="large" active />;
    }

    // Just Connected Wallet
    return (
      <>
        <DetailsSectionTitle title="Enable Farm" />
        <Button size="lg" disabled={requestedApproval} onClick={handleApprove}>
          <span className="text-smd text-white text-bold">Enable</span>
        </Button>
      </>
    );
  }, [
    hasConnectedWallet,
    connect,
    needsApproval,
    handleApprove,
    requestedApproval,
    stakedBalance,
    lpSymbol,
    displayBalance,
    displayBalanceAsUsd,
    handleStake,
    farm,
    userDataLoaded,
  ]);

  return (
    <div className={classNames(className, 'farms-table-row__details-box')}>{renderActions}</div>
  );
};

export default DetailsActionsSection;
