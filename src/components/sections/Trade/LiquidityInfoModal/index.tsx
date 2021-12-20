import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';
import { ILiquidityInfo } from '@/types';
import { clogError } from '@/utils/logger';

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

        lpBalance = +lpBalance + 1000;

        const supply = await metamaskService.callContractMethodFromNewContract(
          info?.address,
          contracts.PAIR.ABI,
          'totalSupply',
        );

        const percent = new BigNumber(lpBalance).dividedBy(new BigNumber(supply));

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

  const handleGetShareOfPool = React.useCallback(() => {
    if (info && deposit0 && deposit1) {
      const resurve0 = MetamaskService.calcTransactionAmount(
        +info?.token0.balance,
        +info?.token0.decimals,
      );
      const resurve1 = MetamaskService.calcTransactionAmount(
        +info?.token1.balance,
        +info?.token1.decimals,
      );

      const share1 = new BigNumber(deposit0)
        .dividedBy(new BigNumber(resurve0).plus(resurve1).plus(deposit0))
        .toString(10);
      const share2 = new BigNumber(deposit1)
        .dividedBy(new BigNumber(resurve0).plus(resurve1).plus(deposit1))
        .toString(10);

      const min = BigNumber.min(share1, share2).toString(10);

      setShare(min);
    }
  }, [deposit0, deposit1, info]);

  React.useEffect(() => {
    getDeposites();
  }, [getDeposites]);

  React.useEffect(() => {
    handleGetShareOfPool();
  }, [handleGetShareOfPool, deposit0, deposit1, info]);

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
          <div className="text-black text-smd text-bold">Your Liquidity</div>
          <div className="liquidity-info__title box-f-ai-c">
            <img src={UnknownImg} alt={info.token0.symbol} />
            <img src={UnknownImg} alt={info.token1.symbol} />
            <span className="text-black text-smd">{`${info.token0.symbol}/${info.token1.symbol}`}</span>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-black text-smd">
            <span>{`${info.token0.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token0.symbol} />
              <span>
                {(+MetamaskService.amountFromGwei(deposit0, +info.token0.decimals)).toFixed()}
              </span>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-black text-smd">
            <span>{`${info.token1.symbol} Deposited`}</span>
            <div className="box-f-ai-c">
              <img src={UnknownImg} alt={info.token1.symbol} />
              <span>
                {(+MetamaskService.amountFromGwei(deposit1, +info.token1.decimals)).toFixed()}
              </span>
            </div>
          </div>
          <div className="liquidity-info__row box-f box-f-jc-sb text-black text-smd">
            <span>Rates</span>
            <div className="text-right">
              <div>{`1 ${info.token0.symbol} = ${+(+info.token1.rate).toFixed(8)} ${
                info.token1.symbol
              }`}</div>
              <br />
              <div>{`1 ${info.token1.symbol} = ${+(+info.token0.rate).toFixed(8)} ${
                info.token0.symbol
              }`}</div>
            </div>
          </div>
          <div className="liquidity-info__row box-f-ai-c box-f-jc-sb text-black text-smd">
            <span>Share of Pool</span>
            <span>{(+share).toFixed(5)}%</span>
          </div>
          <Button
            colorScheme="purple"
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
            <span>Remove</span>
          </Button>
        </div>
      ) : (
        ''
      )}
    </Modal>
  );
});

export default LiquidityInfoModal;
