export default class Plugin {
    author: string;
    version: string;
    name: string;
    website: string;
    options: any;
    getTokenInfo(web3: any, tokenAddress: string): Promise<{
        address: string;
        checksumAddress: string;
        name: any;
        symbol: any;
    }>;
    getOmenCondition(network: string, conditionId: any): Promise<any>;
    getUniswapPair(network: string, token0: any, token1: any): Promise<any>;
}
