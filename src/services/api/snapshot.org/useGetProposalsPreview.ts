import { useCallback } from 'react';
import { gql, LazyQueryHookOptions, QueryTuple, useLazyQuery } from '@apollo/client';

import { SNAPSHOT_SPACE } from '@/config/constants/dao';
import { getSnapshotContext } from '@/services/apolloClient';
import { TimestampSeconds } from '@/types';

import { ProposalStatus } from './types';

export interface IProposalPreviewRaw {
  id: string;
  title: string;
  state: ProposalStatus;
  created: TimestampSeconds;
}
export interface IGetProposalsPreviewkResponse {
  proposals: IProposalPreviewRaw[];
}
export interface IGetProposalsPreviewVariables {
  first: number;
  skip: number;
  space: string;
}

export interface IProposalPreview extends Omit<IProposalPreviewRaw, 'state'> {
  status: ProposalStatus;
}
export type IProposalsPreview = IProposalPreview[];

export const GET_PROPOSALS_PREVIEW = gql`
  query GetProposalsPreview($first: Int!, $skip: Int!, $space: String!) {
    proposals(
      first: $first
      skip: $skip
      orderBy: "end"
      orderDirection: desc
      where: {
        space_in: [$space]
        # state: "closed"
      }
    ) {
      id
      title
      # body
      # choices
      # start
      # end
      # snapshot
      state
      # author
      # space {
      #   id
      #   name
      # }
      created
    }
  }
`;

/**
 * Get list of the proposals' previews.
 */
export const useGetProposalsPreview = (
  options?: LazyQueryHookOptions<IGetProposalsPreviewkResponse, IGetProposalsPreviewVariables>,
): {
  getProposalsPreview: (first?: number, skip?: number, space?: string) => void;
  options: QueryTuple<IGetProposalsPreviewkResponse, IGetProposalsPreviewVariables>;
} => {
  const [func, responseData] = useLazyQuery<
    IGetProposalsPreviewkResponse,
    IGetProposalsPreviewVariables
  >(GET_PROPOSALS_PREVIEW, options);

  const getProposalsPreview = useCallback(
    (first = 20, skip = 0, space = SNAPSHOT_SPACE) => {
      func({
        ...getSnapshotContext(),
        variables: {
          first,
          skip,
          space,
        },
      });
    },
    [func],
  );

  return { getProposalsPreview, options: [func, responseData] };
};

export const transformGetProposalsPreview = (
  data: IGetProposalsPreviewkResponse,
): IProposalsPreview => {
  return data.proposals.map((proposal) => {
    const { state, ...newData } = proposal;
    return {
      ...newData,
      status: state,
    };
  });
};

export const groupProposalsPreviewByStatus = (items: IProposalsPreview) => {
  const map: Record<string, IProposalsPreview> = {};
  items.forEach((it) => {
    const { status } = it;
    if (map[status]) {
      map[status].push(it);
    } else {
      map[status] = [it];
    }
  });
  return { map, keys: Object.keys(map) };
};

export const sortByCreated = (
  { created: created1 }: { created: TimestampSeconds },
  { created: created2 }: { created: TimestampSeconds },
): number => {
  return created2 - created1;
};
