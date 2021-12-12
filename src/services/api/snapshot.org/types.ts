export type ProposalStatus = 'active' | 'closed' | 'pending';

export interface ISnapshotSpace {
  id: string;
  name: string;
}

export enum ProposalVotingSystem {
  singleChoice = 'single-choice',
}
