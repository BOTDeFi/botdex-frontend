import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'web3-eth-contract';

import useRefresh from '@/hooks/useRefresh';
import { IReceipt } from '@/types';

import { useWalletConnectorContext } from '../MetamaskConnect';

import { GAS_PRICE_GWEI } from './configHelpers';

interface ICallWithGasPrice {
  (params: {
    contract: Contract;
    methodName: string;
    methodArgs?: any[];
    options?: {
      from?: string;
      gasPrice?: string;
      gas?: number;
    };
  }): Promise<IReceipt>;
}

export function useGasPrice(): string {
  const { metamaskService } = useWalletConnectorContext();
  return metamaskService.usedNetwork === 'mainnet'
    ? GAS_PRICE_GWEI.default
    : GAS_PRICE_GWEI.testnet;
}

/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param options An options object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 */
export function useCallWithGasPrice() {
  const gasPrice = useGasPrice();
  const {
    metamaskService: { walletAddress: from },
  } = useWalletConnectorContext();

  const callWithGasPrice = useCallback<ICallWithGasPrice>(
    async ({ contract, methodName, methodArgs = [], options }) => {
      const contractMethod = contract.methods[methodName];
      const overrideOptions = {
        from: options?.from ? options.from : from,
        gasPrice: options?.gasPrice ? options.gasPrice : gasPrice,
        gas: options?.gas ? options.gas : 30000,
      };
      const tx: IReceipt = await contractMethod(...methodArgs).send(overrideOptions);

      return tx;
    },
    [gasPrice, from],
  );

  return { callWithGasPrice };
}

export const useBlock = () => {
  const { metamaskService } = useWalletConnectorContext();
  const [block, setBlock] = useState(0);
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const getBlock = async () => {
      const currentBlock = await metamaskService.web3Provider.eth.getBlockNumber();
      setBlock(currentBlock);
    };

    getBlock();
  }, [metamaskService.web3Provider.eth, fastRefresh]);

  return [block];
};
