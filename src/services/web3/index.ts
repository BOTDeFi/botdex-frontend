import BigNumber from 'bignumber.js/bignumber';
import { Observable } from 'rxjs';
import Web3 from 'web3';

import { contracts } from '@/config';

declare global {
  interface Window {
    ethereum: any;
  }
}
interface INetworks {
  [key: string]: string;
}

interface IMetamaskService {
  testnet: 'ropsten' | 'kovan' | 'rinkeby' | 'bsct';
  isProduction?: boolean;
}

const networks: INetworks = {
  mainnet: '0x1',
  ropsten: '0x3',
  kovan: '0x2a',
  rinkeby: '0x4',
  bsct: '0x61',
  bsc: '0x38',
};

export default class MetamaskService {
  public wallet;

  public web3Provider;

  private testnet: string;

  private isProduction: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public usedNetwork: string;

  public usedChain: string;

  public contracts: any = {};

  constructor({ testnet, isProduction = false }: IMetamaskService) {
    this.wallet = window.ethereum;
    this.web3Provider = new Web3(this.wallet);
    this.testnet = testnet;
    this.isProduction = isProduction;

    this.usedNetwork = this.isProduction ? 'mainnet' : this.testnet;
    this.usedChain = this.isProduction ? networks.mainnet : networks[this.testnet];

    this.chainChangedObs = new Observable((subscriber) => {
      if (!this.wallet) {
        return;
      }

      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;

        if (currentChain !== this.usedChain) {
          subscriber.next(`Please choose ${this.usedNetwork} network in metamask wallet.`);
        }
      });
    });

    this.accountChangedObs = new Observable((subscriber) => {
      if (!this.wallet) {
        return;
      }

      this.wallet.on('accountsChanged', () => {
        subscriber.next();
      });
    });
  }

  ethRequestAccounts() {
    return this.wallet.request({ method: 'eth_requestAccounts' });
  }

  public connect() {
    if (!this.wallet) {
      return Promise.reject(
        new Error(`Couldn't find Metamask extension, check if it's installed and enabled.`),
      );
    }
    const currentChain = this.wallet.chainId;

    return new Promise((resolve, reject) => {
      if (!this.wallet) {
        reject(new Error(`metamask wallet is not injected`));
      }

      if (!currentChain || currentChain === null) {
        this.wallet
          .request({ method: 'eth_chainId' })
          .then((resChain: any) => {
            if (resChain === this.usedChain) {
              this.ethRequestAccounts()
                .then((account: any) => {
                  [this.walletAddress] = account;
                  resolve({
                    address: account[0],
                    network: resChain,
                  });
                })
                .catch(() => reject(new Error('Not authorized')));
            } else {
              reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet`));
            }
          })
          .catch(() => reject(new Error('Not authorized')));
      } else if (currentChain === this.usedChain) {
        this.ethRequestAccounts()
          .then((account: any) => {
            [this.walletAddress] = account;
            resolve({
              address: account[0],
              network: currentChain,
            });
          })
          .catch(() => reject(new Error('Not authorized')));
      } else {
        reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet.`));
      }
    });
  }

  createContract(contractName: string, tokenAddress: string, abi: Array<any>) {
    if (!this.contracts[contractName]) {
      const contract = this.getContract(tokenAddress, abi);
      this.contracts = {
        ...this.contracts,
        [contractName]: contract,
      };
    }
  }

  getContract(tokenAddress: string, abi: Array<any>) {
    return new this.web3Provider.eth.Contract(abi, tokenAddress);
  }

  getEthBalance() {
    return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(tokenAddress: string, abi: Array<any>, tokenDecimals: number) {
    const contract = this.getContract(tokenAddress, abi);
    const totalSupply = await contract.methods.totalSupply().call();

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async getTokenInfo(address: string, abi: any) {
    try {
      const contract = this.getContract(address, abi);
      const name = await contract.methods.name().call();
      const decimals = await contract.methods.decimals().call();
      const symbol = await contract.methods.symbol().call();

      return {
        name,
        decimals,
        symbol,
        address,
      };
    } catch (err) {
      throw new Error('err get token info');
    }
  }

  async checkTokenAllowance({
    contractName,
    tokenDecimals,
    approvedAddress,
    walletAddress,
    tokenAddress,
    approveSum,
  }: {
    contractName: 'ROUTER' | 'ERC20' | 'PAIR';
    tokenDecimals?: number;
    approvedAddress?: string;
    walletAddress?: string;
    tokenAddress: string;
    approveSum?: number;
  }) {
    let decimals = NaN;

    const contract = this.getContract(tokenAddress, contracts[contractName].ABI);

    if (!tokenDecimals) {
      const tokenInfo = await this.getTokenInfo(tokenAddress, contracts[contractName].ABI);
      decimals = tokenInfo.decimals;
    }
    const walletAdr = walletAddress || this.walletAddress;

    try {
      let result = await contract.methods.allowance(walletAdr, approvedAddress).call();

      result =
        result === '0'
          ? null
          : +new BigNumber(result)
              .dividedBy(new BigNumber(10).pow(tokenDecimals || decimals))
              .toString(10);
      if (result && new BigNumber(result).minus(approveSum || 0).isPositive()) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async approveToken({
    contractName,
    tokenDecimals,
    approvedAddress,
    walletAddress,
    tokenAddress,
  }: {
    contractName: 'ROUTER' | 'ERC20' | 'PAIR';
    tokenDecimals?: number;
    approvedAddress?: string;
    walletAddress?: string;
    tokenAddress: string;
  }) {
    try {
      let decimals = NaN;

      if (!tokenDecimals) {
        const tokenInfo = await this.getTokenInfo(tokenAddress, contracts[contractName].ABI);
        decimals = tokenInfo.decimals;
      }

      const approveMethod = MetamaskService.getMethodInterface(
        contracts[contractName].ABI,
        'approve',
      );

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        approvedAddress || walletAddress || this.walletAddress,
        new BigNumber(90071992.5474099).times(new BigNumber(10).pow(decimals || 8)).toString(10),
      ]);

      return this.sendTransaction({
        from: walletAddress || this.walletAddress,
        to: tokenAddress,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  static amountFromGwei(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  createTransaction({
    method,
    data,
    contractName,
    tx,
    toAddress,
    fromAddress,
    value,
  }: {
    method: string;
    data: Array<any>;
    contractName: 'ROUTER' | 'FACTORY';
    tx?: any;
    toAddress?: string;
    fromAddress?: string;
    value?: any;
  }) {
    const contract = contracts[contractName];
    const { ABI, ADDRESS } = contract;
    const transactionMethod = MetamaskService.getMethodInterface(ABI, method);

    let signature;
    if (transactionMethod.inputs.length) {
      signature = this.encodeFunctionCall(transactionMethod, data);
    }

    if (tx) {
      tx.from = fromAddress || this.walletAddress;
      tx.data = signature;

      return this.sendTransaction(tx);
    }
    return this.sendTransaction({
      from: fromAddress || this.walletAddress,
      to: toAddress || ADDRESS,
      data: signature || '',
      value: value || '',
    });
  }

  signMsg(msg: string) {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  async callContractMethod(
    contractName: string,
    methodName: string,
    data?: any[],
    contractAddress?: string,
    contractAbi?: Array<any>,
  ) {
    try {
      if (!this.contracts[contractName] && contractAddress && contractAbi) {
        await this.createContract(contractName, contractAddress, contractAbi);
      }

      if (this.contracts[contractName]) {
        const method = await this.contracts[contractName].methods[methodName];
        if (data) {
          return await method(...data).call();
        }
        return await method().call();
      }
    } catch (err: any) {
      throw new Error(err);
    }
    return new Error(`contract ${contractName} didn't created`);
  }

  async callContractMethodFromNewContract(
    contractAddress: string,
    abi: any[],
    methodName: string,
    data?: any[],
  ) {
    try {
      const contract = this.getContract(contractAddress, abi);
      const method = contract.methods[methodName];

      if (data) {
        return await method(...data).call();
      }
      return await method().call();
    } catch (err: any) {
      throw new Error(err);
    }
  }

  sendTransaction(transactionConfig: any) {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }
}
