import axios from 'axios';

import { IS_PRODUCTION } from '@/config/contracts';

export const localApi = axios.create({
  baseURL: IS_PRODUCTION ? 'https://botswap.app' : 'http://localhost:3000/', // https://botswap.herokuapp.com/ https://botswap.app
});

export const coinGeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/coins/',
});
