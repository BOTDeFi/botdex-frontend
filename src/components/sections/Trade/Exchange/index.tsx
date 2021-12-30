import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { tokens } from '@/config';
import { useGetHoursPairs, useGetPair } from '@/services/api/refinery-finance-pairs';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ISettings, ITokens } from '@/types';
import { clogData, clogError } from '@/utils/logger';

import MetamaskService from '../../../../services/web3';
import { Button } from '../../../atoms';
import { ChooseTokens, TradeBox } from '..';

import './Exchange.scss';

interface IExchange {
  tokensData: ITokens;
  setTokensData: (value: ITokens) => void;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  settings: ISettings;
  tokensReserves: any;
  maxFrom: '';
  maxTo: '';
  isLoadingExchange: boolean;
  isApproving: boolean;
  pairAddress?: any;
}

const Exchange: React.FC<IExchange> = observer(
  ({
    tokensData,
    setTokensData,
    setAllowanceFrom,
    setAllowanceTo,
    isAllowanceFrom,
    handleApproveTokens,
    isAllowanceTo,
    maxFrom,
    maxTo,
    settings,
    tokensReserves,
    isLoadingExchange,
    isApproving,
    pairAddress,
  }) => {
    const { connect, metamaskService } = useWalletConnectorContext();
    const { user, pairs } = useMst();
    const [isLoading, setIsLoading] = useState(false);

    const getPair = useGetPair();
    const getPairData = useGetHoursPairs();

    clogData('maxFrom:', maxFrom);
    clogData('maxTo:', maxTo);

    const fetchPair = useCallback(async () => {
      const normalizedAddress = pairAddress.toLowerCase();
      const [pair] = (await getPair(normalizedAddress)).pairs;
      if (pair?.id) {
        pairs.setPair(pair);
        const pairData = (await getPairData(24, normalizedAddress)).pairHourDatas;
        pairs.setCurrentPairData(normalizedAddress, pairData);
      }
    }, [pairAddress, getPair, getPairData, pairs]);

    useEffect(() => {
      if (pairs.pair.id !== pairAddress) {
        fetchPair();
      }
    }, [fetchPair, pairAddress, pairs]);

    const handleSwap = async () => {
      if (tokensData.to.token && tokensData.from.token) {
        setIsLoading(true);
        let method;
        if (tokensData.to.token.address && tokensData.from.token.address) {
          method = user.type === 'from' ? 'swapExactTokensForTokens' : 'swapTokensForExactTokens';
        } else if (tokensData.to.token.address) {
          method = user.type === 'from' ? 'swapExactETHForTokens' : 'swapETHForExactTokens';
        } else {
          method = user.type === 'from' ? 'swapExactTokensForETH' : 'swapTokensForExactETH';
        }
        try {
          let data: any[];
          let value;
          if (method === 'swapETHForExactTokens') {
            data = [
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token?.decimals,
              ),
              [
                tokensData.from.token.address || tokens.wbnb.address['97'],
                tokensData.to.token.address || tokens.wbnb.address['97'],
              ],
              user.address,
              settings.txDeadlineUtc,
            ];
            value = MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token?.decimals,
            );
          } else if (method === 'swapExactETHForTokens') {
            data = [
              (+MetamaskService.calcTransactionAmount(
                new BigNumber(tokensData.to.amount)
                  .minus(new BigNumber(tokensData.to.amount).times(settings.slippage.value / 100))
                  .toString(10),
                +tokensData.to.token?.decimals,
              )).toFixed(0),
              [
                tokensData.from.token.address || tokens.wbnb.address['97'],
                tokensData.to.token.address || tokens.wbnb.address['97'],
              ],
              user.address,
              settings.txDeadlineUtc,
            ];
            value = MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token?.decimals,
            );
          } else if (method === 'swapExactTokensForETH' || method === 'swapExactTokensForTokens') {
            data = [
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token?.decimals,
              ),
              (+MetamaskService.calcTransactionAmount(
                new BigNumber(tokensData.to.amount)
                  .minus(new BigNumber(tokensData.to.amount).times(settings.slippage.value / 100))
                  .toString(10),
                +tokensData.to.token?.decimals,
              )).toFixed(0),
              [
                tokensData.from.token.address || tokens.wbnb.address['97'],
                tokensData.to.token.address || tokens.wbnb.address['97'],
              ],
              user.address,
              settings.txDeadlineUtc,
            ];
          } else {
            data = [
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token?.decimals,
              ),
              (+MetamaskService.calcTransactionAmount(
                new BigNumber(tokensData.from.amount)
                  .plus(new BigNumber(tokensData.from.amount).times(settings.slippage.value / 100))
                  .toString(10),
                +tokensData.from.token?.decimals,
              )).toFixed(0),
              [
                tokensData.from.token.address || tokens.wbnb.address['97'],
                tokensData.to.token.address || tokens.wbnb.address['97'],
              ],
              user.address,
              settings.txDeadlineUtc,
            ];
          }
          clogData('data:', data);
          clogData('value:', value);
          await metamaskService.createTransaction({
            method,
            contractName: 'ROUTER',
            data,
            value: value ?? '0',
          });
          delete localStorage['refinery-finance-getAmountOut'];
          setTokensData({
            from: {
              token: undefined,
              amount: NaN,
            },
            to: {
              token: undefined,
              amount: NaN,
            },
          });
          toast.success('Successfully swapped tokens!');
          setIsLoading(false);
        } catch (err) {
          clogError('swap err', err);
          toast.error('Something went wrong');
          setIsLoading(false);
        }
      }
    };

    return (
      <>
        <TradeBox
          title="Exchange"
          subtitle="Trade tokens in an instant"
          settingsLink="/trade/swap/settings"
          recentTxLink="/trade/swap/history"
        >
          <ChooseTokens
            handleChangeTokens={setTokensData}
            initialTokenData={tokensData}
            textFrom="From"
            textTo="To"
            changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
            changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
            maxFrom={maxFrom}
            maxTo={maxTo}
          />
          {isAllowanceFrom &&
          isAllowanceTo &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount &&
          user.address &&
          tokensReserves !== null ? (
            <Button
              className="exchange__btn"
              onClick={handleSwap}
              disabled={
                !tokensData.from.amount ||
                !tokensData.to.amount ||
                +tokensData.from.amount > +maxFrom ||
                +tokensData.to.amount > +maxTo
              }
              loading={isLoadingExchange || isLoading}
              loadingText={
                // eslint-disable-next-line no-nested-ternary
                isLoadingExchange ? 'Getting exchange' : isLoading ? 'In progress...' : ''
              }
            >
              <span className="text-white text-bold text-smd">Swap</span>
            </Button>
          ) : (
            ''
          )}
          {!user.address ? (
            <Button className="exchange__btn" onClick={connect}>
              <span className="text-bold text-md text-white">Connect</span>
            </Button>
          ) : (
            ''
          )}
          {tokensData.from.token &&
          tokensData.to.token &&
          (!tokensData.to.amount || !tokensData.from.amount) &&
          tokensReserves !== null &&
          user.address ? (
            <Button
              className="exchange__btn"
              disabled={!tokensData.from.amount || !tokensData.to.amount}
              loading={isLoadingExchange}
            >
              <span className="text-white text-bold text-smd">Enter an amount</span>
            </Button>
          ) : (
            ''
          )}
          {(!isAllowanceFrom || !isAllowanceTo) &&
          tokensData.to.amount &&
          tokensData.from.amount &&
          tokensReserves !== null &&
          user.address ? (
            <Button className="exchange__btn" onClick={handleApproveTokens} loading={isApproving}>
              <span className="text-white text-bold text-smd">
                Approve{' '}
                {!isAllowanceFrom ? tokensData.from.token?.symbol : tokensData.to.token?.symbol}
              </span>
            </Button>
          ) : (
            ''
          )}
          {(!tokensData.from.token || !tokensData.to.token) &&
          tokensReserves !== null &&
          user.address ? (
            <Button disabled className="exchange__btn">
              <span className="text-white text-bold text-smd">Select a Tokens</span>
            </Button>
          ) : (
            ''
          )}
          {tokensData.from.token &&
          tokensData.to.token &&
          tokensReserves === null &&
          user.address ? (
            <Button disabled className="exchange__btn">
              <span className="text-white text-bold text-smd">
                This pair haven&lsquo;t been created
              </span>
            </Button>
          ) : (
            ''
          )}
        </TradeBox>
      </>
    );
  },
);

export default Exchange;
