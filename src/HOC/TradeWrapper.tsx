import React from 'react';

import { contracts } from '@/config';
import { walletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { IToken, ITokens } from '@/types';
import { clogError } from '@/utils/logger';

interface ITradeWrapper {
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  tokensData: {
    from: {
      token: IToken | undefined;
      amount: number | string;
    };
    to: {
      token: IToken | undefined;
      amount: number | string;
    };
  };
  tokensResurves: any;
  resurvesInterval: any;
  pairAddress: string;
  maxFrom: number | string;
  maxTo: number | string;
  isLoadingExchange: boolean;
  isApproving: boolean;
}

const TradeWrapper = (
  Component: React.FC<any>,
  getExchangeMethod: 'quote' | 'getAmountOut',
  compProps?: any,
) => {
  return class TradeWrapperComponent extends React.Component<any, ITradeWrapper, any> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = walletConnectorContext;

    // eslint-disable-next-line react/static-property-placement
    context!: React.ContextType<typeof walletConnectorContext>;

    constructor(props: any) {
      super(props);

      this.state = {
        tokensData: (localStorage[`refinery-finance-${getExchangeMethod}`] &&
          JSON.parse(localStorage[`refinery-finance-${getExchangeMethod}`])) || {
          from: {
            token: undefined,
            amount: NaN,
          },
          to: {
            token: undefined,
            amount: NaN,
          },
        },
        isAllowanceFrom: true,
        isAllowanceTo: true,
        tokensResurves: undefined,
        resurvesInterval: null,
        pairAddress: '',
        maxFrom: '',
        maxTo: '',
        isLoadingExchange: false,
        isApproving: false,
      };

      this.handleChangeTokensData = this.handleChangeTokensData.bind(this);
      this.handleApproveTokens = this.handleApproveTokens.bind(this);
      this.handleChangeAllowanceFrom = this.handleChangeAllowanceFrom.bind(this);
      this.handleChangeAllowanceTo = this.handleChangeAllowanceTo.bind(this);
      this.handleGetExchange = this.handleGetExchange.bind(this);
    }

    componentDidMount() {
      this.handleGetExchange(this.state.tokensData, 'from');
      if (getExchangeMethod !== 'quote') {
        const interval = setInterval(async () => {
          if (
            this.state.pairAddress &&
            this.state.tokensData.from.token &&
            this.state.tokensData.to.token &&
            this.state.tokensData.to.amount &&
            this.state.tokensData.from.amount
          ) {
            this.handleGetExchange(this.state.tokensData, 'from');
          }
        }, 60000);

        this.setState({
          resurvesInterval: interval,
        });
      }
    }

    componentDidUpdate() {
      localStorage[`refinery-finance-${getExchangeMethod}`] = JSON.stringify(this.state.tokensData);
    }

    componentWillUnmount() {
      if (this.state.resurvesInterval) {
        clearInterval(this.state.resurvesInterval);
      }
    }

    async handleApproveTokens() {
      try {
        if (!this.state.isAllowanceFrom && this.state.tokensData.from.token) {
          this.setState({
            isApproving: true,
          });
          await this.context.metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: contracts.ROUTER.ADDRESS,
            tokenAddress: this.state.tokensData.from.token.address,
          });
          this.setState({
            isAllowanceFrom: true,
          });
        }
        if (!this.state.isAllowanceTo && this.state.tokensData.to.token) {
          await this.context.metamaskService.approveToken({
            contractName: 'ERC20',
            approvedAddress: contracts.ROUTER.ADDRESS,
            tokenAddress: this.state.tokensData.to.token.address,
          });
          this.setState({
            isAllowanceTo: true,
          });
        }
        this.setState({
          isApproving: false,
        });
      } catch (err) {
        this.setState({
          isAllowanceFrom: false,
          isAllowanceTo: false,
          isApproving: false,
        });
        clogError('err approve tokens', err);
      }
    }

    async handleGetExchange(tokens: ITokens, type?: 'from' | 'to') {
      try {
        this.setState({
          isLoadingExchange: true,
        });

        const pairAddr = await this.context.metamaskService.callContractMethod(
          'FACTORY',
          'getPair',
          [tokens.from.token?.address, tokens.to.token?.address],
          contracts.FACTORY.ADDRESS,
          contracts.FACTORY.ABI,
        );

        if (pairAddr === '0x0000000000000000000000000000000000000000') {
          if (type === 'from') {
            this.setState((prev) => ({
              tokensResurves: null,
              pairAddress: '',
              isLoadingExchange: false,
              tokensData: {
                to: tokens.to,
                from: {
                  token: tokens.from.token,
                  amount:
                    prev.tokensData.from.token?.symbol !== tokens.from.token?.symbol
                      ? NaN
                      : tokens.from.amount,
                },
              },
            }));
          } else {
            this.setState((prev) => ({
              tokensResurves: null,
              pairAddress: '',
              isLoadingExchange: false,
              tokensData: {
                from: tokens.from,
                to: {
                  token: tokens.to.token,
                  amount:
                    prev.tokensData.to.token?.symbol !== tokens.to.token?.symbol
                      ? NaN
                      : tokens.to.amount,
                },
              },
            }));
          }
          return;
        }
        this.setState({
          pairAddress: pairAddr,
          tokensResurves: undefined,
        });

        if (
          tokens.from.token &&
          tokens.to.token &&
          (tokens.from.amount || tokens.to.amount) &&
          pairAddr
        ) {
          const token0 = await this.context.metamaskService.callContractMethodFromNewContract(
            pairAddr,
            contracts.PAIR.ABI,
            'token0',
          );

          const token1 = await this.context.metamaskService.callContractMethodFromNewContract(
            pairAddr,
            contracts.PAIR.ABI,
            'token1',
          );

          const resurves = await this.context.metamaskService.callContractMethodFromNewContract(
            pairAddr,
            contracts.PAIR.ABI,
            'getReserves',
          );

          this.setState({
            tokensResurves: resurves,
          });

          if (
            (type === 'from' && tokens.from.amount) ||
            (tokens.from.token && tokens.from.amount && !tokens.to.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.from.token.address.toLowerCase() === token0.toLowerCase()) {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            } else {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            }

            this.setState({
              maxFrom: MetamaskService.amountFromGwei(resurve1, +tokens.from.token.decimals),
              maxTo: MetamaskService.amountFromGwei(resurve2, +tokens.to.token.decimals),
            });

            const quote = await this.context.metamaskService.callContractMethod(
              'ROUTER',
              getExchangeMethod,
              [
                MetamaskService.calcTransactionAmount(
                  tokens.from.amount,
                  +tokens.from.token.decimals,
                ),
                resurve1,
                resurve2,
              ],
            );

            this.setState({
              tokensData: {
                from: {
                  token: tokens.from.token,
                  amount: tokens.from.amount,
                },
                to: {
                  token: tokens.to.token,
                  amount: MetamaskService.amountFromGwei(quote, +tokens.to.token.decimals),
                },
              },
            });
          } else if (
            (type === 'to' && tokens.to.amount) ||
            (tokens.to.token && tokens.to.amount && !tokens.from.amount)
          ) {
            let resurve1: number;
            let resurve2: number;
            if (tokens.to.token.address.toLowerCase() === token1.toLowerCase()) {
              resurve1 = resurves['1'];
              resurve2 = resurves['0'];
            } else {
              resurve1 = resurves['0'];
              resurve2 = resurves['1'];
            }

            this.setState({
              maxFrom: MetamaskService.amountFromGwei(resurve2, +tokens.from.token.decimals),
              maxTo: MetamaskService.amountFromGwei(resurve1, +tokens.to.token.decimals),
            });

            const quote = await this.context.metamaskService.callContractMethod(
              'ROUTER',
              getExchangeMethod,
              [
                MetamaskService.calcTransactionAmount(tokens.to.amount, +tokens.to.token.decimals),
                resurve1,
                resurve2,
              ],
            );

            this.setState({
              tokensData: {
                from: {
                  token: tokens.from.token,
                  amount: MetamaskService.amountFromGwei(quote, +tokens.from.token.decimals),
                },
                to: {
                  token: tokens.to.token,
                  amount: tokens.to.amount,
                },
              },
            });
          } else {
            this.setState({
              tokensData: tokens,
            });
          }
        } else {
          this.setState({
            tokensData: tokens,
          });
        }
        this.setState({
          isLoadingExchange: false,
        });
      } catch (err) {
        this.setState({
          isLoadingExchange: false,
        });
        clogError('get pair', err);
      }
    }

    handleChangeAllowanceFrom(value: boolean) {
      this.setState({
        isAllowanceFrom: value,
      });
    }

    handleChangeAllowanceTo(value: boolean) {
      this.setState({
        isAllowanceTo: value,
      });
    }

    handleChangeTokensData(tokensData: ITokens, type?: 'from' | 'to') {
      if (tokensData.from.amount === 0 || tokensData.to.amount === 0) {
        this.setState({
          tokensData: {
            from: {
              token: tokensData.from.token,
              amount: 0,
            },
            to: {
              token: tokensData.to.token,
              amount: 0,
            },
          },
        });
      } else if (tokensData.from.token && tokensData.to.token && type) {
        this.handleGetExchange(tokensData, type);
      } else {
        this.setState({
          tokensData,
        });
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          {...compProps}
          tokensData={this.state.tokensData}
          setTokensData={this.handleChangeTokensData}
          setAllowanceFrom={this.handleChangeAllowanceFrom}
          setAllowanceTo={this.handleChangeAllowanceTo}
          isAllowanceFrom={this.state.isAllowanceFrom}
          isAllowanceTo={this.state.isAllowanceTo}
          handleApproveTokens={this.handleApproveTokens}
          tokensResurves={this.state.tokensResurves}
          maxFrom={this.state.maxFrom}
          maxTo={this.state.maxTo}
          isLoadingExchange={this.state.isLoadingExchange}
          isApproving={this.state.isApproving}
        />
      );
    }
  };
  // TradeWrapperComponent.contextType = walletConnectorContext;

  // return TradeWrapperComponent;
};

export default TradeWrapper;
