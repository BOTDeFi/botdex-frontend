import { localApi } from '../../../core/axios';

export default {
  getDefaultTokens: () => localApi.get('default-tokens.json'),
  getTopTokens: () => localApi.get('top-100-tokens.json'),
  getExtendedTokens: () => localApi.get('extended-tokens.json'),
};
