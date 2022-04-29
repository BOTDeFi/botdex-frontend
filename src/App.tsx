import React, { useCallback, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react-lite';

import { Footer } from '@/components/sections';
import Header from '@/components/sections/Header';

import ProgressLoader from './components/atoms/ProgressLoader';
import { MetamaskErrModal, RoiModal } from './components/molecules';
import { CookiesWarn } from './components/organisms';
import BotBlock from './components/sections/Footer/BotBlock';
import { useSmoothTopScroll } from './hooks/useSmoothTopScroll';
import {
  ComingSoonPage,
  // CollectiblesPage,
  // DaoListPage,
  // DaoPage,
  // DaoProposalPage,
  FarmsPage,
  HomePage,
  // LotteryPage,
  PoolsPage,
  // TeamPage,
  // TeamsPage,
  TradePage,
} from './pages';
import { useMst } from './store';

import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';
import { useFetchPriceBot } from './hooks/useFetchPriceBot';

const progressPoints = [
  {
    progress: 65,
    ms: 250,
  },
  {
    progress: 85,
    ms: 1000,
  },
  {
    progress: 95,
    ms: 1700,
  },
  {
    progress: 100,
    ms: 2000,
  },
];

const App: React.FC = observer(() => {
  const [isLoadingApp, setLoadingApp] = useState(true);
  const [progressLoading, setProgressLoading] = useState(30);
  const [isCookiesAccepted, setCookiesAccepted] = useState(false);
  const { tokens } = useMst();
  const { pathname } = useLocation();
  // const firstPathAtPathname = useMemo(() => pathname.split('/')[1], [pathname]);
  useSmoothTopScroll(pathname);

  const handleAcceptCookies = useCallback(() => {
    const cookiesValue = Math.random() * 10000;
    document.cookie = `JSSESSION=${cookiesValue}; max-age=86400`;
    setCookiesAccepted(true);
  }, []);

  React.useEffect(() => {
    tokens.getTokens('default');
    tokens.getTokens('top');
    tokens.getTokens('extended');
    tokens.getTokens('imported');
  }, [tokens]);

  React.useEffect(() => {
    if (document.cookie) {
      setCookiesAccepted(true);
    } else {
      setCookiesAccepted(false);
    }
  }, []);

  const [, priceBotData] = useFetchPriceBot();

  React.useEffect(() => {
    progressPoints.forEach(({ progress, ms }) => {
      setTimeout(() => setProgressLoading(progress), ms);
    });
    setTimeout(() => setLoadingApp(false), 3000);
  }, []);

  return (
    <>
      <div className="ref-finance">
        {isLoadingApp && <ProgressLoader progress={progressLoading} />}
        <div className="bg" />
        <Header />
        <Switch>
          <Route exact path="/" render={() => <HomePage priceBotData={priceBotData} />} />
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
          {/* <Route exact path={['/lottery/:id', '/lottery']} component={LotteryPage} /> */}
          <Route exact path="/farms" component={FarmsPage} />
          <Route exact path="/farms/calc" component={FarmsPage} />
          <Route exact path="/staking" component={PoolsPage} />
          <Route exact path="/coming-soon/:page" component={ComingSoonPage} />
          {/* <Route exact path="/collectibles" component={CollectiblesPage} /> */}
          {/* <Route exact path="/teams" component={TeamsPage} /> */}
          {/* <Route exact path="/team/:id" component={TeamPage} /> */}
          {/* <Route exact path="/dao" component={DaoListPage} /> */}
          {/* <Route strict exact path="/dao/:id" component={DaoPage} /> */}
          {/* <Route exact path="/dao/proposal/create" component={DaoProposalPage} /> */}
        </Switch>
        <MetamaskErrModal />
        <RoiModal />
        {!isCookiesAccepted && <CookiesWarn onAccept={handleAcceptCookies} />}
        <BotBlock priceBotData={priceBotData}  />
        <ToastContainer position="top-right" theme="dark" />
      </div>
      <Footer/>
    </>
  );
});

export default App;
