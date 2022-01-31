import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button, Popover } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';
import { ILiquidityInfo } from '@/types';
import { clogData, clogError } from '@/utils/logger';

import './LiquidityInfoModal.scss';

interface ILiquidityInfoModal {
  handleCloseModal: () => void;
  info?: ILiquidityInfo;
}

const LiquidityInfoModal: React.FC<ILiquidityInfoModal> = observer(({ info, handleCloseModal }) => {
  const { metamaskService } = useWalletConnectorContext();
  const { user } = useMst();

  const [deposit0, setDeposit0] = React.useState<number | string>(0);
  const [deposit1, setDeposit1] = React.useState<number | string>(0);
  const [share, setShare] = React.useState<number | string>(0);

  const getDeposites = React.useCallback(async () => {
    try {
      if (info?.address && user.address) {
        let lpBalance = await metamaskService.callContractMethodFromNewContract(
          info?.address,
          contracts.PAIR.ABI,
          'balanceOf',
          [user.address],
        );
        clogData('lpBalance:', lpBalance);

        lpBalance = new BigNumber(lpBalance).plus(1000).toFixed(0, 1);

        const supply = await metamaskService.callContractMethodFromNewContract(
          info?.address,
          contracts.PAIR.ABI,
          'totalSupply',
        );
        clogData('totalSupply:', supply);

        const percent = new BigNumber(lpBalance).dividedBy(new BigNumber(supply));

        setShare(new BigNumber(percent).multipliedBy(100).toString(10));

        const depos0 = new BigNumber(
          MetamaskService.calcTransactionAmount(+info.token0.balance, +info?.token0.decimals),
        )
          .multipliedBy(percent)
          .toString(10);
        const depos1 = new BigNumber(
          MetamaskService.calcTransactionAmount(+info.token1.balance, +info?.token1.decimals),
        )
          .multipliedBy(percent)
          .toString(10);
        clogData('depos0:', depos0);
        clogData('depos1:', depos1);

        setDeposit0(depos0);
        setDeposit1(depos1);
      }
    } catch (err) {
      clogError('get deposites', err);
    }
  }, [
    info?.address,
    metamaskService,
    user.address,
    info?.token0.balance,
    info?.token1.balance,
    info?.token0.decimals,
    info?.token1.decimals,
  ]);

  // const handleGetShareOfPool = React.useCallback(() => {
  //   if (info && deposit0 && deposit1) {
  //     const reserve0 = MetamaskService.calcTransactionAmount(
  //       +info?.token0.balance,
  //       +info?.token0.decimals,
  //     );
  //     const reserve1 = MetamaskService.calcTransactionAmount(
  //       +info?.token1.balance,
  //       +info?.token1.decimals,
  //     );
  //
  //     const share1 = new BigNumber(deposit0)
  //       .dividedBy(new BigNumber(reserve0).plus(reserve1).plus(deposit0))
  //       .toString(10);
  //     const share2 = new BigNumber(deposit1)
  //       .dividedBy(new BigNumber(reserve0).plus(reserve1).plus(deposit1))
  //       .toString(10);
  //
  //     const min = BigNumber.min(share1, share2).toString(10);
  //
  //     setShare(min);
  //   }
  // }, [deposit0, deposit1, info]);

  React.useEffect(() => {
    getDeposites();
  }, [getDeposites]);

  // React.useEffect(() => {
  //   handleGetShareOfPool();
  // }, [handleGetShareOfPool, deposit0, deposit1, info]);

  return (
    <Modal
      isVisible={!!info}
      className="liquidity-info"
      handleCancel={handleCloseModal}
      width={390}
      destroyOnClose
      closeIcon
    >
      {info ? (
        <div className="liquidity-info__content">
          <div className="text-smd text-bold">Your Liquidity</div>
          <div className="liquidity-info__title box-f-ai-c">
            <img src={UnknownImg} alt={info.token0.symbol} />
            <img src={UnknownImg} alt={info.token1.symbol} />
            <span className="text-smd">{`${info.token0.symbol}/${info.token1.symbol}`}</span>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-smd">
            <span>{`${info.token0.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token0.symbol} />
              <Popover
                content={(+MetamaskService.amountFromGwei(
                  deposit0,
                  +info.token0.decimals,
                )).toString(10)}
              >
                <span>
                  {(+MetamaskService.amountFromGwei(deposit0, +info.token0.decimals)).toFixed(5)}
                </span>
              </Popover>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-smd">
            <span>{`${info.token1.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token1.symbol} />
              <Popover
                content={(+MetamaskService.amountFromGwei(
                  deposit1,
                  +info.token1.decimals,
                )).toString(10)}
              >
                <span>
                  {(+MetamaskService.amountFromGwei(deposit1, +info.token1.decimals)).toFixed(5)}
                </span>
              </Popover>
            </div>
          </div>
          <div className="liquidity-info__row box-f box-f-jc-sb text-smd">
            <span>Rates</span>
            <div className="text-right">
              <Popover content={new BigNumber(info.token1.rate).toString(10)}>
                <div>{`1 ${info.token0.symbol} = ${new BigNumber(info.token1.rate).toFixed(5)} ${
                  info.token1.symbol
                }`}</div>
              </Popover>
              <br />
              <Popover content={new BigNumber(info.token0.rate).toString(10)}>
                <div>{`1 ${info.token1.symbol} = ${new BigNumber(info.token0.rate).toFixed(5)} ${
                  info.token0.symbol
                }`}</div>
              </Popover>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-smd">
            <span>Share of Pool</span>
            <Popover content={(+share).toString(10)}>
              <span>{(+share).toFixed(2)}%</span>
            </Popover>
          </div>
          <Button
            size="smd"
            className="liquidity-info__btn"
            link={{
              pathname: '/trade/liquidity/remove',
              state: {
                address: info.address,
                token0: {
                  ...info.token0,
                  deposited: deposit0,
                },
                token1: {
                  ...info.token1,
                  deposited: deposit1,
                },
              },
            }}
          >
            <span className="text-bold">Remove</span>
          </Button>
        </div>
      ) : (
        ''
      )}
    </Modal>
  );
});

export default LiquidityInfoModal;
