export declare const TOKEN_DISTRIBUTION_SUBGRAPH_URL: {
    1: string;
    4: string;
};
interface TokenLockWallets {
    [key: string]: string[];
}
export declare function getTokenLockWallets(_space: any, network: any, _provider: any, addresses: any, options: any, snapshot: any): Promise<TokenLockWallets>;
export {};
