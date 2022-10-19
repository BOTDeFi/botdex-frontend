import { metamaskService } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { getContract } from '@/services/web3/contractHelpers';

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

interface MulticallOptions {
  requireSuccess?: boolean;
}

export type MultiCallResponse<T> = T | null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const multicall = async <T = any>(
  abi: any[],
  calls: Call[],
  options: MulticallOptions = { requireSuccess: true },
): Promise<any> => {
  const { requireSuccess } = options;
  const multiCallContract = getContract('MULTICALL');
  const contract = metamaskService.getContract(calls[0].address, abi);
  const callData = calls.map((call) => {
    const { address, name, params } = call;
    const method = contract.methods[name];
    const txObject = params ? method(...params) : method();
    return [address.toLowerCase(), txObject.encodeABI()];
  });
  try {
    const returnData = await multiCallContract.methods
      .tryAggregate(requireSuccess, callData)
      .call();
    return returnData.map((call: any, index: number) => {
      const [result, data] = call;
      if (!result) return null;
      const methodInterface = MetamaskService.getMethodInterface(abi, calls[index].name);
      let decodedResult: any = [];
      try {
        decodedResult = metamaskService.web3Provider.eth.abi.decodeParameters(
          methodInterface.outputs,
          data,
        );
      } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.log(e, index, calls[index].name, calls[index].address);
      }

      return Array.from({
        ...decodedResult,
        // eslint-disable-next-line no-underscore-dangle
        length: decodedResult.__length__,
      });
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('multicall error', e);
    return [];
  }
};
