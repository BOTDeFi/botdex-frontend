import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import Web3 from 'web3';

import { IPFS_GATEWAY, SNAPSHOT_BASE_URL } from '@/config/constants/dao';
import { metamaskService } from '@/services/MetamaskConnect';

export const snapshotClient = new snapshot.Client(SNAPSHOT_BASE_URL);
// typecast to prevent page from "white unusable UI"
// (just show some data, can be "Error: Provider not set or invalid" when Metamask isn't connected)
export const provider = (metamaskService.web3Provider.currentProvider
  ? new Web3Provider(metamaskService.web3Provider.currentProvider as any)
  : new Web3()) as any;

export const getIpfsUrl = (ipfsHash: string): string => {
  return `${IPFS_GATEWAY}/${ipfsHash}`;
};

export const useSnapshotService = (): {
  snapshotClient: typeof snapshotClient;
  provider: typeof provider;
} => {
  return { snapshotClient, provider };
};
