import { StaticJsonRpcProvider } from '@ethersproject/providers';
export declare function verifyDefault(address: string, sig: string, hash: string, provider: StaticJsonRpcProvider): Promise<boolean>;
export declare function verifyOldVersion(address: string, sig: string, hash: string, provider: StaticJsonRpcProvider): Promise<boolean>;
export declare function verify(address: any, sig: any, hash: any, network?: string): Promise<boolean>;
