import { useCallback } from 'react';

import { errorNotification, successNotification } from '@/components/atoms/Notification';
import { SNAPSHOT_SPACE } from '@/config/constants/dao';
import { useSnapshotService } from '@/services/api/snapshot.org';
import { ProposalVotingSystem } from '@/services/api/snapshot.org/types';
import { useMst } from '@/store';
import { clogError } from '@/utils/logger';

interface ICreateProposalResult {
  id: string;
  ipfsHash: string;
  relayer: {
    address: string;
    receipt: string;
  };
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCreateProposal = ({
  onSuccessTx,
  onStartTx,
  onEndTx,
}: {
  onSuccessTx: (proposalCreationResult: ICreateProposalResult) => void;
  onStartTx: () => void;
  onEndTx: () => void;
}) => {
  const {
    user,
    dao: { getBlockNumberAsync },
  } = useMst();
  const { snapshotClient, provider } = useSnapshotService();

  const createProposal = useCallback(
    async (proposalData: { name: any; body: string; choices: any; start: number; end: number }) => {
      onStartTx();
      try {
        const blockNumber = await getBlockNumberAsync();
        const result = (await snapshotClient.proposal(provider, user.address, SNAPSHOT_SPACE, {
          ...proposalData,
          snapshot: blockNumber,
          // metadata: {
          //   plugins: {},
          //   network: metamaskService.usedChain,
          //   strategies: [strategies.erc20WithBalance],
          // },
          type: ProposalVotingSystem.singleChoice,
        })) as ICreateProposalResult;

        onSuccessTx(result);
        successNotification('Success', 'Created a new proposal!');
      } catch (error: any) {
        clogError(error);
        const errorMessage = error?.message ? error.message : new Error(error).message;
        errorNotification('Error', errorMessage);
      } finally {
        onEndTx();
      }
    },
    [snapshotClient, provider, user.address, getBlockNumberAsync, onStartTx, onSuccessTx, onEndTx],
  );

  return { createProposal };
};
