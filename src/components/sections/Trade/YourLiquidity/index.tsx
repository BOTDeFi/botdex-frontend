import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { gql, useLazyQuery } from '@apollo/client';
import { observer } from 'mobx-react-lite';

import UnknownImg from '@/assets/img/currency/unknown.svg';
import { Button } from '@/components/atoms';
import { contracts } from '@/config';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import { useMst } from '@/store';
import { ILiquidityInfo, ISettings } from '@/types';
import { clogError } from '@/utils/logger';

import { LiquidityInfoModal, TradeBox } from '..';

import './YourLiquidity.scss';
import {baseApi} from "@/store/api";

const USER_PAIRS = gql`
  query User($address: String!) {
    user(id: $address) {
      liquidityPositions {
        pair {
          id
          reserve0
          reserve1
          totalSupply
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

const YourLiquidity: React.FC<{ settings: ISettings }> = observer(({ settings }) => {
  const { user } = useMst();
  const { metamaskService } = useWalletConnectorContext();

  const [getUserLiquidities, { loading, data: userLiquidities }] = useLazyQuery(USER_PAIRS, {
    pollInterval: 60000,
  });

  const [liquidityInfo, setLiquidityInfo] = React.useState<ILiquidityInfo | undefined>(undefined);
  const [liquidities, setLiquidities] = React.useState<any>([]);
  const [reserves, setReserves] = React.useState<any>([]);

  const handleCloseLiquidityInfoModal = (): void => {
    setLiquidityInfo(undefined);
  };

  const handleOpenLiquidityInfoModal = (info: ILiquidityInfo): void => {
    console.log('info', info);
    setLiquidityInfo(info);
  };

  const getTokenIcon = async (token0Address: string, token1Address: string) => {
    const token0IconData = await baseApi.getTokenSingleLogo(token0Address);
    const token1IconData = await baseApi.getTokenSingleLogo(token1Address);

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      token0Icon: token0IconData.data.logo_link,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      token1Icon: token1IconData.data.logo_link,
    };
  }

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
            .then(async (res: any) => {
              if (+res > 0) {
                const icons = await getTokenIcon(data.user.liquidityPositions[i].pair.token0.id, data.user.liquidityPositions[i].pair.token1.id);
                const currentPair = data.user.liquidityPositions[i].pair;
                const pairWithIcons = { pair: {
                    ...currentPair,
                    token0: {...currentPair.token0, logo: icons.token0Icon },
                    token1: {...currentPair.token1, logo: icons.token1Icon },
                  },
                }
                setLiquidities((arr: any) => [...arr, pairWithIcons]);
              }
            })
            .catch((err) => {
              clogError('check lp balance', err);
            });
          metamaskService
            .callContractMethodFromNewContract(
              data.user.liquidityPositions[i].pair.id,
              contracts.PAIR.ABI,
              'getReserves',
            )
            .then((res: any) => {
              setReserves((arr: any) => [
                ...arr,
                // eslint-disable-next-line no-underscore-dangle
                { reserve0: res._reserve0, reserve1: res._reserve1 },
              ]);
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
    return () => {
      setLiquidities([]);
    };
  }, []);

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
        <Button className="y-liquidity__btn btn-hover-down" colorScheme="pink" link="/trade/liquidity/add">
          <span className="text-md text-white text-bold">Add liquidity</span>
        </Button>
        <div className="y-liquidity__title text-md">Your Liquidity</div>
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
              {liquidities.map((liquidity: any, index: number) => (
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
                        reserve: reserves[index].reserve0,
                        logo: liquidity.pair.token0.logo,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                        reserve: reserves[index].reserve1,
                        logo: liquidity.pair.token1.logo,
                      },
                      settings,
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
                        reserve: reserves[index],
                        logo: liquidity.pair.token0.logo,
                      },
                      token1: {
                        address: liquidity.pair.token1.id,
                        symbol: liquidity.pair.token1.symbol,
                        balance: liquidity.pair.reserve1,
                        rate: liquidity.pair.token1Price,
                        decimals: liquidity.pair.token1.decimals,
                        reserve: reserves,
                        logo: liquidity.pair.token1.logo,
                      },
                      settings,
                    })
                  }
                  role="button"
                  tabIndex={0}
                >
                  <img src={liquidity.pair.token0.logo || UnknownImg} alt="" />
                  <img src={liquidity.pair.token1.logo || UnknownImg} alt="" />
                  <span className="text-smd">{`${liquidity.pair.token0.symbol}/${liquidity.pair.token1.symbol}`}</span>
                </div>
              ))}
            </Scrollbar>
          ) : (
            ''
          )}

          {user.address && !loading && !liquidities.length ? (
            <div className="text-center box-f-fd-c box-f-ai-c">
              <div className="y-liquidity__text">No liquidity found.</div>
            </div>
          ) : (
            ''
          )}

          {!user.address ? (
            <div className="text-center">Connect to a wallet to view your liquidity.</div>
          ) : (
            ''
          )}
        </div>
        <div className="text-gray-2">
          <p>Don&lsquo;t see a pool you joined?</p>
          <p>If you staked your LP tokens in a farm, unstake them to see them here.</p>
        </div>
      </TradeBox>
      <LiquidityInfoModal info={liquidityInfo} handleCloseModal={handleCloseLiquidityInfoModal} />
    </>
  );
});

export default YourLiquidity;
