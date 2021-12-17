import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { MetamaskErrModal, RoiModal } from './components/molecules';
import { Header } from './components/sections';
import {
  CollectiblesPage,
  DaoListPage,
  DaoPage,
  DaoProposalPage,
  FarmsPage,
  LotteryPage,
  PoolsPage,
  TeamPage,
  TeamsPage,
  TradePage,
} from './pages';
import { useMst } from './store';

import './styles/index.scss';

const App: React.FC = observer(() => {
  const { tokens } = useMst();

  React.useEffect(() => {
    tokens.getTokens('default');
    tokens.getTokens('top');
    tokens.getTokens('extended');
    tokens.getTokens('imported');
  }, [tokens]);

  return (
    <div className="ref-finance">
      <Header />
      <Switch>
        <Route
          exact
          path={[
            '/trade',
            '/trade/swap',
            '/trade/liquidity',
            '/trade/bridge',
            '/trade/swap/settings',
            '/trade/swap/history',
            '/trade/liquidity/settings',
            '/trade/liquidity/history',
            '/trade/liquidity/find',
            '/trade/liquidity/add',
            '/trade/liquidity/add/:currencyIdA/:currencyIdB',
            '/trade/liquidity/remove',
            '/trade/liquidity/receive',
          ]}
          component={TradePage}
        />
        <Route exact path={['/lottery/:id', '/lottery']} component={LotteryPage} />
        <Route exact path="/farms" component={FarmsPage} />
        <Route exact path="/pools" component={PoolsPage} />
        <Route exact path="/collectibles" component={CollectiblesPage} />
        <Route exact path="/teams" component={TeamsPage} />
        <Route exact path="/team/:id" component={TeamPage} />
        <Route exact path="/dao" component={DaoListPage} />
        <Route strict exact path="/dao/:id" component={DaoPage} />
        <Route exact path="/dao/proposal/create" component={DaoProposalPage} />
      </Switch>
      <MetamaskErrModal />
      <RoiModal />
    </div>
  );
});

export default App;
