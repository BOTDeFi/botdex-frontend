import { BigNumber } from '@ethersproject/bignumber/lib/bignumber';
import { Result } from '@ethersproject/abi';
export interface ModuleTransaction {
    to: string;
    value: string;
    data: string;
    operation: string;
    nonce: string;
}
export interface ProposalDetails {
    dao: string;
    oracle: string;
    cooldown: number;
    proposalId: string;
    questionId: string | undefined;
    executionApproved: boolean;
    finalizedAt: number | undefined;
    nextTxIndex: number | undefined;
    transactions: ModuleTransaction[];
    txHashes: string[];
    currentBond: BigNumber | undefined;
    isApproved: boolean;
    endTime: number | undefined;
}
export default class Plugin {
    author: string;
    version: string;
    name: string;
    website: string;
    options: any;
    validateTransaction(transaction: ModuleTransaction): boolean;
    calcTransactionHash(network: string, moduleAddress: string, transaction: ModuleTransaction): Promise<string>;
    calcTransactionHashes(chainId: number, moduleAddress: string, transactions: ModuleTransaction[]): Promise<string[]>;
    getExecutionDetails(network: string, moduleAddress: string, proposalId: string, transactions: ModuleTransaction[]): Promise<ProposalDetails>;
    getModuleDetails(network: string, moduleAddress: string): Promise<{
        dao: string;
        oracle: string;
        cooldown: number;
        minimumBond: number;
    }>;
    submitProposal(web3: any, moduleAddress: string, proposalId: string, transactions: ModuleTransaction[]): Promise<void>;
    loadClaimBondData(web3: any, network: string, questionId: string, oracleAddress: string): Promise<{
        tokenSymbol: string;
        tokenDecimals: number;
        canClaim: any;
        data: {
            length: string[];
            historyHashes: Result[];
            users: Result[];
            bonds: Result[];
            answers: Result[];
        };
    }>;
    claimBond(web3: any, oracleAddress: string, questionId: string, claimParams: [string[], string[], number[], string[]]): Promise<void>;
    executeProposal(web3: any, moduleAddress: string, proposalId: string, transactions: ModuleTransaction[], transactionIndex: number): Promise<void>;
    voteForQuestion(network: string, web3: any, oracleAddress: string, questionId: string, minimumBondInDaoModule: string, answer: '1' | '0'): Promise<void>;
}
