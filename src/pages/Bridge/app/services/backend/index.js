/* eslint-disable camelcase */
// import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';
import config from '../../config/config_back';

class BackendService {
    constructor() {
        // this.networks = null;
        this.networks = fetch(`${config.serverDomain()}/networks/`).then(async res => {
            const res2 = await res.json();
            console.log(res2);
            
            this.networks = await res.json();
            // this.networks = res;
        });
        this.netType = config.IS_PRODUCTION ? "mainnet" : "testnet";
    }

    async getDexList() {
        try {
            return fetch(config.serverDomain(), {
                mode: 'no-cors'
            });
        } catch (e) {
            console.error(e);
        }
    }

    async getDex() {
        try {
            await this.networks;
            const dex = this.networks[this.netType];
            const result = { tokens: dex };
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getGas({ network }) {
        try {
            const gas = await fetch(`${config.serverDomain()}/gas/${network}/`, {
                mode: 'no-cors'
            });
            return gas.json();
        } catch (e) {
            console.error(e);
        }
    }

    async updateNetworks() {
        try {
            let result = await fetch(`${config.serverDomain()}/networks/`, {
                mode: 'no-cors'
            });
            result = await result.json();
            this.networks = result;
        } catch (e) {
            console.error(e);
        }
    }

    async getFee(network) {
        try {
            await this.networks;
            const netId = network.id;
            const dex = this.networks[this.netType].filter(item => item.num === netId)[0];
            const { fee } = dex;
            const newFee = new BigNumber(fee).toString() * (10 ** 18);
            console.log('BackendService getFee:', newFee);
            return newFee;
        } catch (e) {
            console.error(e);
        }
    }

    async getMinimumAmount(network) {
        try {
            await this.networks;
            const netId = network.id;
            const dex = this.networks[this.netType].filter(item => item.num === netId)[0];
            const { min_amount } = dex;
            console.log('BackendService getMinimumAmount:', min_amount);
            return min_amount;
        } catch (e) {
            console.error(e);
        }
    }

    async getGasPriceLimit({ network }) {
        try {
            await this.networks;
            const netId = network.id;
            const dex = this.networks[this.netType].filter(item => item.num === netId)[0];
            const { gas_price_limit } = dex;
            console.log('BackendService getGasPriceLimit:', gas_price_limit);
            return gas_price_limit;
        } catch (e) {
            console.error(e);
        }
    }

    async getSwapHistory(address) {
        try {
            await this.networks;
            let result = await fetch(`${config.serverDomain()}/swap_history/${address}/`, {
                mode: 'no-cors'
            });
            result = await result.json();
            // console.log('BackendService getSwapHistory:', result);
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getDecimals({ netId }) {
        try {
            await this.networks;
            const dex = this.networks[this.netType].filter(item => item.num === netId)[0];
            const { decimals } = dex;
            console.log('BackendService getDecimals:', decimals);
            return decimals;
        } catch (e) {
            console.error(e);
        }
    }

    async getRecieve({ fromNetwork, toNetwork, isTestnet, amount }) {
        try {
            let result = await fetch(`${config.serverDomain()}/fee/`, {
                method: "POST",
                body: { from_network_num: fromNetwork, to_network_num: toNetwork, is_testnet: isTestnet, amount }
            });
            result = await result.json();
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async sendSwapInfo({ is_testnet, from_tx_hash, from_network_num, to_network_num, from_amount, from_address }) {
        try {
            let result = await fetch(`${config.serverDomain()}/swap/`, {
                method: "POST",
            });
            result = await result.json();
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}

const backendService = new BackendService();

export default backendService;
