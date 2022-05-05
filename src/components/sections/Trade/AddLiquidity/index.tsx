import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { contracts, tokens } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ISettings, ITokens } from '@/types';
import { clogData, clogError } from '@/utils/logger';

import MetamaskService from '../../../../services/web3';
import { Button, Popover } from '../../../atoms';
import { ChooseTokens, TradeBox } from '..';

import './AddLiquidity.scss';

interface IAddLiquidity {
  tokensData: ITokens;
  type: 'to' | 'from';
  setTokensData: (value: ITokens) => void;
  isLoadingExchange: boolean;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  settings: ISettings;
  tokensReserves: any;
  pairAddress: string;
  isApproving: boolean;
  maxFrom: number;
  maxTo: number;
}

interface IPrices {
  first?: number | string;
  second?: number | string;
  share?: number | string;
}

const AddLiquidity: React.FC<IAddLiquidity> = observer(
  ({
    tokensData,
    setTokensData,
    setAllowanceFrom,
    setAllowanceTo,
    isAllowanceFrom,
    handleApproveTokens,
    isAllowanceTo,
    settings,
    tokensReserves,
    pairAddress,
    isLoadingExchange,
    isApproving,
    maxFrom,
    maxTo,
  }) => {
    const { metamaskService, connect } = useWalletConnectorContext();
    const { user } = useMst();

    const [exchange, setExchange] = React.useState<IPrices | undefined | null>(undefined);
    const [isLoading, setLoading] = React.useState<boolean>(false);

    const handleCreatePair = async () => {
      try {
        if (tokensData.from.token && tokensData.to.token) {
          setLoading(true);
          let data: any[] = [
            tokensData.from.token?.address,
            tokensData.to.token?.address,
            MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token.decimals,
            ),
            MetamaskService.calcTransactionAmount(
              tokensData.to.amount,
              +tokensData.to.token.decimals,
            ),
            (+MetamaskService.calcTransactionAmount(
              new BigNumber(tokensData.from.amount)
                .minus(new BigNumber(tokensData.from.amount).times(settings.slippage.value / 100))
                .toString(10),
              +tokensData.from.token.decimals,
            )).toFixed(0),
            (+MetamaskService.calcTransactionAmount(
              new BigNumber(tokensData.to.amount)
                .minus(new BigNumber(tokensData.to.amount).times(settings.slippage.value / 100))
                .toString(10),
              +tokensData.to.token.decimals,
            )).toFixed(0),
            user.address,
            settings.txDeadlineUtc,
          ];
          let method = 'addLiquidity';
          let value = '';

          const isFromBnb = tokensData.from.token.symbol.toLowerCase() === 'bnb';
          const isToBnb = tokensData.to.token.symbol.toLowerCase() === 'bnb';

          if (isFromBnb || isToBnb) {
            const bnbToken = isFromBnb ? tokensData.from : tokensData.to;
            const bepToken = !isFromBnb ? tokensData.from : tokensData.to;
            method = 'addLiquidityETH';

            if (bepToken.token && bnbToken.token) {
              data = [
                bepToken.token?.address,
                MetamaskService.calcTransactionAmount(bepToken.amount, +bepToken.token.decimals),
                (+MetamaskService.calcTransactionAmount(
                  new BigNumber(bepToken.amount)
                    .minus(new BigNumber(bepToken.amount).times(settings.slippage.value / 100))
                    .toString(10),
                  +bepToken.token.decimals,
                )).toFixed(0),
                (+MetamaskService.calcTransactionAmount(
                  new BigNumber(bnbToken.amount)
                    .minus(new BigNumber(bnbToken.amount).times(settings.slippage.value / 100))
                    .toString(10),
                  +bnbToken.token.decimals,
                )).toFixed(0),
                user.address,
                settings.txDeadlineUtc,
              ];
              value = MetamaskService.calcTransactionAmount(
                bnbToken.amount,
                +bnbToken.token.decimals,
              );
            }
          }

          await metamaskService.createTransaction({
            contractName: 'ROUTER',
            method,
            data,
            value,
          });
          toast.success('Successfully added liquidity!');
          setLoading(false);
          delete localStorage['refinery-finance-quote'];
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
        }
      } catch (err) {
        toast.error('Something went wrong');
        setLoading(false);
        clogError(err);
      }
    };

    const getAmounts = useCallback(async () => {
      if (
        tokensData.from.amount &&
        tokensData.to.amount &&
        tokensReserves &&
        tokensData.from.token &&
        tokensData.to.token
      ) {
        try {
          let reserve1;
          let reserve2;
          const token0 = await metamaskService.callContractMethodFromNewContract(
            pairAddress,
            contracts.PAIR.ABI,
            'token0',
          );
          if (token0 === (tokensData.from.token.address || tokens.wbnb.address['97'])) {
            reserve1 = tokensReserves['0'];
            reserve2 = tokensReserves['1'];
          } else {
            reserve1 = tokensReserves['1'];
            reserve2 = tokensReserves['0'];
          }
          const totalSupply = await metamaskService.callContractMethodFromNewContract(
            pairAddress,
            contracts.PAIR.ABI,
            'totalSupply',
          );
          clogData('totalSupply:', totalSupply);
          const balanceOf = await metamaskService.callContractMethodFromNewContract(
            pairAddress,
            contracts.PAIR.ABI,
            'balanceOf',
            [user.address],
          );
          const yourBalance = new BigNumber(balanceOf).plus(1000).toFixed(0, 1);
          clogData('balanceOf:', balanceOf);
          const share = +new BigNumber(yourBalance)
            .dividedBy(new BigNumber(totalSupply))
            .times(100)
            .toString(10);
          const firstPrice = new BigNumber(reserve2).dividedBy(reserve1).toString(10);
          const secondPrice = new BigNumber(reserve1).dividedBy(reserve2).toString(10);

          setExchange({
            first: firstPrice,
            second: secondPrice,
            share,
          });
        } catch (err) {
          clogError(err);
        }
      } else {
        setExchange(undefined);
      }
    }, [
      tokensData.from.amount,
      tokensData.from.token,
      tokensData.to.amount,
      tokensData.to.token,
      tokensReserves,
      metamaskService,
      pairAddress,
      user.address,
    ]);

    useEffect(() => {
      if (user.address) {
        getAmounts();
      }
    }, [getAmounts, user.address]);

    return (
      <TradeBox
        className="add-liquidity"
        title="Add Liquidity"
        subtitle="Add liquidity to receive LP tokens"
        settingsLink="/trade/liquidity/settings"
        recentTxLink="/trade/liquidity/history"
        info="Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool."
        titleBackLink
      >
        {exchange === null || tokensReserves === null ? (
          <div className="add-liquidity__first text-smd">
            <p>You are the first liquidity provider.</p>
            <p>The ratio of tokens you add will set the price of this pool.</p>
          </div>
        ) : (
          ''
        )}
        <ChooseTokens
          handleChangeTokens={setTokensData}
          initialTokenData={tokensData}
          textFrom="Input"
          textTo="Input"
          changeTokenFromAllowance={(value: boolean) => setAllowanceFrom(value)}
          changeTokenToAllowance={(value: boolean) => setAllowanceTo(value)}
        />
        {tokensData.from.token &&
          tokensData.to.token &&
          exchange &&
          (exchange.first || exchange.first === 0) &&
          (exchange.second || exchange.second === 0) &&
          (exchange.share || exchange.share === 0) ? (
          <div className="add-liquidity__info">
            <div className="add-liquidity__info-title text-smd text-yellow">
              Prices and pool share
            </div>
            <div className="add-liquidity__info-content text-med">
              <div className="add-liquidity__info-item">
                <Popover content={<span>{new BigNumber(exchange.second).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {new BigNumber(exchange.second).toFixed(5, 1)}
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray-2 text-center text-yellow">
                  {tokensData.from.token.symbol}
                  <br /> per {tokensData.to.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <Popover content={<span>{new BigNumber(exchange.first).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {new BigNumber(exchange.first).toFixed(5, 1)}
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray-2 text-center text-yellow">
                  {tokensData.to.token.symbol}
                  <br /> per {tokensData.from.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <Popover content={<span>{new BigNumber(exchange.share).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {exchange.share < 0.01 ? '<0.01' : new BigNumber(exchange.share).toFixed(2, 1)}%
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray-2 text-center text-yellow">
                  Share
                  <br /> of Pool
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {!user.address ? (
          <Button className="exchange__btn btn-hover-down" colorScheme="pink" onClick={connect}>
            <span className="text-bold text-md text-white">Connect</span>
          </Button>
        ) : (
          ''
        )}
        {user.address &&
          isAllowanceFrom &&
          isAllowanceTo &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount ? (
          <Button
            colorScheme="pink"
            className="add-liquidity__btn"
            disabled={
              !tokensData.from.amount ||
              !tokensData.to.amount ||
              +tokensData.from.amount > maxFrom ||
              +tokensData.to.amount > maxTo
            }
            onClick={handleCreatePair}
            loading={isLoading || isLoadingExchange}
            loadingText={isLoadingExchange ? 'Getting exchange' : ''}
          >
            <span className="text-white text-bold text-smd">Add</span>
          </Button>
        ) : (
          ''
        )}
        {user.address &&
          tokensData.from.token &&
          tokensData.to.token &&
          (!tokensData.to.amount || !tokensData.from.amount) ? (
          <Button
            className="add-liquidity__btn"
            disabled={!tokensData.from.amount || !tokensData.to.amount}
            loading={isLoadingExchange}
            loadingText="Geting exchange"
          >
            <span className="text-white text-bold text-smd">Enter an amount</span>
          </Button>
        ) : (
          ''
        )}
        {user.address &&
          (!isAllowanceFrom || !isAllowanceTo) &&
          tokensData.from.token &&
          tokensData.to.token &&
          tokensData.to.amount &&
          tokensData.from.amount ? (
          <Button
            colorScheme="pink"
            className="add-liquidity__btn btn-hover-down"
            onClick={handleApproveTokens}
            loading={isApproving}
            loadingText="Waiting for approve..."
          >
            <span className="text-white text-bold text-smd">
              Approve {tokensData[!isAllowanceFrom ? 'from' : 'to'].token?.symbol}
            </span>
          </Button>
        ) : (
          ''
        )}
        {user.address && (!tokensData.from.token || !tokensData.to.token) ? (
          <Button disabled className="add-liquidity__btn">
            <span className="text-white text-bold text-smd">Select a Tokens</span>
          </Button>
        ) : (
          ''
        )}
      </TradeBox>
    );
  },
);

export default AddLiquidity;
