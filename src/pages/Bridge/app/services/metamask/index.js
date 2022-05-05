import Web3 from "web3";
import BigNumber from 'bignumber.js/bignumber';
import { isEqual } from "lodash/lang";
import config from '../../config/config_back';
import { store } from "../../redux/store";
import userActions from "../../redux/actions-creators/userActions";
import walletActions from "../../redux/actions-creators/walletActions";

const setUserData = value => {
    store.dispatch(userActions.setUserData({ address: value }));
};

const setWalletType = value => {
    store.dispatch(walletActions.setWalletType(value));
};

export default class MetamaskService {
    constructor({ networkType, networkFrom, contractDetails }) {
        console.log("MetamaskService", contractDetails);
        this.name = "metamask";
        this.wallet = window.ethereum;
        this.networkFrom = networkFrom;
        this.net = networkType;
        this.providers = {};
        this.Web3Provider = new Web3(this.wallet);
        store.subscribe(() => {
            const state = store.getState();
            this.userAddress = state.user.address;
        });
        this.wallet &&
      this.wallet.on("chainChanged", () => {
          localStorage.setItem("walletTypeOnReload", "metamask");
          window.location.reload();
      });
        this.wallet &&
      this.wallet.on("accountsChanged", newAccounts => {
          console.log("accountsChanged", newAccounts);
          localStorage.setItem("walletTypeOnReload", "metamask");
          const accounts = JSON.parse(localStorage.getItem("accounts"));
          if (!accounts || !isEqual(accounts.accounts, newAccounts)) {
              localStorage.setItem(
                  "accounts",
                  JSON.stringify({ accounts: newAccounts })
              );
              window.location.reload();
          }
      });
        this.wallet &&
      this.wallet.on("disconnect", () => {
          console.log("Binance wallet disconnected");
          localStorage.setItem("walletTypeOnReload", "metamask");
          window.location.reload();
      });
        this.wallet &&
      this.wallet.on("message", message => {
          console.log("Metamask message", message);
      });
        this.contractAddressToken = contractDetails.ADDRESS.TOKEN[networkFrom];
        this.contractAddressSwap = contractDetails.ADDRESS.SWAP[networkFrom];
        this.contractAbiToken = contractDetails.ABI.TOKEN[networkFrom];
        this.contractAbiSwap = contractDetails.ABI.SWAP[networkFrom];
        this.contractDecimals = contractDetails.DECIMALS.TOKEN[networkFrom];
        this.gasPrice = this.networkFrom === "Binance-Smart-Chain" ?
            this.Web3Provider.utils.toHex("20000000000") :
            undefined;
    }

    getContractAddressToken() {
        return this.contractAddressToken;
    }

    async getAccount() {
        if (!this.wallet)
            return { errorMsg: `${this.name} wallet is not injected` };
        return new Promise((resolve, reject) => {
            const usedNet = config.chainIds[this.net][this.networkFrom].id;
            const netVersion = this.wallet.chainId;
            const neededNetName = config.chainIds[this.net][this.networkFrom].name;
            console.log("getAccount netVersion", netVersion);
            const messagePleaseChooseNet = () =>
                reject({
                    errorMsg: `Please choose ${neededNetName} network in your metamask wallet`,
                });
            const getAccounts = () =>
                this.wallet
                    .request({ method: "eth_requestAccounts" })
                    .then(account =>
                        resolve({
                            address: account[0],
                            network: netVersion,
                        })
                    )
                    .catch(() => reject({ errorMsg: "Not authorized" }));
            if (!netVersion || netVersion === null) {
                this.wallet
                    .request({ method: "eth_chainId" })
                    .then(netVersion => {
                        if (usedNet.includes(netVersion)) {
                            getAccounts();
                        } else {
                            messagePleaseChooseNet();
                        }
                    })
                    .catch(() => reject({ errorMsg: "Not authorized" }));
            } else {
                if (usedNet.includes(netVersion)) {
                    getAccounts();
                } else {
                    this.switchNetwork(this.networkFrom).then(res => {
                        if (res?.code === 4001) {
                            messagePleaseChooseNet();
                            setUserData('');
                            setWalletType('');
                        }
                    });
                }
            }
        });
    }

