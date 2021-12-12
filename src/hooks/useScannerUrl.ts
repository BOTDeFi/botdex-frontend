import {
  metamaskService as metamaskServiceModule,
  useWalletConnectorContext,
} from '@/services/MetamaskConnect';
import { getBaseScannerUrl } from '@/utils/urlConstructors';

/**
 * @param postfix like 'block/131231231' or etc (WITHOUT SLASH)
 * @returns URL like `https://kovan.etherscan.io/${postfix}`
 */
export const useScannerUrl = (postfix: string): string => {
  const { metamaskService } = useWalletConnectorContext();
  const baseScannerUrl = getBaseScannerUrl(metamaskService.usedChain);
  return `${baseScannerUrl}/${postfix}`;
};

export const getScannerUrl = (postfix: string): string => {
  const baseScannerUrl = getBaseScannerUrl(metamaskServiceModule.usedChain);
  return `${baseScannerUrl}/${postfix}`;
};
