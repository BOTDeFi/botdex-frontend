import { Web3Provider } from '@ethersproject/providers';
export default class Client {
    readonly address: string;
    constructor(address?: string);
    request(command: string, body?: any): Promise<unknown>;
    send(msg: any): Promise<unknown>;
    getSpaces(): Promise<unknown>;
    broadcast(web3: Web3Provider, account: string, space: string, type: string, payload: any): Promise<unknown>;
    sign(web3: Web3Provider, account: string, space: string, type: string, payload: any): Promise<any>;
    vote(web3: Web3Provider, address: string, space: any, { proposal, choice, metadata }: {
        proposal: any;
        choice: any;
        metadata?: {} | undefined;
    }): Promise<unknown>;
    proposal(web3: Web3Provider, address: string, space: string, { name, body, choices, start, end, snapshot, type, metadata }: {
        name: any;
        body: any;
        choices: any;
        start: any;
        end: any;
        snapshot: any;
        type?: string | undefined;
        metadata?: {} | undefined;
    }): Promise<unknown>;
    deleteProposal(web3: Web3Provider, address: string, space: string, { proposal }: {
        proposal: any;
    }): Promise<unknown>;
    settings(web3: Web3Provider, address: string, space: string, settings: any): Promise<unknown>;
}
