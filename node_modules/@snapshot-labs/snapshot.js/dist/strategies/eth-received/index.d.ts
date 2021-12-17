import { Web3Provider } from '@ethersproject/providers';
export declare const author = "mccallofthewild";
export declare const version = "0.1.0";
export declare function strategy(...args: [string, string, Web3Provider, string[], {
    coeff?: number;
    receivingAddresses: string[];
}, number]): Promise<{}>;