    getContract(abi, address) {
        return new this.Web3Provider.eth.Contract(abi, address);
    }

    validateAddress(address) {
        return this.Web3Provider.utils.isAddress(address);
    }

    transferToOtherBlockchain({
        userAddress,
        blockchain,
        amount,
        receiver,
        callback,
    }) {
        const approveMethod = this.getMethodInterface(
            "transferToOtherBlockchain",
            this.contractAbiSwap
        );
        const approveSignature = this.encodeFunctionCall(approveMethod, [
            `0x${blockchain}`,
            new BigNumber(+amount)
                .times(Math.pow(10, this.contractDecimals))
                .toString(10),
            receiver,
        ]);
        const approveTransaction = () => {
            // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
            const gasPrice =
        this.networkFrom === "Binance-Smart-Chain" ?
            this.Web3Provider.utils.toHex("20000000000") :
            undefined;
            return this.sendTransaction(
                {
                    from: userAddress,
                    to: this.contractAddressSwap,
                    data: approveSignature,
                    gasPrice,
                },
                callback
            );
        };
        const transaction = {
            title: "transferToOtherBlockchain",
            to: this.contractAddressSwap,
            data: approveSignature,
            action: approveTransaction,
            onComplete: callback,
        };
        this.createTransactionObj(transaction, userAddress);
    }

    approveToken(walletAddress, tokenAddress, amount, callback) {
        const approveMethod = this.getMethodInterface(
            "approve",
            this.contractAbiToken
        );
        const approveSignature = this.encodeFunctionCall(approveMethod, [
            tokenAddress,
            new BigNumber(amount)
                .times(Math.pow(10, this.contractDecimals))
                .toString(10),
        ]);
        const approveTransaction = () => {
            // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
            const gasPrice =
        this.networkFrom === "Binance-Smart-Chain" ?
            this.Web3Provider.utils.toHex("20000000000") :
            undefined;
            return this.sendTransaction(
                {
                    from: walletAddress,
                    to: this.contractAddressToken,
                    data: approveSignature,
                    gasPrice,
                },
                callback
            );
        };
        const transaction = {
            title: "Authorise the contract, approving tokens",
            to: this.contractAddressToken,
            data: approveSignature,
            action: approveTransaction,
            onComplete: callback,
        };
        this.createTransactionObj(transaction, walletAddress);
    }

