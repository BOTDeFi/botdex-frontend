// import React from "react";
import BigNumber from 'bignumber.js/bignumber';
import config from '../../config/config_back';
// import Web3 from "web3";


export default class ContractService {
    constructor({ wallet, networkFrom, contractDetails }) {
        // console.log('ContractService:', networkFrom, contractDetails);
        this.wallet = wallet;
        this.net = config.IS_PRODUCTION ? "mainnet" : "testnet";
        this.networkFrom = networkFrom;
        this.contractAddressToken = contractDetails.ADDRESS.TOKEN[networkFrom];
        this.contractAddressSwap = contractDetails.ADDRESS.SWAP[networkFrom];
        this.contractAbiToken = contractDetails.ABI.TOKEN[networkFrom];
        this.contractAbiSwap = contractDetails.ABI.SWAP[networkFrom];
        this.decimals = contractDetails.DECIMALS.TOKEN[networkFrom];
        this.contractDetails = contractDetails;
        if (networkFrom === "Binance-Chain") return;
        this.contractToken = this.wallet.getContract(
            this.contractAbiToken,
            this.contractAddressToken
        );
        this.contractSwap = this.wallet.getContract(
            this.contractAbiSwap,
            this.contractAddressSwap
        );
    }

    async balanceOf(address) {
    // console.log('balanceOf',this.contractAddressToken,address,this.contractToken)
        try {
            const balance = await this.contractToken.methods
                .balanceOf(address)
                .call();
            return +new BigNumber(balance._hex ? parseInt(balance._hex) : balance)
                .dividedBy(new BigNumber(10).pow(this.decimals))
                .toFixed();
        } catch (error) {
            console.log(error, 'get balance');
        }
    }

    async balanceOfTo() {
        const balance = await this.contractToken.methods
            .balanceOf(this.contractAddressSwap)
            .call();
        return +new BigNumber(balance._hex ? parseInt(balance._hex) : balance)
            .dividedBy(new BigNumber(10).pow(this.decimals))
            .toFixed();
    }

    async allowance(address) {
    // console.log('allowance',address,this.contractAddressSwap)
        let allowance = await this.contractToken.methods
            .allowance(address, this.contractAddressSwap)
            .call();
        allowance = allowance.toString(10);
        return +new BigNumber(allowance)
            .dividedBy(new BigNumber(10).pow(this.decimals))
            .toString(10);
    }

    async totalSupply() {
        let totalSupply = await this.contractToken.methods.totalSupply().call();
        if (this.networkFrom === 'Tron') {
            totalSupply = new BigNumber(totalSupply._hex, 16).toString();
        }
        return +new BigNumber(totalSupply)
            .dividedBy(new BigNumber(10).pow(this.decimals))
            .toString(10);
    }

    async getGasPrice() {
        const gasPrice = await this.contractSwap.methods.maxGasPrice().call();
        console.log("gasPrice: ", gasPrice);
        return +gasPrice;
    }

    async getWeb3GasPrice() {
        const gasPrice = await this.wallet.Web3Provider.eth.getGasPrice();
        return +gasPrice;
    }

    async getFee(network) {
    // </blockchain_id> на любом swap-контракте, blockchain_id: 2 - Ethereum, 1 - BSC, комиссия без decimals

        console.log("getFee network", network);
        const getFee = await this.contractSwap.methods
            .feeAmountOfBlockchain(network === "Ethereum" ? 2 : (network === "Ethereum" ? 3 : 1))
            .call();

        return +new BigNumber(getFee)
            .dividedBy(new BigNumber(10).pow(this.decimals))
            .toString(10);
    }

    async getMinTokenAmount() {
        const minTokenAmount = await this.contractSwap.methods
            .minTokenAmount()
            .call();

        return +new BigNumber(minTokenAmount)
            .dividedBy(new BigNumber(10).pow(this.decimals))
            .toString(10);
    }

    async approveToken(address, callback) {
        const totalSupply = await this.totalSupply();
        this.wallet.approveToken(
            address,
            this.contractAddressSwap,
            totalSupply,
            callback,
        );
    }

    async transferFromBinanceChain({
        userAddress,
        blockchain,
        amount,
        receiver,
    }) {
        try {
            const data = `${blockchain}${receiver}`;
            return await this.wallet.sendPlainTx({
                addressFrom: userAddress,
                amount,
                data,
            });
        } catch (e) {
            console.error(e);
        }
    }

    async transferToOtherBlockchain({
        userAddress,
        blockchain,
        amount,
        receiver,
        callback,
    }) {
        this.wallet.transferToOtherBlockchain({
            userAddress,
            blockchain,
            amount,
            receiver,
            callback,
        });
    }

    async approveNew({
        userAddress,
    }) {
        return await this.wallet.approveNew({ userAddress, contractAddress: this.contractAddressSwap });
    }

    async transferToOtherBlockchainNew({
        userAddress,
        blockchain,
        amount,
        receiver,
    }) {
        return await this.wallet
            .transferToOtherBlockchainNew({
                userAddress,
                contractAddress: this.contractAddressSwap,
                amount, blockchain, receiver });
    }

    async approveAndTransfer({
        userAddress,
        blockchain,
        amount,
        receiver,
    }) {
        return await this.wallet
            .approveAndTransfer({
                userAddress,
                contractAddress: this.contractAddressSwap,
                amount, blockchain, receiver });
    }

    async sendManyTxs(arrayOfFunctions) {
        return await this.wallet.sendManyTxs(arrayOfFunctions);
    }

    async switchNetwork(networkFrom) {
        return await this.wallet.switchNetwork(networkFrom);
    }
}
