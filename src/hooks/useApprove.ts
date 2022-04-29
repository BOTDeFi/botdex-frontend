import React from 'react';

import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { TNullable } from '@/types';

export const useApprove = ({
  tokenName,
  approvedContractName,
  amount,
  walletAddress,
}: {
  tokenName: 'BOT' | 'BOTDEX_STAKING';
  approvedContractName: string;
  amount?: string | number;
  walletAddress: TNullable<string>;
}): [boolean, boolean, () => void] => {
  const { metamaskService } = useWalletConnectorContext();

  const [isApproved, setApproved] = React.useState(false);
  const [isApproving, setApproving] = React.useState(false);

  const handleApprove = React.useCallback(() => {
    setApproving(true);
    metamaskService
      .approveToken({
        contractName: 'BOT',
        approvedAddress: contracts.BOTDEX_STAKING.ADDRESS,
        tokenAddress: contracts.BOT.ADDRESS,
      })
      .then(() => {
        setApproved(true);
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.log('err approve stake', err);
        setApproved(false);
      })
      .finally(() => {
        setApproving(false);
      });
  }, [metamaskService]);

  React.useEffect(() => {
    if (walletAddress) {
      metamaskService
        .checkTokenAllowance2({
          contractName: tokenName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          approvedAddress: contracts[approvedContractName].ADDRESS,
          amount,
        })
        .then((res: boolean) => {
          setApproved(res);
        })
        .catch((err: any) => {
          setApproved(false);
          // eslint-disable-next-line no-console
          console.log('check approve stake modal', err);
        });
    }
  }, [metamaskService, amount, approvedContractName, tokenName, walletAddress]);

  return [isApproved, isApproving, handleApprove];
};
