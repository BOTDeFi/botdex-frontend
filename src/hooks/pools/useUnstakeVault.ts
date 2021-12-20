import { useCallback } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { Contract } from 'web3-eth-contract';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { getContract } from '@/services/web3/contractHelpers';
import { useCallWithGasPrice } from '@/services/web3/hooks';
import { convertRefineryToShares, IConvertRefineryToSharesResult } from '@/store/pools/helpers';
import { useSelectVaultData } from '@/store/pools/hooks';
import { clogData, clogError } from '@/utils/logger';

import { useUpdateView } from './useUpdateView';

const gasOptions = { gas: 380000 };

export const useVaultUnstakeActions = (onFinally: () => void) => {
  const { updateViewByFetchingBlockchainData } = useUpdateView();
  const { callWithGasPrice } = useCallWithGasPrice();

  const withdraw = useCallback(
    async (
      refineryVaultContract: Contract,
      shareStakeToWithdraw: IConvertRefineryToSharesResult,
    ) => {
      clogData(
        'Converted to Shares UNSTAKING VALUE',
        shareStakeToWithdraw.sharesAsBigNumber.toFixed(0, BigNumber.ROUND_DOWN),
      );
      try {
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'withdraw',
          methodArgs: [shareStakeToWithdraw.sharesAsBigNumber.toFixed(0, BigNumber.ROUND_DOWN)],
          options: gasOptions,
        });
        if (tx.status) {
          successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet');
          updateViewByFetchingBlockchainData();
        }
      } catch (error) {
        clogError(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        onFinally();
      }
    },
    [callWithGasPrice, updateViewByFetchingBlockchainData, onFinally],
  );

  const withdrawAll = useCallback(
    async (refineryVaultContract: Contract) => {
      try {
        const tx = await callWithGasPrice({
          contract: refineryVaultContract,
          methodName: 'withdrawAll',
          methodArgs: undefined,
          options: gasOptions,
        });
        if (tx.status) {
          successNotification('Unstaked!', 'Your earnings have also been harvested to your wallet');
          updateViewByFetchingBlockchainData();
        }
      } catch (error) {
        clogError(error);
        errorNotification(
          'Error',
          'Please try again. Confirm the transaction and make sure you are paying enough gas!',
        );
      } finally {
        onFinally();
      }
    },
    [callWithGasPrice, updateViewByFetchingBlockchainData, onFinally],
  );

  return {
    withdraw,
    withdrawAll,
  };
};

export const useVaultUnstake = (onFinally: () => void) => {
  const refineryVaultContract = getContract('REFINERY_VAULT');

  const {
    pricePerFullShare,
    userData: { userShares },
  } = useSelectVaultData();

  const { withdraw, withdrawAll } = useVaultUnstakeActions(onFinally);

  const vaultUnstake = useCallback(
    async (valueToUnstakeDecimal: BigNumber) => {
      clogData('UNSTAKING VALUE', {
        valueToUnstakeDecimal,
        pricePerFullShare,
        valueToStakeDecimalToFixed: valueToUnstakeDecimal.toFixed(),
        pricePerFullShareToFixed: pricePerFullShare?.toFixed(),
        userShares,
      });

      if (!pricePerFullShare || !userShares) return;

      const shareStakeToWithdraw = convertRefineryToShares(
        valueToUnstakeDecimal,
        pricePerFullShare,
      );
      // trigger withdrawAll function if the withdrawal will leave 0.000001 RP1 or less
      const triggerWithdrawAllThreshold = convertRefineryToShares(
        new BigNumber(1000000000000),
        pricePerFullShare,
      ).sharesAsBigNumber;
      const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber);

      clogData(
        'TEST WITHDRAW ALL',
        userShares.toFixed(),
        shareStakeToWithdraw.sharesAsBigNumber.toFixed(),
        sharesRemaining.toFixed(),
        triggerWithdrawAllThreshold.toFixed(),
      );
      const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold);

      if (isWithdrawingAll) {
        await withdrawAll(refineryVaultContract);
      } else {
        await withdraw(refineryVaultContract, shareStakeToWithdraw);
      }
    },
    [refineryVaultContract, pricePerFullShare, userShares, withdraw, withdrawAll],
  );

  return { vaultUnstake };
};
