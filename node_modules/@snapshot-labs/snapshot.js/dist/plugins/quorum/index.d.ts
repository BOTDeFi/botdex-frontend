export default class Plugin {
    author: string;
    version: string;
    name: string;
    /**
     * Returns the total voting power at specific snapshot
     */
    getTotalVotingPower(web3: any, quorumOptions: any, snapshot: string | number): Promise<any>;
}
