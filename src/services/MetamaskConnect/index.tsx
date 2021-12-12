import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { contracts } from '@/config';
import MetamaskService from '@/services/web3';
import rootStore from '@/store';

export interface IwalletConnectorContext {
  metamaskService: MetamaskService;
  connect: () => void;
  disconnect: () => void;
}

export const metamaskService = new MetamaskService({
  testnet: 'kovan',
  // isProduction: process.env.NODE_ENV === 'production',
});

export const walletConnectorContext = createContext<IwalletConnectorContext>({
  metamaskService,
  connect: (): void => {},
  disconnect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: metamaskService,
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;

    // eslint-disable-next-line prefer-destructuring
    const refFinanceMetamask: undefined | 'true' | 'false' = localStorage.refFinanceMetamask;
    const hasConnectedWallet = refFinanceMetamask
      ? (JSON.parse(refFinanceMetamask) as boolean)
      : false;

    if (hasConnectedWallet) {
      this.connect();
    }

    this.state.provider.createContract('FACTORY', contracts.FACTORY.ADDRESS, contracts.FACTORY.ABI);
    this.state.provider.createContract('ROUTER', contracts.ROUTER.ADDRESS, contracts.ROUTER.ABI);

    this.state.provider.chainChangedObs.subscribe({
      next(err: string) {
        rootStore.modals.metamaskErr.setErr(err);
      },
    });

    this.state.provider.accountChangedObs.subscribe({
      next() {
        self.disconnect();
      },
    });
  }

  connect = async () => {
    try {
      const { address } = await this.state.provider.connect();

      rootStore.user.setAddress(address);
      localStorage.refFinanceMetamask = true;
    } catch (err: any) {
      rootStore.modals.metamaskErr.setErr(err.message);
      this.disconnect();
    }
  };

  disconnect = () => {
    rootStore.user.disconnect();
  };

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          metamaskService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default withRouter(Connector);

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
