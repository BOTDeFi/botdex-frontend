import React from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { tokens } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ISettings, ITokens } from '@/types';
import { clog, clogError } from '@/utils/logger';

import MetamaskService from '../../../../services/web3';
import { Button, Popover } from '../../../atoms';
import { ChooseTokens, TradeBox } from '..';

import './AddLiquidity.scss';

interface IAddLiquidity {
  tokensData: ITokens;
  setTokensData: (value: ITokens) => void;
  isLoadingExchange: boolean;
  setAllowanceFrom: (value: boolean) => void;
  setAllowanceTo: (value: boolean) => void;
  isAllowanceFrom: boolean;
  isAllowanceTo: boolean;
  handleApproveTokens: () => void;
  settings: ISettings;
  tokensResurves: any;
  isApproving: boolean;
}

interface IPrices {
  first?: number;
  second?: number;
  share?: number;
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
    tokensResurves,
    isLoadingExchange,
    isApproving,
  }) => {
    const { metamaskService, connect } = useWalletConnectorContext();
    const { user } = useMst();

    const [exchange, setExchange] = React.useState<IPrices | undefined | null>(undefined);
    const [isLoading, setLoading] = React.useState<boolean>(false);

    const handleCreatePair = async () => {
      clog(settings, 'txDeadlineUtc');
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
            MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token.decimals,
            ),
            MetamaskService.calcTransactionAmount(
              tokensData.to.amount,
              +tokensData.to.token.decimals,
            ),
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
                MetamaskService.calcTransactionAmount(bepToken.amount, +bepToken.token.decimals),
                MetamaskService.calcTransactionAmount(bnbToken.amount, +bnbToken.token.decimals),
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
        setLoading(false);
        clogError(err);
      }
    };

    React.useEffect(() => {
      if (
        tokensData.from.amount &&
        tokensData.to.amount &&
        tokensResurves &&
        tokensData.from.token &&
        tokensData.to.token
      ) {
        try {
          const token1 = new BigNumber(
            MetamaskService.calcTransactionAmount(
              tokensData.from.amount,
              +tokensData.from.token.decimals,
            ),
          ).toString(10);
          const token2 = new BigNumber(
            MetamaskService.calcTransactionAmount(
              tokensData.to.amount,
              +tokensData.to.token.decimals,
            ),
          ).toString(10);
          const share1 = new BigNumber(token1)
            .dividedBy(new BigNumber(tokensResurves['0']).plus(tokensResurves['1']).plus(token1))
            .toString(10);
          const share2 = new BigNumber(token2)
            .dividedBy(new BigNumber(tokensResurves['0']).plus(tokensResurves['1']).plus(token2))
            .toString(10);
          const min = BigNumber.min(share1, share2).toString(10);

          setExchange((ex) => ({
            ...ex,
            share: +min,
          }));
          const isFromBnb = tokensData.from.token.symbol.toLowerCase() === 'bnb';
          const isToBnb = tokensData.to.token.symbol.toLowerCase() === 'bnb';

          metamaskService
            .callContractMethod('ROUTER', 'getAmountsOut', [
              MetamaskService.calcTransactionAmount(
                tokensData.from.amount,
                +tokensData.from.token.decimals,
              ),
              [
                isToBnb ? tokens.wbnb.address[97] : tokensData.to.token.address,
                isFromBnb ? tokens.wbnb.address[97] : tokensData.from.token.address,
              ],
            ])
            .then((res) => {
              if (tokensData.from.token) {
                const amount = +MetamaskService.amountFromGwei(
                  res[1],
                  +tokensData.from.token?.decimals,
                );
                setExchange((data) => ({
                  ...data,
                  first: amount,
                }));
              }
            });
          metamaskService
            .callContractMethod('ROUTER', 'getAmountsOut', [
              MetamaskService.calcTransactionAmount(
                tokensData.to.amount,
                +tokensData.to.token.decimals,
              ),
              [
                isFromBnb ? tokens.wbnb.address[97] : tokensData.from.token.address,
                isToBnb ? tokens.wbnb.address[97] : tokensData.to.token.address,
              ],
            ])
            .then((res) => {
              if (tokensData.to.token) {
                const amount = +MetamaskService.amountFromGwei(
                  res[1],
                  +tokensData.to.token?.decimals,
                );
                setExchange((data) => ({
                  ...data,
                  second: amount,
                }));
              }
            });
        } catch (err) {
          clogError(err);
        }
      } else {
        setExchange(undefined);
      }
    }, [
      tokensData.from.token,
      tokensData.to.token,
      tokensData.from.amount,
      tokensData.to.amount,
      tokensResurves,
      metamaskService,
    ]);

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
        {exchange === null || tokensResurves === null ? (
          <div className="add-liquidity__first text-smd">
            <p className="text-bold">You are the first liquidity provider.</p>
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
                <Popover content={<span>{new BigNumber(exchange.first).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {new BigNumber(exchange.first).toFixed(4).toString()}
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray text-center text-yellow">
                  {tokensData.from.token.symbol}
                  <br /> per {tokensData.to.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <Popover content={<span>{new BigNumber(exchange.second).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {new BigNumber(exchange.second).toFixed(4).toString()}
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray text-center text-yellow">
                  {tokensData.to.token.symbol}
                  <br /> per {tokensData.from.token.symbol}
                </div>
              </div>
              <div className="add-liquidity__info-item">
                <Popover content={<span>{new BigNumber(exchange.share).toString(10)}</span>}>
                  <div className="text text-center text-yellow add-liquidity__info-item-title">
                    {exchange.share < 0.01
                      ? '<0.01'
                      : new BigNumber(exchange.share).toFixed(4).toString()}
                    %
                  </div>
                </Popover>
                <div className="text-sm text-center text-gray text-center text-yellow">
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
          <Button className="exchange__btn" onClick={connect}>
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
            className="add-liquidity__btn"
            disabled={!tokensData.from.amount || !tokensData.to.amount}
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
            className="add-liquidity__btn"
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
