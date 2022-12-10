import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import BnbImg from '@/assets/img/currency/unknown.svg';
import { tokens } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ILiquidityInfo } from '@/types';
import { clogError } from '@/utils/logger';

import MetamaskService from '../../../../services/web3';
import { Button, Popover } from '../../../atoms';
import { TradeBox } from '..';

import './Receive.scss';

interface IReceiveState extends ILiquidityInfo {
  lpTokens: string;
}

const Receive: React.FC = observer(() => {
  const { metamaskService } = useWalletConnectorContext();
  const location = useLocation<IReceiveState>();
  const history = useHistory();
  const { user } = useMst();

  const [liquidityInfo, setLiquidityInfo] = React.useState<IReceiveState>();
  const [isActiveTx, setIsActiveTx] = React.useState<boolean>(false);

  const handleRemoveLiquidity = async () => {
    try {
      if (liquidityInfo && liquidityInfo?.token0.receive && liquidityInfo?.token1.receive) {
        setIsActiveTx(true);
        const chainId = metamaskService.networkToUseNow.toString();
        const wbnb = tokens.wbnb.address[chainId].toLowerCase();
        let method: string;
        if (
          liquidityInfo.token0.address.toLowerCase() === wbnb ||
          liquidityInfo.token1.address.toLowerCase() === wbnb
        ) {
          method = 'removeLiquidityETH';
        } else method = 'removeLiquidity';
        await metamaskService.createTransaction({
          method,
          contractName: 'ROUTER',
          data:
            method === 'removeLiquidity'
              ? [
                  liquidityInfo?.token0.address,
                  liquidityInfo?.token1.address,
                  new BigNumber(liquidityInfo.lpTokens).toFixed(0).toString(),
                  new BigNumber(liquidityInfo?.token0.receive)
                    .minus(
                      new BigNumber(liquidityInfo?.token0.receive).times(
                        liquidityInfo.settings.slippage.value,
                      ),
                    )
                    .toFixed(0, 1),
                  new BigNumber(liquidityInfo?.token1.receive)
                    .minus(
                      new BigNumber(liquidityInfo?.token1.receive).times(
                        liquidityInfo.settings.slippage.value,
                      ),
                    )
                    .toFixed(0, 1),
                  user.address,
                  moment.utc().add(20, 'm').valueOf(),
                ]
              : [
                  liquidityInfo.token0.address.toLowerCase() === wbnb
                    ? liquidityInfo.token1.address
                    : liquidityInfo.token0.address,
                  new BigNumber(liquidityInfo.lpTokens).toFixed(0).toString(),
                  liquidityInfo.token0.address.toLowerCase() === wbnb
                    ? new BigNumber(liquidityInfo.token1.receive)
                        .minus(
                          new BigNumber(liquidityInfo?.token1.receive).times(
                            liquidityInfo.settings.slippage.value,
                          ),
                        )
                        .toFixed(0, 1)
                    : new BigNumber(liquidityInfo.token0.receive)
                        .minus(
                          new BigNumber(liquidityInfo?.token0.receive).times(
                            liquidityInfo.settings.slippage.value,
                          ),
                        )
                        .toFixed(0, 1),
                  liquidityInfo.token0.address.toLowerCase() === wbnb
                    ? new BigNumber(liquidityInfo.token0.receive)
                        .minus(
                          new BigNumber(liquidityInfo?.token0.receive).times(
                            liquidityInfo.settings.slippage.value,
                          ),
                        )
                        .toFixed(0, 1)
                    : new BigNumber(liquidityInfo.token1.receive)
                        .minus(
                          new BigNumber(liquidityInfo?.token1.receive).times(
                            liquidityInfo.settings.slippage.value,
                          ),
                        )
                        .toFixed(0, 1),
                  user.address,
                  moment.utc().add(20, 'm').valueOf(),
                ],
        });
        history.push('/trade/liquidity');
        toast.success('Successfully removed liquidity!');
      }
    } catch (err) {
      toast.error('Something went wrong');
      setIsActiveTx(false);
      clogError('remove liquidity', err);
    }
  };

  React.useEffect(() => {
    if (location.state) {
      setLiquidityInfo(location.state);
    } else {
      history.push('/trade/liquidity');
    }
  }, [location, history]);

  return (
    <TradeBox className="receive" title="You will receive" titleBackLink>
      {liquidityInfo && liquidityInfo.token0.receive && liquidityInfo.token1.receive ? (
        <div className="receive__box">
          <div className="receive__item box-f-ai-c box-f-jc-sb">
            <Popover
              content={MetamaskService.amountFromGwei(
                liquidityInfo.token0.receive,
                +liquidityInfo.token0.decimals,
              )}
            >
              <div className="text-lmd text-address">
                {MetamaskService.amountFromGwei(
                  liquidityInfo.token0.receive,
                  +liquidityInfo.token0.decimals,
                )}
              </div>
            </Popover>
            <div className="receive__item-currency box-f-ai-c">
              <div className="text-upper text-smd">{liquidityInfo?.token0.symbol}</div>
              <img src={BnbImg} alt="" />
            </div>
          </div>
          <div className="text-yellow text-lmd text-med receive__plus">+</div>
          <div className="receive__item box-f-ai-c box-f-jc-sb">
            <Popover
              content={MetamaskService.amountFromGwei(
                liquidityInfo.token1.receive,
                +liquidityInfo.token1.decimals,
              )}
            >
              <div className="text-lmd text-address">
                {MetamaskService.amountFromGwei(
                  liquidityInfo.token1.receive,
                  +liquidityInfo.token1.decimals,
                )}
              </div>
            </Popover>
            <div className="receive__item-currency box-f-ai-c">
              <div className="text-upper text-smd">{liquidityInfo?.token1.symbol}</div>
              <img src={BnbImg} alt="" />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="text">
        Output is stimulated. If the price changes by more than 0.8% your transaction will revert.
      </div>
      {liquidityInfo?.lpTokens ? (
        <div className="receive__burned text-smd text-yellow">
          <span>
            LP {liquidityInfo?.token0.symbol}/{liquidityInfo?.token1.symbol} Burned
          </span>
          <div className="box-f-ai-c">
            <img src={BnbImg} alt="" />
            <img src={BnbImg} alt="" />
            <Popover
              content={new BigNumber(
                MetamaskService.amountFromGwei(liquidityInfo?.lpTokens, 18),
              ).toString(10)}
            >
              <span className="receive__burned__amount text-address">
                {' '}
                {new BigNumber(MetamaskService.amountFromGwei(liquidityInfo?.lpTokens, 18)).toFixed(
                  5,
                  1,
                )}
              </span>
            </Popover>
          </div>
        </div>
      ) : (
        ''
      )}
      {liquidityInfo?.token1.rate && liquidityInfo?.token0.rate ? (
        <div className="receive__price box-f box-f-jc-sb text-smd text-yellow">
          <span>Price</span>
          <div>
            <Popover content={new BigNumber(liquidityInfo?.token1.rate).toString(10)}>
              <div className="peceive__price-item">
                1 {liquidityInfo?.token0.symbol} ={' '}
                {new BigNumber(+liquidityInfo.token1.reserve)
                  .dividedBy(+liquidityInfo.token0.reserve)
                  .toFixed(5)}{' '}
                {liquidityInfo?.token1.symbol}
              </div>
            </Popover>
            <Popover content={new BigNumber(liquidityInfo?.token0.rate).toString(10)}>
              <div className="peceive__price-item">
                1 {liquidityInfo?.token1.symbol} ={' '}
                {new BigNumber(+liquidityInfo.token0.reserve)
                  .dividedBy(+liquidityInfo.token1.reserve)
                  .toFixed(5)}{' '}
                {liquidityInfo?.token0.symbol}
              </div>
            </Popover>
          </div>
        </div>
      ) : (
        ''
      )}
      <Button
        className="receive__btn"
        colorScheme="pink"
        onClick={handleRemoveLiquidity}
        loading={isActiveTx}
      >
        <span className="text-white text-bold text-md">Confirm</span>
      </Button>
    </TradeBox>
  );
});

export default Receive;
