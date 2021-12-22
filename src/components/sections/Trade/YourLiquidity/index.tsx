import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { gql, useLazyQuery } from '@apollo/client';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button } from '@/components/atoms';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ILiquidityInfo } from '@/types';
import { clogError } from '@/utils/logger';

import { LiquidityInfoModal, TradeBox } from '..';

import './YourLiquidity.scss';

const USER_PAIRS = gql`
  query User($address: String!) {
    user(id: $address) {
      liquidityPositions {
        pair {
          id
          reserve0
          reserve1
          token0Price
          token1Price
          token0 {
            symbol
            decimals
            id
          }
          token1 {
            symbol
            decimals
            id
          }
        }
      }
    }
  }
`;

const YourLiquidity: React.FC = observer(() => {
  const { user } = useMst();
  const { metamaskService } = useWalletConnectorContext();

  const [getUserLiquidities, { loading, data: userLiquidities }] = useLazyQuery(USER_PAIRS, {
    pollInterval: 60000,
  });

  const [liquidityInfo, setLiquidityInfo] = React.useState<ILiquidityInfo | undefined>(undefined);
  const [liquidities, setLiquidities] = React.useState<any>([]);

  const handleCloseLiquidityInfoModal = (): void => {
    setLiquidityInfo(undefined);
  };

  const handleOpenLiquidityInfoModal = (info: ILiquidityInfo): void => {
    setLiquidityInfo(info);
  };

  const handleCheckLiquidity = React.useCallback(
    (data: any) => {
      if (data.user.liquidityPositions) {
        for (let i = 0; i < data.user.liquidityPositions.length; i += 1) {
          metamaskService
            .callContractMethodFromNewContract(
              data.user.liquidityPositions[i].pair.id,
              contracts.PAIR.ABI,
              'balanceOf',
              [user.address],
            )
            .then((res: any) => {
              if (+res > 0) {
                setLiquidities((arr: any) => [...arr, data.user.liquidityPositions[i]]);
              }
            })
            .catch((err) => {
              clogError('check lp balance', err);
            });
        }
      }
    },
    [metamaskService, user.address],
  );

  React.useEffect(() => {
    if (user.address) {
      getUserLiquidities({
        variables: {
          address: user.address,
        },
      });
    }
  }, [user.address, getUserLiquidities]);

  React.useEffect(() => {
    if (userLiquidities && userLiquidities.user && !loading) {
      handleCheckLiquidity(userLiquidities);
    }
  }, [userLiquidities, loading, handleCheckLiquidity]);

  return (
    <>
      <TradeBox
        className="y-liquidity"
        title="Liquidity"
        subtitle="Add liquidity to receive LP tokens"
        settingsLink="/trade/liquidity/settings"
        recentTxLink="/trade/liquidity/history"
      >
        <Button className="y-liquidity__btn" link="/trade/liquidity/add">
          <span className="text-md text-white text-bold">Add liquidity</span>
        </Button>
        <div className="y-liquidity__title text-white text-md">Your Liquidity</div>
        <div className="y-liquidity__box">
          {user.address && loading ? 'Loading' : ''}

          {user.address && liquidities && liquidities.length ? (
            <Scrollbar
              className="recent-txs__scroll"
              style={{
                width: '100%',
                height: liquidities.length > 3 ? '50vh' : `${liquidities.length * 76}px`,
              }}
            >
              {liquidities.map((liquidity: any) => (
                <div
                  key={liquidity.pair.id}
                  className="y-liquidity__item box-f-ai-c box-pointer"
                  onClick={() =>
                    handleOpenLiquidityInfoModal({
                      address: liquidity.pair.id,
                      token0: {
                        address: liquidity.pair.token0.id,
                        symbol: liquidity.pair.token0.symbol,
                        balance: liquidity.pair.reserve0,
                        rate: liquidity.pair.token0Price,
                        decimals: liquidity.pair.token0.decimals,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                      },
                    })
                  }
                  onKeyDown={() =>
                    handleOpenLiquidityInfoModal({
                      address: liquidity.pair.id,
                      token0: {
                        address: liquidity.pair.token0.id,
                        symbol: liquidity.pair.token0.symbol,
                        balance: liquidity.pair.reserve0,
                        rate: liquidity.pair.token0Price,
                        decimals: liquidity.pair.token0.decimals,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                      },
                    })
                  }
                  role="button"
                  tabIndex={0}
                >
                  <img src={UnknownImg} alt="" />
                  <img src={UnknownImg} alt="" />
                  <span className="text-white text-smd">{`${liquidity.pair.token0.symbol}/${liquidity.pair.token1.symbol}`}</span>
                </div>
              ))}
            </Scrollbar>
          ) : (
            ''
          )}

          {user.address && !loading && !liquidities.length ? (
            <div className="text-center text-white box-f-fd-c box-f-ai-c">
              <div className="y-liquidity__text">No liquidity found.</div>
            </div>
          ) : (
            ''
          )}

          {!user.address ? (
            <div className="text-center  text-black">
              Connect to a wallet to view your liquidity.
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="text-gray">
          <p>Don&lsquo;t see a pool you joined?</p>
          <p>If you staked your LP tokens in a farm, unstake them to see them here.</p>
        </div>
      </TradeBox>
      <LiquidityInfoModal info={liquidityInfo} handleCloseModal={handleCloseLiquidityInfoModal} />
    </>
  );
});

export default YourLiquidity;
