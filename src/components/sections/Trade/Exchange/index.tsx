import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { Button } from '@/components/atoms';
import { ChooseTokens, TradeBox } from '@/components/sections/Trade';
import { contracts, tokens } from '@/config';
import {
  useGetAllPairs,
  useGetHoursPairs,
  useGetPair,
} from '@/services/api/refinery-finance-pairs';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';
import { ISettings, ITokens } from '@/types';
import { findPath } from '@/utils/findPath';
import { clogError } from '@/utils/logger';

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
    // isAllowanceTo,
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
    const [allPairs] = useState<string[][]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPair = useGetPair();
    const getPairData = useGetHoursPairs();
    const getAllPairs = useGetAllPairs();

    const fetchPair = useCallback(async () => {
      const normalizedAddress = pairAddress.toLowerCase();
      const [pair] = (await getPair(normalizedAddress)).pairs;
      if (pair?.id) {
        pairs.setPair(pair);
        const pairData = (await getPairData(24, normalizedAddress)).pairHourDatas;
        pairs.setCurrentPairData(normalizedAddress, pairData);
      }
    }, [pairAddress, getPair, getPairData, pairs]);

    const fetchAllPairs = React.useCallback(async () => {
      const result = await getAllPairs();
      result.pairs.forEach((pair: any) => {
        allPairs.push([pair.token0.id, pair.token1.id]);
      });
    }, [getAllPairs, allPairs]);

    useEffect(() => {
      if (allPairs.length === 0) {
        fetchAllPairs().catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
      }

      // findPath(tokensData, allPairs);
    }, [allPairs, fetchAllPairs]);

    useEffect(() => {
      if (pairs.pair.id !== pairAddress) {
        fetchPair();
      }
    }, [fetchPair, metamaskService, pairAddress, pairs]);

    const handleSwap = React.useCallback(async () => {
      if (tokensData.to.token && tokensData.from.token) {
        setIsLoading(true);
        let path;
        if (!settings.isAudio) {
          path = [
            tokensData.from.token.address || tokens.wbnb.address['97'],
            tokensData.to.token.address || tokens.wbnb.address['97'],
          ];
        } else {
          path = findPath(tokensData, allPairs);
        }
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
              path,
              // [
              //   tokensData.from.token.address || tokens.wbnb.address['97'],
              //   tokensData.to.token.address || tokens.wbnb.address['97'],
              // ],
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
              path,
              // [
              //   tokensData.from.token.address || tokens.wbnb.address['97'],
              //   tokensData.to.token.address || tokens.wbnb.address['97'],
              // ],
              user.address,
              settings.txDeadlineUtc,
            ];
            value = MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token?.decimals,
            );
          } else if (method === 'swapExactTokensForETH' || method === 'swapExactTokensForTokens') {
            // MAIN SWAP
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
              path,
              // [
              //   tokensData.from.token.address || tokens.wbnb.address['97'],
              //   tokensData.to.token.address || tokens.wbnb.address['97'],
              // ],
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
              path,
              // [
              //   tokensData.from.token.address || tokens.wbnb.address['97'],
              //   tokensData.to.token.address || tokens.wbnb.address['97'],
              // ],
              user.address,
              settings.txDeadlineUtc,
            ];
          }

          try {
            const contract = contracts.ROUTER;
            const { ABI, ADDRESS } = contract;
            const routerContract = metamaskService.getContract(ADDRESS, ABI);
            await routerContract.methods.swapExactTokensForTokens(...data).estimateGas();
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
            if (method === 'swapExactTokensForTokens') {
              method = 'swapExactTokensForTokensSupportingFeeOnTransferTokens';
            }
            if (method === 'swapExactTokensForETH') {
              method = 'swapExactTokensForETHSupportingFeeOnTransferTokens';
            }
            if (+settings.slippage.value < 10) {
              const newSlippage = +settings.slippage.value + (10 - +settings.slippage.value);
              data[1] = (+MetamaskService.calcTransactionAmount(
                new BigNumber(tokensData.to.amount)
                  .minus(new BigNumber(tokensData.to.amount).times(newSlippage / 100))
                  .toString(10),
                +tokensData.to.token?.decimals,
              )).toFixed(0);
            }
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
          }
        } catch (err) {
          clogError('swap err', err);
          toast.error('Something went wrong');
          setIsLoading(false);
        }
      }
    }, [allPairs, metamaskService, setTokensData, settings, tokensData, user.address, user.type]);

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
            tokensData.from.token &&
            tokensData.to.token &&
            tokensData.to.amount &&
            tokensData.from.amount &&
            user.address &&
            tokensReserves !== null ? (
            <Button
              className="exchange__btn"
              colorScheme="pink"
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
            <Button className="exchange__btn btn-hover-down" colorScheme="pink" onClick={connect}>
              <span className="text-bold text-md text-white">Unlock Wallet</span>
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
          {!isAllowanceFrom &&
            tokensData.to.amount &&
            tokensData.from.amount &&
            tokensReserves !== null &&
            user.address ? (
            <Button
              className="exchange__btn btn-hover-down"
              colorScheme="pink"
              onClick={handleApproveTokens}
              loading={isApproving}
            >
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
              <span className="text-white text-bold text-smd">Select Tokens</span>
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