    async sendTx(methodName, addressFrom, data, amount) {
        try {
            const method = this.getMethodInterface(methodName, this.contractAbiToken);
            const signature = this.encodeFunctionCall(method, data);
            const params = {
                from: addressFrom,
                to: this.contractAddressToken,
                value: amount,
                data: signature,
            };
            const txHash = await this.wallet.request({
                method: "eth_sendTransaction",
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
                        }
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
        this.prepareTransaction(
            {
                type: "metamask",
                address: walletAddress,
            },
            transaction
        );
    }

    sendTransaction(transactionConfig, callback) {
        this.wallet
            .request({
                method: "eth_sendTransaction",
                params: [transactionConfig],
            })
            .then(res => {
                // if (callback) setTimeout(() => {
                //   callback({status:'SUCCESS',data:res})
                // }, 5000)
                callback({ status: "SUCCESS", data: res });
            })
            .catch(error => {
                console.log(error, "error");
                callback({ status: "ERROR", error });
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
                            console.log("checkPending", block);
                            clearInterval(interval);
                            resolve({ status: "SUCCESS", data: true });
                        }
                    } catch (e) {
                        console.error(e);
                        clearInterval(interval);
                        resolve({ status: "ERROR", error: e });
                    }
                }, 500);
            });
        } catch (e) {
            console.error(e);
        }
    }

    async approveNew({ userAddress, contractAddress }) {
        try {
            const contract = this.getContract(this.contractAbiToken, this.contractAddressToken);
            const totalSupply = await contract.methods.totalSupply().call();
            const approve = await contract.methods.approve(contractAddress, totalSupply).send({ from: userAddress });
            return { status: 'SUCCESS', data: approve };
        } catch (e) {
            console.error(e);
            return { status: 'ERROR', data: null };
        }
    }

    async transferToOtherBlockchainNew({ userAddress, contractAddress, amount, blockchain, receiver }) {
        try {
            const amountBigNumber = new BigNumber(amount).times(Math.pow(10, this.contractDecimals)).toString(10);
            const contractSwap = this.getContract(this.contractAbiSwap, contractAddress);
            const transferToOtherBlockchain = await contractSwap.methods
                .transferToOtherBlockchain(`0x${blockchain}`, amountBigNumber, receiver)
                .send({ from: userAddress, gasPrice: this.gasPrice });
            return { status: 'SUCCESS', data: transferToOtherBlockchain };
        } catch (e) {
            console.error(e);
            return { status: 'ERROR', data: null };
        }
    }

    async approveAndTransfer({ userAddress, contractAddress, amount, blockchain, receiver }) {
        try {
            const contract = this.getContract(this.contractAbiToken, this.contractAddressToken);
            const totalSupply = await contract.methods.totalSupply().call();
            const approve = contract.methods.approve(contractAddress, totalSupply).send({ from: userAddress });
            const amountBigNumber = new BigNumber(amount).times(Math.pow(10, this.contractDecimals)).toString(10);
            const contractSwap = this.getContract(this.contractAbiSwap, contractAddress);
            const transferToOtherBlockchain = contractSwap.methods
                .transferToOtherBlockchain(`0x${blockchain}`, amountBigNumber, receiver)
                .send({ from: userAddress, gasPrice: this.gasPrice });
            const batch = new this.Web3Provider.BatchRequest();
            batch.add(approve);
            batch.add(transferToOtherBlockchain);
            const result = await batch.execute();
            return { status: 'SUCCESS', data: result };
        } catch (e) {
            console.error(e);
            return { status: 'ERROR', data: null };
        }
    }

    async sendManyTxs(arrayOfFunctions) {
        try {
            const batch = new this.Web3Provider.BatchRequest();
            arrayOfFunctions.map(item => batch.add(item));
            const result = await batch.execute();
            return { status: 'SUCCESS', data: result };
        } catch (e) {
            console.error(e);
            return { status: 'ERROR', data: null };
        }
    }

    async switchNetwork(networkFrom) {
        if (!this.wallet) return;
        networkFrom = typeof networkFrom === 'string' ? networkFrom : networkFrom.key;
        const networkData = config.chainIds[config.IS_PRODUCTION ? 'mainnet' : 'testnet'][networkFrom];
        if (+this.wallet.networkVersion === networkData.id[0]) return;
        try {
            return await this.wallet.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(networkData.id[0]) }],
            });
        } catch (e) {
            console.log(e);
            if (e.code === 4902) {
                console.log(
                    {
                        chainName: networkData.name,
                        chainId: Web3.utils.toHex(networkData.id[0]),
                        nativeCurrency: {
                            name: networkData.nativeCurrency.name,
                            decimals: networkData.nativeCurrency.decimals,
                            symbol: networkData.nativeCurrency.symbol },
                        rpcUrls: networkData.rpcUrls,
                    }
                );
                return await this.wallet.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: networkData.name,
                            chainId: Web3.utils.toHex(networkData.id[0]),
                            nativeCurrency: {
                                name: networkData.nativeCurrency.name,
                                decimals: networkData.nativeCurrency.decimals,
                                symbol: networkData.nativeCurrency.symbol },
                            rpcUrls: networkData.rpcUrls,
                        },
                    ],
                });
            }
            return e;
        }
    }
}
