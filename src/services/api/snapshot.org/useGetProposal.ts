import { useCallback } from 'react';
import { gql, LazyQueryHookOptions, QueryTuple, useLazyQuery } from '@apollo/client';

import { getSnapshotContext } from '@/services/apolloClient';

import { ISnapshotSpace, ProposalStatus, ProposalVotingSystem } from './types';

export interface IProposal {
  id: string;
  ipfs: string;
  title: string;
  body: string;
  choices: string[];
  author: string;
  start: number;
  end: number;
  state: ProposalStatus;
  type: ProposalVotingSystem;
  snapshot: string;
  space: ISnapshotSpace;
}

export interface IGetProposalResponse {
  proposal: IProposal;
}
export interface IGetProposalVariables {
  id: string;
}

export const GET_PROPOSAL = gql`
  query GetProposal($id: String) {
    proposal(id: $id) {
      id
      ipfs
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      type
      space {
        id
        name
      }
    }
  }
`;

/**
 * Get proposal information by its id.
 */
export const useGetProposal = (
  options?: LazyQueryHookOptions<IGetProposalResponse, IGetProposalVariables>,
): {
  getProposal: (id: string) => void;
  options: QueryTuple<IGetProposalResponse, IGetProposalVariables>; // ReturnType<typeof useLazyQuery>;
} => {
  const [func, responseData] = useLazyQuery<IGetProposalResponse, IGetProposalVariables>(
    GET_PROPOSAL,
    options,
  );

  const getProposal = useCallback(
    (id: string) => {
      func({
        ...getSnapshotContext(),
        variables: {
          id,
        },
      });
    },
    [func],
  );

  return { getProposal, options: [func, responseData] };
};
