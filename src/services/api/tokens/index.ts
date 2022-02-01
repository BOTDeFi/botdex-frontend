import { localApi } from '@/core/axios';

export default {
  getDefaultTokens: (): any => localApi.get('default-tokens.json'),
  getTopTokens: (): any => localApi.get('top-100-tokens.json'),
  getExtendedTokens: (): any => localApi.get('extended-tokens.json'),
};
