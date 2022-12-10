import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import ArrowCImg from '@/assets/img/icons/arrow-circle.svg';
import ArrowImg from '@/assets/img/icons/arrow-cur.svg';
import { Button, InputNumber } from '@/components/atoms';
import SelectTokenModal from '@/components/sections/Trade/SelectTokenModal';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';
import { IToken, ITokens } from '@/types';
import { clogError } from '@/utils/logger';

import './ChooseTokens.scss';

export interface IChooseTokens {
  handleChangeTokens: (tokens: ITokens, type?: 'from' | 'to') => void;
  initialTokenData: ITokens;
  textFrom?: string;
  textTo?: string;
  changeTokenFromAllowance?: (value: boolean) => void;
  changeTokenToAllowance?: (value: boolean) => void;
  maxFrom?: number | string;
  maxTo?: number | string;
}

const ChooseTokens: React.FC<IChooseTokens> = observer(
  ({
    handleChangeTokens,
    initialTokenData,
    textFrom,
    textTo,
    changeTokenFromAllowance,
    changeTokenToAllowance,
    maxFrom,
    maxTo,
  }) => {
    const { user } = useMst();
    const { metamaskService } = useWalletConnectorContext();

    const [time, setTime] = React.useState<NodeJS.Timeout | null>(null);

    const [tokenFrom, setTokenFrom] = React.useState<IToken | undefined>(
      initialTokenData ? initialTokenData.from.token : undefined,
    );
    const [tokenFromQuantity, setTokenFromQuantity] = React.useState<number | string>(
      initialTokenData ? initialTokenData.from.amount : NaN,
    );

    const [tokenTo, setTokenTo] = React.useState<IToken | undefined>(
      initialTokenData ? initialTokenData.to.token : undefined,
    );
    const [tokenToQuantity, setTokenToQuantity] = React.useState<number | string>(
      initialTokenData ? initialTokenData.to.amount : NaN,
    );

    const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
    const [tokenType, setTokenType] = React.useState<'from' | 'to'>('from');

    const [balanceFrom, setBalanceFrom] = React.useState<string>('');
    const [balanceTo, setBalanceTo] = React.useState<string>('');

    const balanceInterval = React.useRef<NodeJS.Timeout | null>(null);

    const handleCloseSelectTokenModal = (): void => {
      setModalVisible(false);
    };

    const handleOpenSelectTokenModal = (type: 'from' | 'to'): void => {
      setModalVisible(true);
      setTokenType(type);
    };

    const handleChangeTokenFrom = async (token: IToken | undefined) => {
      if (token) {
        if (tokenTo && token.address === tokenTo.address) {
          setTokenTo(tokenFrom);
          setTokenToQuantity(tokenFromQuantity);
          setTokenFromQuantity(tokenToQuantity);
          setTokenFrom(token);

          handleChangeTokens(
            {
              from: {
                token,
                amount: initialTokenData?.to.amount || NaN,
              },
              to: {
                token: initialTokenData?.from.token,
                amount: initialTokenData?.from.amount || NaN,
              },
            },
            'from',
          );
          return;
        }

        handleChangeTokens(
          {
            from: {
              token,
              amount: initialTokenData?.from.amount || NaN,
            },
            to: {
              token: initialTokenData?.to.token,
              amount: initialTokenData?.to.amount || NaN,
            },
          },
          'from',
        );
        setTokenFrom(token);
      }
    };

    const handleChangeTokenTo = (token: IToken | undefined): void => {
      if (token) {
        if (tokenFrom && token.address === tokenFrom.address) {
          setTokenFrom(tokenTo);
          setTokenFromQuantity(tokenToQuantity);
          setTokenToQuantity(tokenFromQuantity);
          setTokenTo(token);

          handleChangeTokens(
            {
              from: {
                token: initialTokenData?.to.token,
                amount: initialTokenData?.to.amount || NaN,
              },
              to: {
                token,
                amount: initialTokenData?.from.amount || NaN,
              },
            },
            'to',
          );
          return;
        }

        handleChangeTokens(
          {
            from: {
              token: tokenFrom,
              amount: tokenFromQuantity,
            },
            to: {
              token,
              amount: tokenToQuantity,
            },
          },
          'to',
        );
        setTokenTo(token);
      }
    };

    const handleChangeToken = (type: 'from' | 'to', token: IToken | undefined) => {
      if (type === 'from') {
        handleChangeTokenFrom(token);
      }
      if (type === 'to') {
        handleChangeTokenTo(token);
      }
    };

    const handleSwapPositions = React.useCallback(() => {
      if (initialTokenData) {
        setTokenFrom(initialTokenData.to.token);
        setTokenTo(initialTokenData.from.token);
        handleChangeTokens(
          {
            from: initialTokenData.to,
            to: initialTokenData.from,
          },
          'from',
        );
      }
    }, [handleChangeTokens, initialTokenData]);

    const handleCheckAllowance = React.useCallback(
      async (inputValue?: string | number) => {
        try {
          if (tokenFrom?.address && tokenFrom.symbol.toLowerCase() !== 'bnb') {
            const allowanceFrom = await metamaskService.checkTokenAllowance({
              contractName: 'ERC20',
              approvedAddress: contracts.ROUTER.ADDRESS,
              tokenAddress: tokenFrom?.address,
              approveSum: inputValue ? +inputValue : +initialTokenData.from.amount,
            });
            if (changeTokenFromAllowance) changeTokenFromAllowance(allowanceFrom);
          }
          if (tokenTo?.address && tokenTo.symbol.toLowerCase() !== 'bnb') {
            const allowanceTo = await metamaskService.checkTokenAllowance({
              contractName: 'ERC20',
              approvedAddress: contracts.ROUTER.ADDRESS,
              tokenAddress: tokenTo?.address,
              approveSum: inputValue ? +inputValue : +initialTokenData.to.amount,
            });
            if (changeTokenToAllowance) changeTokenToAllowance(allowanceTo);
          }
          if (
            tokenFrom?.symbol &&
            tokenFrom.symbol.toLowerCase() === 'bnb' &&
            changeTokenFromAllowance
          ) {
            changeTokenFromAllowance(true);
          }
          if (tokenTo?.symbol && tokenTo.symbol.toLowerCase() === 'bnb' && changeTokenToAllowance) {
            changeTokenToAllowance(true);
          }
        } catch (err) {
          clogError(err, 'err check token allowance');

          if (changeTokenFromAllowance) {
            changeTokenFromAllowance(false);
          }
          if (changeTokenToAllowance) {
            changeTokenToAllowance(false);
          }
        }
      },
      [
        changeTokenFromAllowance,
        changeTokenToAllowance,
        initialTokenData.from.amount,
        initialTokenData.to.amount,
        metamaskService,
        tokenFrom?.address,
        tokenTo?.address,
        tokenTo?.symbol,
        tokenFrom?.symbol,
      ],
    );

    const handleChangeTokensQuantity = React.useCallback(
      async (type: 'from' | 'to', quantity: number) => {
        user.changeType(type);
        if (time) {
          clearTimeout(time);
        }
        let timerId: NodeJS.Timeout | null = null;
        if (type === 'from') {
          // setTokenFromQuantity(quantity);
          timerId = setTimeout(() => {
            handleCheckAllowance(quantity);
            if (+balanceFrom > 0) {
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: quantity > +balanceFrom ? +balanceFrom : quantity,
                  },
                  to: {
                    token: tokenTo,
                    amount: initialTokenData?.to.amount || NaN,
                    // amount: quantity === 0 ? initialTokenData?.to.amount || NaN : 0,
                  },
                },
                'from',
              );
            }
          }, 500);
        }
        if (type === 'to') {
          // setTokenToQuantity(quantity);
          timerId = setTimeout(() => {
            handleCheckAllowance(quantity);
            if (+balanceFrom > 0 && +balanceTo > 0) {
              handleChangeTokens(
                {
                  from: {
                    token: tokenFrom,
                    amount: initialTokenData?.from.amount || NaN,
                    // amount: quantity === 0 ? initialTokenData?.from.amount || NaN : 0,
                  },
                  to: {
                    token: tokenTo,
                    amount: quantity > +balanceTo ? +balanceTo : quantity,
                  },
                },
                'to',
              );
            }
          }, 500);
        }
        setTime(timerId);
      },
      [
        balanceFrom,
        balanceTo,
        handleChangeTokens,
        handleCheckAllowance,
        initialTokenData?.from.amount,
        initialTokenData?.to.amount,
        time,
        tokenFrom,
        tokenTo,
        user,
      ],
    );

    const handleGetBalance = React.useCallback(
      async (type: 'from' | 'to') => {
        try {
          if (initialTokenData[type] && initialTokenData[type].token && user.address) {
            let balance;
            if (initialTokenData[type].token?.symbol.toLowerCase() === 'bnb') {
              balance = await metamaskService.getEthBalance();
            } else {
              balance = await metamaskService.callContractMethodFromNewContract(
                initialTokenData[type].token?.address || '',
                contracts.ERC20.ABI,
                'balanceOf',
                [user.address],
              );
            }

            balance = MetamaskService.amountFromGwei(
              balance,
              +(initialTokenData[type].token?.decimals || 8),
            );

            if (type === 'from') {
              setBalanceFrom(balance);
            } else {
              setBalanceTo(balance);
            }
          }
        } catch (err) {
          clogError(`get balance ${type}`, err);
        }
      },
      [initialTokenData, metamaskService, user.address],
    );

    const handleMaxValue = React.useCallback(
      async (value) => {
        if (value === 'from') {
          await handleChangeTokensQuantity('from', +balanceFrom);
        } else {
          await handleChangeTokensQuantity('to', +balanceTo);
        }
      },
      [balanceFrom, balanceTo, handleChangeTokensQuantity],
    );

    React.useEffect(() => {
      setTokenFromQuantity(initialTokenData?.from.amount || NaN);
      setTokenToQuantity(initialTokenData?.to.amount || NaN);
    }, [initialTokenData?.from.amount, initialTokenData?.to.amount]);

    React.useEffect(() => {
      setTokenFrom(initialTokenData.from.token);
      setTokenTo(initialTokenData.to.token);
    }, [initialTokenData.from.token, initialTokenData.to.token]);

    React.useEffect(() => {
      handleGetBalance('from');
      handleGetBalance('to');
    }, [handleGetBalance, initialTokenData.from.token, initialTokenData.to.token]);

    React.useEffect(() => {
      handleCheckAllowance();
    }, [handleCheckAllowance]);

    React.useEffect(() => {
      if (!balanceInterval.current) {
        balanceInterval.current = setInterval(() => {
          handleGetBalance('from');
          handleGetBalance('to');
        }, 30000);
      }

      return () => {
        if (balanceInterval.current) {
          clearInterval(balanceInterval.current);
        }
      };
    }, [handleGetBalance, balanceInterval]);

    const bnbIcon = 'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png?1600947313';

    return (
      <>
        <div className="choose-tokens">
          {tokenFrom ? (
            <>
              <div className="box-f box-f-jc-sb choose-tokens__box-title">
                <div className="text-upper">{tokenFrom.symbol}</div>
                <div className="text-sm text-gray-2 text-500">{textFrom || 'From'}</div>
              </div>
              <div className="box-f box-f-jc-sb">
                <div
                  className="choose-tokens__currency box-f-ai-c"
                  onClick={() => handleOpenSelectTokenModal('from')}
                  onKeyDown={() => {}}
                  tabIndex={-1}
                  role="button"
                >
                  <img
                    src={tokenFrom.logoURI || (tokenFrom.symbol === 'BNB' ? bnbIcon : UnknownImg)}
                    alt=""
                    className="choose-tokens__currency-img"
                  />
                  <img src={ArrowImg} alt="" className="choose-tokens__currency-arrow" />
                </div>
                <div className="choose-tokens__err-wrapper">
                  <InputNumber
                    value={tokenFromQuantity}
                    colorScheme="darkgray"
                    placeholder="0"
                    max={maxFrom}
                    // onKeyDown={(e: any) => handleChangeTokensQuantity('from', +e.target.value)}
                    onChange={(value: number | string) =>
                      handleChangeTokensQuantity('from', +value)
                    }
                  />
                  {balanceFrom && (
                    <div className="choose-tokens__b-m-cont">
                      <div className="choose-tokens__b-m-cont__balance text-sm text-gray-2 text-address">{`Balance: ${new BigNumber(
                        balanceFrom,
                      ).toFixed(5, 1)}`}</div>
                      <div
                        onClick={() => handleMaxValue('from')}
                        onKeyDown={() => {}}
                        tabIndex={-1}
                        role="button"
                        className="choose-tokens__b-m-cont__max"
                      >
                        Max
                      </div>
                    </div>
                  )}
                  {maxFrom && +maxFrom < +tokenFromQuantity ? (
                    <div className="choose-tokens__err text-red text-right">{`Maximum value is ${maxFrom}`}</div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </>
          ) : (
            <Button
              className="choose-tokens__select"
              onClick={() => handleOpenSelectTokenModal('from')}
              colorScheme="gray"
              size="lmd"
            >
              <span className="text-center text-med">Select a Token</span>
            </Button>
          )}
          <div className="choose-tokens__line box-f-ai-c">
            <div
              className="box-circle box-f-c"
              onClick={handleSwapPositions}
              tabIndex={-1}
              role="button"
              onKeyDown={() => {}}
            >
              <img src={ArrowCImg} alt="" />
            </div>
          </div>
          {tokenTo ? (
            <>
              <div className="box-f box-f-jc-sb choose-tokens__box-title second">
                <div className="text-upper">{tokenTo.symbol}</div>
                <div className="text-sm text-gray-2 text-500">{textTo || 'To'}</div>
              </div>
              <div className="box-f box-f-jc-sb">
                <div
                  className="choose-tokens__currency box-f-ai-c"
                  onClick={() => handleOpenSelectTokenModal('to')}
                  onKeyDown={() => {}}
                  tabIndex={-1}
                  role="button"
                >
                  <img
                    src={tokenTo.logoURI || (tokenTo.symbol === 'BNB' ? bnbIcon : UnknownImg)}
                    alt=""
                    className="choose-tokens__currency-img"
                  />
                  <img src={ArrowImg} alt="" className="choose-tokens__currency-arrow" />
                </div>
                <div className="choose-tokens__err-wrapper">
                  <InputNumber
                    value={tokenToQuantity}
                    colorScheme="darkgray"
                    placeholder="0"
                    // onKeyDown={(e: any) => handleChangeTokensQuantity('from', +e.target.value)}
                    onChange={(value: number | string) => handleChangeTokensQuantity('to', +value)}
                    max={maxTo}
                  />
                  {balanceTo && (
                    <div className="choose-tokens__b-m-cont">
                      <div className="choose-tokens__b-m-cont__balance text-sm text-gray-2 text-address">{`Balance: ${new BigNumber(
                        balanceTo,
                      ).toFixed(5, 1)}`}</div>
                      <div
                        onClick={() => handleMaxValue('to')}
                        onKeyDown={() => {}}
                        tabIndex={-1}
                        role="button"
                        className="choose-tokens__b-m-cont__max"
                      >
                        Max
                      </div>
                    </div>
                  )}
                  {maxTo && +maxTo < +tokenToQuantity ? (
                    <div className="choose-tokens__err text-red text-right">{`Maximum value is ${new BigNumber(
                      maxTo,
                    ).toFixed(8, 1)}`}</div>
                  ) : (
                    ''
                  )}
                </div>
              </div>{' '}
            </>
          ) : (
            <Button
              className="choose-tokens__select"
              onClick={() => handleOpenSelectTokenModal('to')}
              colorScheme="gray"
              size="lmd"
            >
              <span className="text-center text-med">Select a Token</span>
            </Button>
          )}
        </div>
        <SelectTokenModal
          isVisible={isModalVisible}
          handleClose={handleCloseSelectTokenModal}
          handleOpen={() => handleOpenSelectTokenModal(tokenType)}
          handleChangeToken={handleChangeToken}
          tokenType={tokenType}
        />
      </>
    );
  },
);

export default ChooseTokens;
