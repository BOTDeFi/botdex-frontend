import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import TradeWrapper from '../../../../HOC/TradeWrapper';
import { useMst } from '../../../../store';
import { IRecentTx, ISettings } from '../../../../types';
import AddLiquidity from '../AddLiquidity';
import {
  ExchangeSettings,
  ImportPool,
  Receive,
  RecentTxs,
  RemoveLiquidity,
  YourLiquidity,
} from '..';

const GET_USER_TRX = gql`
  query User($address: String!) {
    liquidityPositionSnapshots(
      where: { user: $address, mintOrBurn: true }
      orderBy: timestamp
      orderDirection: desc
    ) {
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      transaction {
        mints {
          amount0
          amount1
          transaction {
            id
          }
        }
        burns {
          amount0
          amount1
          transaction {
            id
          }
        }
      }
    }
  }
`;

const AddLiquidityComp = TradeWrapper(AddLiquidity, 'quote');

const Liquidity: React.FC = observer(() => {
  const { user } = useMst();

  const [getUserTrx, { error, data: userTrx }] = useLazyQuery(GET_USER_TRX, {
    pollInterval: 60000,
  });

  const [trx, setTrx] = React.useState<IRecentTx[] | undefined>(undefined);

  const [settings, setSettings] = React.useState<ISettings>({
    slippage: {
      type: 'btn',
      value: 0.1,
    },
    txDeadline: 20,
    txDeadlineUtc: moment.utc().add(20, 'm').valueOf(),
  });

  const handleSaveSettings = (settingsObj: ISettings): void => {
    setSettings(settingsObj);
  };

  React.useEffect(() => {
    if (user.address) {
      getUserTrx({
        variables: {
          address: user.address,
        },
      });
    }
  }, [user.address, getUserTrx]);

  // React.useEffect(() => {
  //   return () => {
  //     console.log('clean');
  //   };
  // }, []);

  React.useEffect(() => {
    if (!error && userTrx && userTrx.liquidityPositionSnapshots) {
      const trxData: IRecentTx[] = [];

      userTrx.liquidityPositionSnapshots.forEach((pairObj: any) => {
        const dataItem: IRecentTx = {
          type: '',
          address: '',
          from: {
            symbol: '',
            value: 0,
          },
          to: {
            symbol: '',
            value: 0,
          },
        };

        dataItem.from.symbol = pairObj.pair.token0.symbol;
        dataItem.to.symbol = pairObj.pair.token1.symbol;

        if (pairObj.transaction.burns.length) {
          pairObj.transaction.burns.forEach((burnTrx: any) => {
            dataItem.type = 'Burn';
            dataItem.from.value = burnTrx.amount0;
            dataItem.to.value = burnTrx.amount1;
            dataItem.address = burnTrx.transaction.id;

            trxData.push(dataItem);
          });
        }

        if (pairObj.transaction.mints.length) {
          pairObj.transaction.mints.forEach((mintTx: any) => {
            dataItem.type = 'Add Liquidity';
            dataItem.from.value = mintTx.amount0;
            dataItem.to.value = mintTx.amount1;
            dataItem.address = mintTx.transaction.id;

            trxData.push(dataItem);
          });
        }
      });

      setTrx(trxData);
    }
  }, [userTrx, error]);

  return (
    <Switch>
      <Route exact path="/trade/liquidity" component={YourLiquidity} />
      <Route exact path="/trade/liquidity/find" component={ImportPool} />
      <Route
        exact
        path="/trade/liquidity/add"
        render={() => <AddLiquidityComp settings={settings} />}
      />
      <Route
        exact
        path="/trade/liquidity/add/:currencyIdA/:currencyIdB"
        render={() => <AddLiquidityComp settings={settings} />}
      />
      <Route exact path="/trade/liquidity/remove" component={RemoveLiquidity} />
      <Route exact path="/trade/liquidity/receive" component={Receive} />
      <Route
        exact
        path="/trade/liquidity/settings"
        render={() => (
          <ExchangeSettings
            savedSettings={settings}
            handleSave={handleSaveSettings}
            isSlippage={false}
          />
        )}
      />
      <Route exact path="/trade/liquidity/history" render={() => <RecentTxs items={trx} />} />
    </Switch>
  );
});

export default Liquidity;
