import { BASE_THE_GRAPH_ROCK_AND_BLOCK_URI } from '.';

export const SNAPSHOT_BASE_URL = process.env.REACT_APP_SNAPSHOT_BASE_URL;
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`;
export const SNAPSHOT_SPACE = process.env.REACT_APP_SNAPSHOT_SPACE;

export const VOTING_API = `${BASE_THE_GRAPH_ROCK_AND_BLOCK_URI}/refinery-finance-pairs`;

export const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs';

export default {
  SNAPSHOT_BASE_URL,
  SNAPSHOT_API,
  SNAPSHOT_SPACE,
  VOTING_API,
  IPFS_GATEWAY,
};
