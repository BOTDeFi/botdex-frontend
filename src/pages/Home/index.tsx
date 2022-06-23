import { useEffect, useState, VFC } from 'react';

import { Features, InfoTables, Partners, Preview } from '@/components/sections/Home';
import { PriceBotData } from '@/hooks/useFetchPriceBot';

import './Home.scss';

const Home: VFC<{ priceBotData: PriceBotData | null }> = ({ priceBotData }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadContent = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(loadContent);
  }, []);

  return (
    <div className="home-wrapper">
      <Preview priceBotData={priceBotData} />
      {isReady ? (
        <>
          <InfoTables />
          <Features />
          <Partners />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Home;
