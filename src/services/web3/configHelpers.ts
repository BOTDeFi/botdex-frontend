import { GAS_PRICE_ETHERS } from '../../config';
import { metamaskService } from '../MetamaskConnect';

export const GAS_PRICE_GWEI = {
  default: metamaskService.web3Provider.utils.toWei(GAS_PRICE_ETHERS.default, 'gwei'),
  fast: metamaskService.web3Provider.utils.toWei(GAS_PRICE_ETHERS.fast, 'gwei'),
  instant: metamaskService.web3Provider.utils.toWei(GAS_PRICE_ETHERS.instant, 'gwei'),
  testnet: metamaskService.web3Provider.utils.toWei(GAS_PRICE_ETHERS.testnet, 'gwei'),
};
