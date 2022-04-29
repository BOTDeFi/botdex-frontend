import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, Popover, Slider } from '@/components/atoms';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';
import { ILiquidityInfo, ISettings } from '@/types';
import { clogError } from '@/utils/logger';

import { TradeBox } from '..';

import './RemoveLiquidity.scss';

const RemoveLiquidity: React.FC<{ settings: ISettings }> = observer(({ settings }) => {
  const { user } = useMst();
  const { metamaskService } = useWalletConnectorContext();

  const location = useLocation<ILiquidityInfo>();
  const history = useHistory();
  const [percent, setPercent] = React.useState<number>(25);

  const [liquidityInfo, setLiquidityInfo] = React.useState<ILiquidityInfo>();
  const [isTokensApprove, setTokensApprove] = React.useState<boolean>(false);
  const [isTokensApproving, setTokensApproving] = React.useState<boolean>(false);
  const [lpBalance, setLpBalance] = React.useState<string>('');

  const btns = [25, 50, 75];

  const handlePercentChange = (value: number) => {
    setPercent(value);
  };

  const handleCheckApprove = React.useCallback(async () => {
    try {
      if (liquidityInfo && user.address) {
        const balance = await metamaskService.callContractMethodFromNewContract(
          liquidityInfo?.address,
          contracts.PAIR.ABI,
          'balanceOf',
          [user.address],
        );

        setLpBalance(balance);

        const result = await metamaskService.checkTokenAllowance({
          contractName: 'PAIR',
          approvedAddress: contracts.ROUTER.ADDRESS,
          tokenAddress: liquidityInfo?.address,
          approveSum: +MetamaskService.amountFromGwei(balance, 18),
        });

        setTokensApprove(result);
      }
    } catch (err) {
      clogError('check lp approve', err);
      setTokensApprove(false);
    }
  }, [liquidityInfo, metamaskService, user.address]);

  const handleApprove = async () => {
    try {
      if (liquidityInfo && user.address) {
        setTokensApproving(true);
        await metamaskService.approveToken({
          contractName: 'PAIR',
          approvedAddress: contracts.ROUTER.ADDRESS,
          tokenAddress: liquidityInfo?.address,
        });
        toast.success('Successfully approved LP token!', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTokensApproving(false);
        setTokensApprove(true);
      }
    } catch (err) {
      toast.error('Something went wrong!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      clogError('approve lp', err);
      setTokensApproving(false);
      setTokensApprove(false);
    }
  };

  React.useEffect(() => {
    if (location.state) {
      setLiquidityInfo(location.state);
    } else {
      history.push('/trade/liquidity');
    }
  }, [location, history]);

  React.useEffect(() => {
    handleCheckApprove();
  }, [handleCheckApprove]);

  return (
    <TradeBox
      className="r-liquidity"
      title="Remove Liquidity"
      settingsLink="/trade/liquidity/settings"
      titleBackLink
    >
      <div className="r-liquidity__percent">{percent}%</div>
      <Slider
        tooltipVisible={false}
        onChange={handlePercentChange}
        defaultValue={0}
        value={percent}
        min={0}
      />
      <div className="r-liquidity__percent-btns box-f-ai-c box-f-jc-sb">
        {btns.map((btn) => (
          <Button colorScheme="pink" size="sm" key={btn} onClick={() => handlePercentChange(btn)}>
            <span className="text-ssmd">{btn}%</span>
          </Button>
        ))}
        <Button colorScheme="pink" size="sm" onClick={() => handlePercentChange(100)}>
          <span className="text-ssmd">Max</span>
        </Button>
      </div>
      {liquidityInfo && liquidityInfo.token0.deposited && liquidityInfo.token1.deposited ? (
        <div className="r-liquidity__content">
          <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
            <Popover
              content={new BigNumber(
                MetamaskService.amountFromGwei(
                  liquidityInfo.token0.deposited,
                  +liquidityInfo.token0.decimals,
                ),
              )
                .multipliedBy(percent / 100)
                .toString(10)}
            >
              <div className="r-liquidity__currency-sum text-lmd">
                {
                  +new BigNumber(
                    MetamaskService.amountFromGwei(
                      liquidityInfo.token0.deposited,
                      +liquidityInfo.token0.decimals,
                    ),
                  )
                    .multipliedBy(percent / 100)
                    .toFixed(5, 1)
                }
              </div>
            </Popover>
            <div className="box-f-ai-c r-liquidity__currency-item">
              <div className="text-smd text-upper">{liquidityInfo?.token0.symbol}</div>
              <img src={UnknownImg} alt="" />
            </div>
          </div>
          <div className="r-liquidity__currency box-f-ai-c box-f-jc-sb">
            <Popover
              content={new BigNumber(
                MetamaskService.amountFromGwei(
                  liquidityInfo.token1.deposited,
                  +liquidityInfo.token1.decimals,
                ),
              )
                .multipliedBy(percent / 100)
                .toString(10)}
            >
              <div className="r-liquidity__currency-sum text-lmd">
                {
                  +new BigNumber(
                    MetamaskService.amountFromGwei(
                      liquidityInfo.token1.deposited,
                      +liquidityInfo.token1.decimals,
                    ),
                  )
                    .multipliedBy(percent / 100)
                    .toFixed(5, 1)
                }
              </div>
            </Popover>
            <div className="box-f-ai-c r-liquidity__currency-item">
              <div className="text-smd text-upper">{liquidityInfo?.token1.symbol}</div>
              <img src={UnknownImg} alt="" />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {liquidityInfo?.token1.rate && liquidityInfo?.token0.rate ? (
        <div className="r-liquidity__price box-f box-f-jc-sb text-yellow">
          <span>Price</span>
          <div>
            <Popover
              content={new BigNumber(+liquidityInfo.token1.reserve)
                .dividedBy(+liquidityInfo.token0.reserve)
                .toString(10)}
            >
              <div className="r-liquidity__price-item text-right">
                1 {liquidityInfo?.token0.symbol} ={' '}
                {new BigNumber(+liquidityInfo.token1.reserve)
                  .dividedBy(+liquidityInfo.token0.reserve)
                  .toFixed(5)}{' '}
                {liquidityInfo?.token1.symbol}
              </div>
            </Popover>
            <Popover
              content={new BigNumber(+liquidityInfo.token0.reserve)
                .dividedBy(+liquidityInfo.token1.reserve)
                .toString(10)}
            >
              <div className="r-liquidity__price-item text-right">
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
      <div className="r-liquidity__btns box-f-ai-c box-f-jc-e">
        {!isTokensApprove ? (
          <Button
            colorScheme="pink"
            className="liquidity_remove_btn"
            onClick={handleApprove}
            loading={isTokensApproving}
          >
            <span className="text-white text-bold text-md">Approve</span>
          </Button>
        ) : (
          <div />
        )}
        {isTokensApprove &&
        liquidityInfo &&
        liquidityInfo.token0.deposited &&
        liquidityInfo.token1.deposited ? (
          <Button
            colorScheme="pink"
            className="liquidity_remove_btn"
            disabled={!isTokensApprove}
            link={{
              pathname: '/trade/liquidity/receive',
              state: {
                address: liquidityInfo?.address,
                lpTokens: new BigNumber(lpBalance)
                  .multipliedBy(new BigNumber(percent).dividedBy(100))
                  .toString(10),
                token0: {
                  ...liquidityInfo?.token0,
                  receive: new BigNumber(liquidityInfo.token0.deposited)
                    .multipliedBy(new BigNumber(percent).dividedBy(100))
                    .toString(10),
                },
                token1: {
                  ...liquidityInfo?.token1,
                  receive: +new BigNumber(liquidityInfo.token1.deposited)
                    .multipliedBy(new BigNumber(percent).dividedBy(100))
                    .toString(10),
                },
                settings,
              },
            }}
          >
            <span className="text-white text-bold text-md">Remove</span>
          </Button>
        ) : (
          ''
        )}
      </div>
    </TradeBox>
  );
});

export default RemoveLiquidity;
