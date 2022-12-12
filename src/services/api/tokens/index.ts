import { coinGeckoApi, localApi } from '@/core/axios';

export default {
  getDefaultTokens: (): any => localApi.get('default-tokens.json?v=2'),
  getTopTokens: (): any => localApi.get('cmc.json'),
  getExtendedTokens: (): any => localApi.get('pancakeswap-extended.json'),
  getBotStats: (): any => coinGeckoApi.get('bot-planet'),
};
