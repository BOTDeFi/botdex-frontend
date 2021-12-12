import { useCallback } from 'react';
import { gql, LazyQueryHookOptions, QueryTuple, useLazyQuery } from '@apollo/client';

import { getSnapshotContext } from '@/services/apolloClient';

import { ISnapshotSpace } from './types';

export interface IProposalVote {
  id: string;
  voter: string;
  created: number;
  choice: number;
  space: ISnapshotSpace;
}

export interface IProposalVoteWithVotingPower extends IProposalVote {
  votingPower: string;
}

export interface IGetProposalVotesResponse {
  votes: IProposalVote[];
}
export interface IGetProposalVotesVariables {
  proposalId: string;
}

// Response example
// "votes": [
//   {
//     "id": "QmcPeDcbcazmAm5rMtfvE7VVAW7xcDA6igrzb1WwQcWhKC",
//     "voter": "0xd3D7080FDdC88277C18D6e63Acc86c5437088b41",
//     "created": 1630457828,
//     "choice": 2,
//     "space": {
//       "id": "pancake"
//     }
//   }
// ]

export const GET_VOTES = gql`
  query GetVotes($proposalId: String!) {
    votes(where: { proposal: $proposalId }) {
      id
      voter
      created
      choice
      space {
        id
      }
    }
  }
`;

/**
 * Get votes list for the given proposal by its id.
 */
export const useGetProposalVotes = (
  options?: LazyQueryHookOptions<IGetProposalVotesResponse, IGetProposalVotesVariables>,
): {
  getProposalVotes: (id: string) => void;
  options: QueryTuple<IGetProposalVotesResponse, IGetProposalVotesVariables>;
} => {
  const [func, responseData] = useLazyQuery<IGetProposalVotesResponse, IGetProposalVotesVariables>(
    GET_VOTES,
    options,
  );

  const getProposalVotes = useCallback(
    (proposalId: string) => {
      func({
        ...getSnapshotContext(),
        variables: {
          proposalId,
        },
      });
    },
    [func],
  );

  return { getProposalVotes, options: [func, responseData] };
};
