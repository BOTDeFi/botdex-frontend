import { metamaskService } from '../MetamaskConnect';

export const getBlockNumber = (): Promise<number> =>
  metamaskService.web3Provider.eth.getBlockNumber();
