import Web3 from 'web3';
import BigNumber from 'bignumber.js/bignumber';
import config from '../../config/config_back';
import { isEqual } from "lodash/lang";

export default class BinanceService {
    constructor({ networkType, networkFrom, contractDetails }) {
        this.name = 'binance';
        this.wallet = window['BinanceChain'];
        this.networkFrom = networkFrom;
        this.net = networkType;
        this.Web3Provider = new Web3(this.wallet);
        this.wallet && this.wallet.on('chainChanged', () => {
            localStorage.setItem('walletTypeOnReload', 'binance');
            window.location.reload();
        });
        this.wallet && this.wallet.on('accountsChanged', newAccounts => {
            console.log("accountsChanged", newAccounts);
            localStorage.setItem('walletTypeOnReload', 'binance');
            const accounts = JSON.parse(localStorage.getItem("accounts"));
            if (!accounts || !isEqual(accounts.accounts, newAccounts)) {
                localStorage.setItem(
                    "accounts",
                    JSON.stringify({ accounts: newAccounts })
                );
                window.location.reload();
            }
            window.location.reload();
        });
        this.wallet && this.wallet.on('disconnect', () => {
            console.log('Binance wallet disconnected');
            localStorage.setItem('walletTypeOnReload', 'binance');
            window.location.reload();
        });
        this.contractAddressToken = contractDetails.ADDRESS.TOKEN[networkFrom];
        this.contractAddressSwap = contractDetails.ADDRESS.SWAP[networkFrom];
        this.contractAbiToken = contractDetails.ABI.TOKEN[networkFrom];
        this.contractAbiSwap = contractDetails.ABI.SWAP[networkFrom];
        this.contractDecimals = contractDetails.DECIMALS.TOKEN[networkFrom];
    }

    getAccount() {
        if (!this.wallet) throw new Error(`${this.name} wallet is not injected`);
        return new Promise((resolve, reject) => {
            const usedNet = config.chainIds[this.net][this.networkFrom].id;
            const netVersion = this.wallet.chainId;
            const neededNetName = config.chainIds[this.net][this.networkFrom].name;
            console.log('getAccount netVersion', netVersion);
            const messagePleaseChooseNet = () => reject({
                errorMsg: `Please choose ${neededNetName} network in your binance chain wallet`
            });
            const getAccounts = () => this.wallet.request({ method: 'eth_requestAccounts' })
                .then(account => resolve({
                    address: account[0],
                    network: netVersion,
                }))
                .catch(() => reject({ errorMsg: 'Not authorized' }));

            if (!netVersion || netVersion === null) {
                this.wallet.request({ method: 'eth_chainId' }).then(netVersion => {
                    if (usedNet.includes(netVersion)) {
                        getAccounts();
                    } else {
                        messagePleaseChooseNet();
                    }
                })
                    .catch(() => reject({ errorMsg: 'Not authorized' }));
            } else {
                if (usedNet.includes(netVersion)) {
                    getAccounts();
                } else {
                    messagePleaseChooseNet();
                }
            }
        });
    }

    getContract(abi, address) {
        return new this.Web3Provider.eth.Contract(abi, address);
    }

    async approveToken(walletAddress, tokenAddress, amount, callback,) {
        const gasPriceNet = await this.Web3Provider.eth.getGasPrice();
        const approveMethod = this.getMethodInterface('approve', this.contractAbiToken);
        const approveSignature = this.encodeFunctionCall(approveMethod, [
            tokenAddress,
            new BigNumber(amount).times(Math.pow(10, this.contractDecimals)).toString(10),
        ]);
        const approveTransaction = () => {
        // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
            const gasPrice = this.networkFrom === 'Binance-Smart-Chain' ?
                this.Web3Provider.utils.toHex('20000000000') : this.Web3Provider.utils.toHex(gasPriceNet);
            return this.sendTransaction({
                from: walletAddress,
                to: this.contractAddressToken,
                data: approveSignature,
                gasPrice,
            }, callback);
        };
        const transaction = {
            title: 'Authorise the contract, approving tokens',
            to: this.contractAddressToken,
            data: approveSignature,
            action: approveTransaction,
            onComplete: callback
        };
        this.createTransactionObj(transaction, walletAddress);
    }

