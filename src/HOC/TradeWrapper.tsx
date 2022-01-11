import React from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';

import { contracts, tokens as configTokens } from '@/config';
import { metamaskService, walletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import rootStore from '@/store';
import { IToken, ITokens } from '@/types';
import { clog, clogError } from '@/utils/logger';

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
  tokensReserves: any;
  reservesInterval: any;
  pairAddress: string;
  maxFrom: number;
  maxTo: number;
  isLoadingExchange: boolean;
  isApproving: boolean;
}

const TradeWrapper = (
  Component: React.FC<any>,
  getExchangeMethod: 'swap' | 'liquidity',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  compProps?: any,
): any => {
  return class TradeWrapperComponent extends React.Component<any, ITradeWrapper, any> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = walletConnectorContext;

    // eslint-disable-next-line react/static-property-placement
    context!: React.ContextType<typeof walletConnectorContext>;

    constructor(props: any) {
      super(props);

      this.state = {
        tokensData: (localStorage[`refinery-finance-quote`] &&
          JSON.parse(localStorage[`refinery-finance-quote`])) || {
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
        tokensReserves: undefined,
        reservesInterval: null,
        pairAddress: '',
        maxFrom: NaN,
        maxTo: NaN,
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
      if (rootStore.user.address) {
        this.handleGetExchange(this.state.tokensData, rootStore.user.type);
        const interval = setInterval(async () => {
          if (
            this.state.pairAddress &&
            this.state.tokensData.from.token &&
            this.state.tokensData.to.token &&
            this.state.tokensData.to.amount &&
            this.state.tokensData.from.amount
          ) {
            await this.handleGetExchange(this.state.tokensData, rootStore.user.type);
          }
        }, 60000);

        this.setState({
          reservesInterval: interval,
        });
      }
    }

    componentDidUpdate() {
      localStorage[`refinery-finance-quote`] = JSON.stringify(this.state.tokensData);
    }

    componentWillUnmount() {
      if (this.state.reservesInterval) {
        clearInterval(this.state.reservesInterval);
      }
    }

    async handleApproveTokens() {
      try {
        if (!this.state.isAllowanceFrom && this.state.tokensData.from.token) {
          if (this.state.tokensData.from.token.symbol.toLowerCase() !== 'bnb') {
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
            toast.success(
              `Successfully approved token ${this.state.tokensData.from.token.symbol}!`,
            );
          } else {
            this.setState({
              isAllowanceFrom: true,
            });
          }
        }
        if (!this.state.isAllowanceTo && this.state.tokensData.to.token) {
          if (this.state.tokensData.to.token.symbol.toLowerCase() !== 'bnb') {
            this.setState({
              isApproving: true,
            });
            await this.context.metamaskService.approveToken({
              contractName: 'ERC20',
              approvedAddress: contracts.ROUTER.ADDRESS,
              tokenAddress: this.state.tokensData.to.token.address,
            });

            this.setState({
              isAllowanceTo: true,
            });
            toast.success(`Successfully approved token ${this.state.tokensData.to.token.symbol}!`);
          } else {
            this.setState({
              isAllowanceTo: true,
            });
          }
        }
        this.setState({
          isApproving: false,
        });
      } catch (err: any) {
        this.setState({
          isAllowanceFrom: false,
          isAllowanceTo: false,
          isApproving: false,
        });
        toast.error(`${err?.message ?? 'Approve token error :('}`);
        clogError('err approve tokens', err);
      }
    }

    async handleGetExchange(tokens: ITokens, type?: string) {
      if (!tokens.from.token || !tokens.to.token) {
        return;
      }
      try {
        this.setState({
          isLoadingExchange: true,
        });
        const isFromBnb = tokens.from.token.symbol.toLowerCase() === 'bnb';
        const isToBnb = tokens.to.token.symbol.toLowerCase() === 'bnb';

        const pairAddress = await this.context.metamaskService.callContractMethod(
          'FACTORY',
          'getPair',
          [
            isFromBnb ? configTokens.wbnb.address['97'] : tokens.from.token?.address,
            isToBnb ? configTokens.wbnb.address['97'] : tokens.to.token?.address,
          ],
          contracts.FACTORY.ADDRESS,
          contracts.FACTORY.ABI,
        );

        if (pairAddress === '0x0000000000000000000000000000000000000000') {
          if (type === 'from') {
            this.setState((prev) => ({
              tokensReserves: null,
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
              tokensReserves: null,
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
          pairAddress,
          tokensReserves: undefined,
        });

        if (
          tokens.from.token &&
          tokens.to.token &&
          (tokens.from.amount || tokens.to.amount) &&
          pairAddress
        ) {
          const token0 = await this.context.metamaskService.callContractMethodFromNewContract(
            pairAddress,
            contracts.PAIR.ABI,
            'token0',
          );

          const reserves = await this.context.metamaskService.callContractMethodFromNewContract(
            pairAddress,
            contracts.PAIR.ABI,
            'getReserves',
          );

          this.setState({
            tokensReserves: reserves,
          });

          let reserve1: number;
          let reserve2: number;
          // let tokenFirst: IToken;
          // let tokenSecond: IToken;

          if (
            (tokens.from.token.address.toLowerCase() ||
              configTokens.wbnb.address['97'].toLowerCase()) === token0.toLowerCase()
          ) {
            reserve1 = reserves['0'];
            reserve2 = reserves['1'];
            // tokenFirst = tokens.from.token;
            // tokenSecond = tokens.to.token;
          } else {
            reserve1 = reserves['1'];
            reserve2 = reserves['0'];
            // tokenFirst = tokens.to.token;
            // tokenSecond = tokens.from.token;
          }

          if (getExchangeMethod === 'swap') {
            this.setState({
              maxFrom: +MetamaskService.amountFromGwei(reserve1, +tokens.from.token.decimals),
              maxTo: +MetamaskService.amountFromGwei(reserve2, +tokens.to.token.decimals),
            });
            if (
              (type === 'from' && tokens.from.amount) ||
              (tokens.from.token && tokens.from.amount && !tokens.to.amount)
            ) {
              const amount = await this.context.metamaskService.callContractMethod(
                'ROUTER',
                'getAmountOut',
                [
                  MetamaskService.calcTransactionAmount(
                    tokens.from.amount,
                    +tokens.from.token.decimals,
                  ),
                  reserve1,
                  reserve2,
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
                    amount: MetamaskService.amountFromGwei(amount, +tokens.to.token.decimals),
                  },
                },
              });
            } else if (
              (type === 'to' && tokens.to.amount) ||
              (tokens.to.token && tokens.to.amount && !tokens.from.amount)
            ) {
              const amount = await this.context.metamaskService.callContractMethod(
                'ROUTER',
                'getAmountIn',
                [
                  MetamaskService.calcTransactionAmount(
                    tokens.to.amount,
                    +tokens.to.token.decimals,
                  ),
                  reserve1,
                  reserve2,
                ],
              );

              this.setState({
                tokensData: {
                  from: {
                    token: tokens.from.token,
                    amount: MetamaskService.amountFromGwei(amount, +tokens.from.token.decimals),
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
            const firstBalance = await metamaskService.callContractMethodFromNewContract(
              tokens.from.token.address || configTokens.wbnb.address['97'],
              contracts.ERC20.ABI,
              'balanceOf',
              [rootStore.user.address],
            );
            const secondBalance = await metamaskService.callContractMethodFromNewContract(
              tokens.to.token.address || configTokens.wbnb.address['97'],
              contracts.ERC20.ABI,
              'balanceOf',
              [rootStore.user.address],
            );
            const balanceFrom = MetamaskService.amountFromGwei(
              firstBalance,
              +tokens.from.token.decimals || 18,
            );
            const balanceTo = MetamaskService.amountFromGwei(
              secondBalance,
              +tokens.to.token.decimals || 18,
            );
            this.setState({
              maxFrom: +balanceFrom,
              maxTo: +balanceTo,
            });
            const firstPrice = new BigNumber(reserve1).dividedBy(reserve2).toString(10);
            const secondPrice = new BigNumber(reserve2).dividedBy(reserve1).toString(10);
            this.setState({
              tokensData: {
                from: {
                  token: tokens.from.token,
                  amount:
                    type === 'from'
                      ? tokens.from.amount
                      : new BigNumber(tokens.to.amount).times(firstPrice).toString(10),
                },
                to: {
                  token: tokens.to.token,
                  amount:
                    type === 'to'
                      ? tokens.to.amount
                      : new BigNumber(tokens.from.amount).times(secondPrice).toString(10),
                },
              },
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
        clog(1);
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
          pairAddress={this.state.pairAddress}
          tokensData={this.state.tokensData}
          setTokensData={this.handleChangeTokensData}
          setAllowanceFrom={this.handleChangeAllowanceFrom}
          setAllowanceTo={this.handleChangeAllowanceTo}
          isAllowanceFrom={this.state.isAllowanceFrom}
          isAllowanceTo={this.state.isAllowanceTo}
          handleApproveTokens={this.handleApproveTokens}
          tokensReserves={this.state.tokensReserves}
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
