import { BigNumber } from '@ethersproject/bignumber';
export declare const GRAPH_NETWORK_SUBGRAPH_URL: {
    1: string;
    4: string;
};
export declare const bnWEI: BigNumber;
export interface GraphAccountScores {
    [key: string]: number;
}
export declare function bdMulBn(bd: string, bn: string): BigNumber;
export declare function calcNonStakedTokens(totalSupply: string, totalTokensStaked: string, totalDelegatedTokens: string): number;
export declare function verifyResults(result: string, expectedResults: string, type: string): void;