    transferToOtherBlockchain({ userAddress, blockchain, amount, receiver, callback }) {
        const approveMethod = this.getMethodInterface('transferToOtherBlockchain', this.contractAbiSwap);
        const approveSignature = this.encodeFunctionCall(approveMethod, [
            `0x${blockchain}`,
            new BigNumber(+amount).times(Math.pow(10, this.contractDecimals)).toString(10),
            receiver,
        ]);
        const approveTransaction = () => {
        // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
            const gasPrice = this.networkFrom === 'Binance-Smart-Chain' ?
                this.Web3Provider.utils.toHex('20000000000') : undefined;
            return this.sendTransaction({
                from: userAddress,
                to: this.contractAddressSwap,
                data: approveSignature,
                gasPrice,
            }, callback);
        };
        const transaction = {
            title: 'transferToOtherBlockchain',
            to: this.contractAddressSwap,
            data: approveSignature,
            action: approveTransaction,
            onComplete: callback
        };
        this.createTransactionObj(transaction, userAddress);
    }

    async sendPlainTx({ addressFrom, amount, data }) {
        try {
            const accounts = await this.wallet.requestAccounts();
            const txHash = await this.wallet.transfer({
                fromAddress: addressFrom,
                toAddress: this.contractAddressSwap,
                asset: config.IS_PRODUCTION ? "WISH-2D5" : "WISHTST2-2BD", //TODO: from API
                amount,
                accountId: accounts[0].id,
                networkId: config.IS_PRODUCTION ? "bbc-mainnet" : "bbc-testnet",
                memo: data,
            });
            const txReceipt = new Promise((resolve, reject) => {
                const trxSubscription = setInterval(() => {
                    this.Web3Provider.eth.getTransactionReceipt(
                        txHash,
                        (error, transaction) => {
                            if (transaction) {
                                if (transaction.status) {
                                    resolve(transaction);
                                } else {
                                    reject(error);
                                }
                                clearInterval(trxSubscription);
                            }
                            if (error) {
                                clearInterval(trxSubscription);
                            }
                        },
                    );
                }, 1000);
            });
            return await txReceipt;
        } catch (e) {
            console.error(e);
        }
    }

    async sendTx(methodName, addressFrom, data, amount) {
        try {
            const method = this.getMethodInterface(methodName, this.contractAbiSwap);
            const signature = this.encodeFunctionCall(method, data);
            const params = {
                from: addressFrom,
                to: this.contractAddressSwap,
                value: amount,
                data: signature,
            };
            const txHash = await this.wallet.request({
                method: 'eth_sendTransaction',
                params: [params],
            });
            const txReceipt = new Promise((resolve, reject) => {
                const trxSubscription = setInterval(() => {
                    this.Web3Provider.eth.getTransactionReceipt(
                        txHash,
                        (error, transaction) => {
                            if (transaction) {
                                if (transaction.status) {
                                    resolve(transaction);
                                } else {
                                    reject(error);
                                }
                                clearInterval(trxSubscription);
                            }
                            if (error) {
                                clearInterval(trxSubscription);
                            }
                        },
                    );
                }, 1000);
            });
            return await txReceipt;
        } catch (e) {
            console.error(e);
        }
    }

    encodeFunctionCall(abi, data) {
        return this.Web3Provider.eth.abi.encodeFunctionCall(abi, data);
    }

    getMethodInterface(methodName, abi) {
        return abi.filter(m => m.name === methodName)[0];
    }

    prepareTransaction(wallet, transaction) {
        transaction.action(wallet);
    }

    createTransactionObj(transaction, walletAddress) {
        this.prepareTransaction({
            type: 'metamask',
            address: walletAddress,
        }, transaction);
    }

    sendTransaction(transactionConfig, callback,) {
        this.wallet.request({
            method: 'eth_sendTransaction',
            params: [transactionConfig]
        }).then(res => {
            callback({ status: 'SUCCESS', data: res });
        }).catch(error => {
            console.log(error, 'error');
            callback({ status: 'ERROR', error });
        });
    }

    async checkPending({ hash }) {
        try {
            return new Promise(resolve => {
                const interval = setInterval(async () => {
                    try {
                        const block = await this.Web3Provider.eth.getBlock("latest");
                        const transactions = block.transactions;
                        if (transactions.includes(hash)) {
                            console.log('checkPending', block);
                            clearInterval(interval);
                            resolve({ status: 'SUCCESS', data: true });
                        }
                    } catch (e) {
                        console.error(e);
                        clearInterval(interval);
                        resolve({ status: 'ERROR', error: e });
                    }
                }, 500);
            });
        } catch (e) {
            console.error(e);
        }
    }
}
