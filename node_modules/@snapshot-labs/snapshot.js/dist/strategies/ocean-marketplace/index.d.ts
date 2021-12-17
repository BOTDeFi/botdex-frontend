import { BigNumber } from '@ethersproject/bignumber';
export declare const author = "w1kke";
export declare const version = "0.1.0";
export declare function bdToBn(bd: any, decimals: any): BigNumber;
export declare function strategy(space: any, network: any, provider: any, addresses: any, options: any, snapshot: any): Promise<{
    [x: string]: unknown;
    [x: number]: unknown;
}>;
