import { useEffect, useState } from 'react';

import { baseApi } from '@/store/api';

export interface PriceBotData {
  price: number;
  daily_volume: number;
  market_cap: number;
  updated_at: string;
}

export const useFetchPriceBot = (): [boolean, PriceBotData | null] => {
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState<PriceBotData | null>(null);

  const fetchPriceBot = async () => {
    setLoading(true);
    try {
      const { data } = await baseApi.getPriceBot();
      setPrice(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceBot();
  }, []);

  return [isLoading, price];
};
