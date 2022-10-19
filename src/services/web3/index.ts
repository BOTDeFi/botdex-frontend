/* eslint-disable */
import BigNumber from 'bignumber.js/bignumber';
import { Observable } from 'rxjs';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import rootStore from '@/store';
import { contracts } from '@/config';
import { clog } from '@/utils/logger';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
interface INetworks {
  [key: string]: string;
}

interface IMetamaskService {
  testnet: 'ropsten' | 'kovan' | 'rinkeby' | 'bsct' | 'polygont';
  isProduction?: boolean;
}

interface IChain {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  blockExplorerUrls: string[];
  nativeCurrency: INativeCurrency;
}
interface IChains {
  [key: string]: IChain;
}
interface INativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

const chainsParams: IChains = {
  // '0x1': {
  //   chainId: '0x1',
  //   rpcUrl: 'https://mainnet.infura.io/v3/93bd9cedc55f4d1c817829728897ea08',
  //   name: 'Ethereum Mainnet',
  //   blockExp: 'https://etherscan.io/',
  // },
  // '0x3': {
  //   chainId: '0x3',
  //   rpcUrl: 'https://ropsten.infura.io/v3/93bd9cedc55f4d1c817829728897ea08',
  //   name: 'Ropsten',
  //   blockExp: 'https://ropsten.etherscan.io/',
  // },
  // '0x2a': {
  //   chainId: '0x2a',
  //   rpcUrl: 'https://kovan.infura.io/v3/93bd9cedc55f4d1c817829728897ea08',
  //   name: 'Kovan',
  //   blockExp: 'https://kovan.etherscan.io/',
  // },
  // '0x4': {
  //   chainId: '0x4',
  //   rpcUrl: 'https://rinkeby.infura.io/v3/93bd9cedc55f4d1c817829728897ea08',
  //   name: 'Rinkeby',
  //   blockExp: 'https://rinkeby.etherscan.io/',
  // },
  '0x61': {
    chainId: '0x61',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    chainName: 'Binance Testnet',
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  '0x38': {
    chainId: '0x38',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    chainName: 'Binance Mainnet',
    blockExplorerUrls: ['https://bscscan.com/'],
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  '0x89': {
    chainId: '0x89',
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
    chainName: 'Polygon Mainnet',
    blockExplorerUrls: ['https://polygonscan.com/'],
    nativeCurrency: { name: 'POLYGON', decimals: 18, symbol: 'POLYGON' },
  },
  '0x13881': {
    chainId: '0x13881',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    chainName: 'Polygon Testnet',
    blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/'],
    nativeCurrency: { name: 'POLYGON', decimals: 18, symbol: 'MATIC' },
  },
};

const networks: INetworks = {
  mainnet: '0x38' || '0x89',
  mainnet2: '0x89', // polygon
  ropsten: '0x3',
  kovan: '0x2a',
  rinkeby: '0x4',
  bsct: '0x61',
  bsc: '0x38',
  polygont: '0x13881',
};

export default class MetamaskService {
  public wallet;
  public web3Provider;
  private readonly testnet: string;
  private readonly isProduction: boolean;
  public walletAddress = '';
  public chainChangedObs: any;
  public accountChangedObs: any;
  public usedNetwork: string;
  public usedChain: string[];
  public contracts: any = {};

  public self: MetamaskService;
  public networksToUse: number[];
  public networkToUseNow: number;
  public loading: boolean;
  public errorMessage: string;
  public accounts: any;
  public account: string;
  public hasWeb3Account: boolean;
  public currentNetworkId: number;

  constructor({ testnet, isProduction = false }: IMetamaskService) {
    this.self = this;
    this.loading = false;
    this.errorMessage = '';
    this.accounts = [];
    this.account = '';
    this.hasWeb3Account = false;
    this.currentNetworkId = 0;

    this.wallet = window.ethereum;
    this.web3Provider = new Web3(this.wallet);
    this.testnet = testnet;
    this.isProduction = isProduction;

    this.usedNetwork = this.isProduction ? 'mainnet' : this.testnet;
    this.usedChain = this.isProduction ? [networks.mainnet, networks.mainnet2] : [networks.bsct, networks.polygont];
    console.log("current url pathname = window.location.pathname = ", window.location.pathname);
    if(window.location.pathname.includes("bridge")) {
      // Bridge page use polygon #137 or BSC #56
      this.networksToUse = [56, 137];
    } else {
      // Use only BSC network
      this.networksToUse = [56];
    }
    console.log("this.networksToUse = ", this.networksToUse);
    this.networkToUseNow = 56;

    this.chainChangedObs = new Observable((subscriber) => {
      if (!this.wallet) {
        return;
      }

      this.wallet.on('chainChanged', () => {
        const currentChain: string = this.currentNetworkId.toString();
        if (!this.usedChain.includes(currentChain)) {
          this.changeNetwork(subscriber)
            .then((isChanged) => {
              if(isChanged) {
                console.debug("Is network changed: ", isChanged);
                if(window.web3.eth) {
                  window.web3.eth.net.getId()
                    .then((network: any) => {
                      let netID = network.toString()
                      console.debug("Is network id (netID): ", netID);
                    });
                }
              }
            });

          this.changeNetworkIfWeNeedIt(subscriber);
        } else {
          rootStore.modals.metamaskErr.close();
        }
        if (this.usedChain.includes(currentChain)) {
          this.connect(subscriber);
        }
      });
    });

    this.accountChangedObs = new Observable((subscriber) => {
      if (!this.wallet) {
        return;
      }

      this.wallet.on('accountsChanged', (accounts: any) => {
        // Time to reload your interface with accounts[0]!
        if(accounts && accounts.length > 0) {
          this.accounts = accounts;
          this.account = accounts[0];
          [this.walletAddress] = [accounts[0]];
          this.hasWeb3Account = true;
        } else {
          this.accounts = null;
          this.account = '';
          this.walletAddress = '';
          this.hasWeb3Account = false;
        }

        console.debug("Wallet on Account changed. accounts: ", this.account)
        subscriber.next(this.account);
      });
    });
  }

  ethRequestAccounts(): any {
    return this.wallet.request({ method: 'eth_requestAccounts' });
  }

  async checkNets(chainId = this.wallet.chainId): Promise<boolean> {
    const requiredChain = this.usedChain;
    if (requiredChain.includes(chainId)) {
      try {
        await this.wallet.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
        return true;
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await this.wallet.request({
              method: 'wallet_addEthereumChain',
              params: [chainsParams[requiredChain[0]]],
            });
            return true;
          } catch (addError: any) {
            clog(addError);
            return false;
          }
        } else {
          clog(switchError);
          return false;
        }
      }
    }
    return false;
  }

  async loadWeb3(subscriber: any) {
    console.debug("loadWeb3");
    if (window.ethereum) {
        console.debug("window.ethereum");
        window.web3 = new Web3(window.ethereum);
        try {
            console.debug("try eth_requestAccounts");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                .catch((error: any) => {
                    if (error.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        console.log('Please connect to Web3 Wallet.');
                    } else {
                        console.error(error);
                    }
                });
            console.debug("accounts: " + accounts);
            if(accounts && accounts.length > 0) {
              this.accounts = accounts;
              this.account = accounts[0];
              [this.walletAddress] = [accounts[0]];
              this.hasWeb3Account = true;
            }
        } catch (err: any) {
            this.showError(subscriber, err, "loadWeb3");
        }
    }
    else if (window.web3) {
        console.debug("window.web3");
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        this.showWarning(subscriber, 'Not detected any wallet. You will try any wallet with web3 support like Metamask!');
    }
    return window.web3;
  }

  async changeNetwork(subscriber: any) {
    if(window.location.pathname.includes("bridge")) {
      let web3 = window.web3;
      if (typeof web3.eth !== 'undefined') {
        let network = await web3.eth.net.getId();
        if(this.networksToUse.includes(network)) {
          return false;
        }
      }
    }
    console.debug("changeNetwork");
    let isChanged = false;
    // Check if MetaMask is installed
    // MetaMask injects the global API into window.ethereum
    let networkToUseHex = '';
    if (window.ethereum) {
        try {
            // check if the chain to connect to is installed
            networkToUseHex = "0x" + this.networkToUseNow.toString(16);

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkToUseHex }], // '0x61' chainId must be in hexadecimal numbers
            });

            isChanged = true;
        } catch (error: any) {
            // This error code indicates that the chain has not been added to MetaMask
            // if it is not, then install it into the user MetaMask
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: networkToUseHex, // '0x61'
                                rpcUrl: 'https://bsc-dataseed.binance.org/', // 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                            },
                        ],
                    });
                    isChanged = true;
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(error);
        }
    } else {
        // if no window.ethereum then MetaMask is not installed
        this.showError(subscriber, 'Web3 wallet is not installed. Please consider installing it: https://metamask.io/download.html', "changeNetwork");
    }
    return isChanged;
  }

  changeNetworkIfWeNeedIt = async(subscriber: any) => {
    // Please connect your Web3 to Polygon PoS Chain mumbai testnet network
    let isAlerted = false;
    try {
        let isGoodConnectedNetwork = false;

        // Check connection
        let web3 = window.web3;

        if (typeof web3.eth !== 'undefined') {
            let network = await web3.eth.net.getId();
            let netID = network.toString();

            console.debug("Network #: " + netID);
            switch (netID) {
                case "56":
                  network = "bsc-mainnet";
                  if(this.networksToUse.includes(56)) {
                      this.networkToUseNow = 56;
                      isGoodConnectedNetwork = true;
                  } else {
                      isGoodConnectedNetwork = false;
                  }
                  break;
                case "137":
                  network = "polygon-mainnet";
                  if(this.networksToUse.includes(137)) {
                      this.networkToUseNow = 137;
                      isGoodConnectedNetwork = true;
                  } else {
                      isGoodConnectedNetwork = false;
                  }
                  break;
                default:
                  network = 'unknown'
                  console.error('This is an unknown network.');
                  isGoodConnectedNetwork = false;
                  console.debug("netID: " + netID);
            }
            // If is not correct network, try to change it
            if (!isGoodConnectedNetwork) {
              console.debug("isGoodConnectedNetwork == false");
              let isChanged = await this.changeNetwork(subscriber);
              console.debug("Is network changed: ", isChanged);
              isGoodConnectedNetwork = isChanged;
              network = await web3.eth.net.getId();
              netID = network.toString();
            } else {
              console.debug("isGoodConnectedNetwork == true");
            }
            this.currentNetworkId = network;

            if (!isGoodConnectedNetwork) {
              console.log("Please connect your 1...subscriber=", subscriber)
              this.showWarning(subscriber, "Please connect your Wallet Web3 to Binance Smart Chain network.");
              return { isOk: false, isAlerted: true };
            } else {
              console.debug("isGoodConnectedNetwork #2 == true");
              if (netID !== "56" && netID !== "137") {
                console.log("Please connect your 2...subscriber=", subscriber)
                this.showWarning(subscriber, "Please connect your Web3 to Binance Smart Chain / Polygon Mainnet network. Current id is:" + netID.toString());
                return { isOk: false, isAlerted: true };
              } else {
                // Close error message if we have opened any
                rootStore.modals.metamaskErr.close();
              }
            }
        } else {
            console.error("ERROR (connectWallet): web3.eth is not defined!");
            return { isOk: false, isAlerted: true };
        }
    } catch (err: any) {
        const code = err.code;
        const message = err.message;
        let detail = "";
        if(err.data) {
            detail = err.data.message;
        }
        let errMessage = "ERROR: code(" + code + "), message (" + message + "). Detail: " + detail;
        this.showError(subscriber, errMessage, "connectWallet");
        return { isOk: false, isAlerted: true };
    } finally {
        this.loading = false;
    }
    return { isOk: true, isAlerted: isAlerted };
  }

  connectWallet = async (subscriber: any, message_: string) => {
    console.log("connect wallet. subscriber = ", subscriber);
    // Please connect your Web3 to Polygon PoS Chain mumbai testnet network
    let isAlerted = false;
    console.debug(message_);
    try {
        // Carga de Web3
        await this.loadWeb3(subscriber);
        await this.changeNetworkIfWeNeedIt(subscriber);
    } catch (err: any) {
        const code = err.code;
        const message = err.message;
        let detail = "";
        if(err.data) {
            detail = err.data.message;
        }
        let errMessage = "ERROR: code(" + code + "), message (" + message + "). Detail: " + detail;
        this.showError(subscriber, errMessage, "connectWallet");
        return { isOk: false, isAlerted: true };
    } finally {
        this.loading = false;
    }
    return { isOk: true, isAlerted: isAlerted };
  }

  showInfo(subscriber: any, message: string) {
    this.showMessage(subscriber, message, "INFORMATION");
  }

  showWarning(subscriber: any, message: string) {
      this.showMessage(subscriber, message, "WARNING");
  }

  showError(subscriber: any, err_: string, method_: string, title_ = "ERROR") {
    let msg = "";
    if(method_.length > 0) {
        msg = "ERROR (" + method_ + "): " + err_;
    } else {
        msg = err_;
    }
    this.showMessage(subscriber, msg, title_);
    console.error(msg);
    this.errorMessage = msg;
  }

  showMessage(subscriber: any, message: string, title: string) {
    // Show new info div
    const elemPopup = document.getElementById('popupInfo');
    if(elemPopup) {
      console.log('elemPopup in...');
      // Set info
      // Title
      const popupTitleText = document.getElementById('popupTitleText');
      if(popupTitleText) {
        popupTitleText.innerHTML = title;
      }
      // Title shadow
      const popupTitleShadow = document.getElementById('popupTitleShadow');
      if(popupTitleShadow) {
        popupTitleShadow.innerHTML = title;
      }
      // Description
      const popupDescription = document.getElementById('popupDescription');
      if(popupDescription) {
        popupDescription.innerHTML = message;
      }
      // Image
      const popupImg = document.getElementById('popupImg');
      if(popupImg) {
        const elImg = <HTMLImageElement>popupImg;
        elImg.alt = title;
      }

      // Show div
      elemPopup.style.position = 'absolute';
      elemPopup.style.left = '-0.0185px';
      elemPopup.style.top = '-0.0185px';
      elemPopup.style.display = 'block';
    } else if(subscriber) {
      // Show design window
      console.log('alert show by suscriber:', message);
      subscriber.next(message);
    } else if(rootStore && rootStore.modals && rootStore.modals.metamaskErr) {
      console.log('alert show by rootStore', message);
      rootStore.modals.metamaskErr.setErr(message);
    } else {
      console.log('alert show (last option):', message);
      // Show normal window
      window.alert(message);
    }
  }

  public async connect(subscriber: any): Promise<any> {
    console.log("connect suscriber=", subscriber);
    await this.connectWallet(subscriber, 'connect()');

    return new Promise((resolve, reject) => {
      resolve({
        address: this.account,
        network: this.currentNetworkId,
      });
    });
  }

  createContract(contractName: string, tokenAddress: string, abi: Array<any>): void {
    if (!this.contracts[contractName]) {
      const contract = this.getContract(tokenAddress, abi);
      this.contracts = {
        ...this.contracts,
        [contractName]: contract,
      };
    }
  }

  public getContract(tokenAddress: string, abi: Array<any>): Contract {
    return new this.web3Provider.eth.Contract(abi, tokenAddress);
  }

  getEthBalance(): any {
    return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  static getMethodInterface(abi: Array<any>, methodName: string): any {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  encodeFunctionCall(abi: any[] | any, data: Array<any>): any {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(tokenAddress: string, abi: Array<any>, tokenDecimals: number): Promise<number> {
    const contract = this.getContract(tokenAddress, abi);
    const totalSupply = await contract.methods.totalSupply().call();

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async getTokenInfo(
    address: string,
    abi: any[],
  ): Promise<{ name: any; decimals: any; symbol: any; address: any }> {
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

  async checkTokenAllowance2({
    contractName,
    approvedAddress,
    walletAddress,
    amount,
  }: {
    contractName: 'BOT' | 'BOTDEX_STAKING' | 'BOT_OLD' | 'BOTDEX_OLD_STAKING';
    approvedAddress?: string;
    walletAddress?: string;
    amount?: string | number;
  }): Promise<boolean> {
    try {
      const contract = this.getContract(
        contracts[contractName].ADDRESS,
        contracts[contractName].ABI,
      );
      const walletAdr = walletAddress || this.walletAddress;

      let result = await contract.methods
        .allowance(walletAdr, approvedAddress || contracts[contractName].ADDRESS)
        .call();

      const tokenDecimals = await this.getTokenDecimals(contracts[contractName].ADDRESS);

      result =
        result === '0'
          ? null
          : +new BigNumber(result).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
      return !!(result && new BigNumber(result).minus(amount || 0).isPositive());
    } catch (error) {
      return false;
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
    contractName: 'ROUTER' | 'ERC20' | 'PAIR' | 'BOT' | 'BOTDEX_STAKING' | 'BOT_OLD' | 'BOTDEX_OLD_STAKING';
    tokenDecimals?: number;
    approvedAddress?: string;
    walletAddress?: string;
    tokenAddress: string;
    approveSum?: number;
  }): Promise<boolean> {
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
      return !!(result && new BigNumber(result).minus(approveSum || 0).isPositive());
    } catch (error) {
      return false;
    }
  }

  async approveToken({
    contractName,
    approvedAddress,
    walletAddress,
    tokenAddress,
  }: {
    contractName: 'ROUTER' | 'ERC20' | 'PAIR' | 'BOTDEX_STAKING' | 'BOT' | 'BOTDEX_OLD_STAKING' | 'BOT_OLD';
    approvedAddress?: string;
    walletAddress?: string;
    tokenAddress: string;
  }): Promise<any> {
    try {
      const approveMethod = MetamaskService.getMethodInterface(
        contracts[contractName].ABI,
        'approve',
      );
      const approveSignature = this.encodeFunctionCall(approveMethod, [
        approvedAddress || walletAddress || this.walletAddress,
        new BigNumber(2).pow(256).minus(1).toFixed(0, 1),
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

  public async getTokenDecimals(address: string): Promise<any> {
    const contract = this.getContract(address, contracts.ERC20.ABI);

    return contract.methods.decimals().call();
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number): string {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toFixed(0).toString();
  }

  static amountFromGwei(amount: number | string, tokenDecimal: number): string {
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
    contractName: 'ROUTER' | 'FACTORY' | 'PAIR';
    tx?: any;
    toAddress?: string;
    fromAddress?: string;
    value?: any;
  }): any {
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

  signMsg(msg: string): any {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  async callContractMethod(
    contractName: string,
    methodName: string,
    data?: any[],
    contractAddress?: string,
    contractAbi?: Array<any>,
  ): Promise<any> {
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
  ): Promise<any> {
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

  sendTransaction(transactionConfig: any | string): any {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }
}
