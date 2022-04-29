import { VFC } from 'react';

import { Features, InfoTables, Partners, Preview } from '@/components/sections/Home';

import './Home.scss';
import { PriceBotData } from '@/hooks/useFetchPriceBot';

const Home: VFC<{ priceBotData: PriceBotData | null }> = ({ priceBotData }) => {
  return (
    <div className="home-wrapper">
      <Preview priceBotData={priceBotData} />
      <InfoTables />
      <Features />
      <Partners />
    </div>
  );
};

export default Home;
