import { flow, types } from 'mobx-state-tree';

import { tokensApi } from '@/services/api';
import { clogError } from '@/utils/logger';

const TokenModel = types.model({
  name: types.string,
  symbol: types.string,
  address: types.string,
  chainId: types.optional(types.number, 56),
  decimals: types.union(types.number, types.string),
  logoURI: types.optional(types.string, ''),
});

const TokensModel = types
  .model({
    default: types.optional(types.array(TokenModel), []),
    top: types.optional(types.array(TokenModel), []),
    extended: types.optional(types.array(TokenModel), []),
    imported: types.optional(types.array(TokenModel), []),
  })
  .actions((self) => {
    const getTokens = flow(function* getTokens(type: 'top' | 'default' | 'extended' | 'imported') {
      try {
        let responce: any = {};
        switch (type) {
          case 'top':
            responce = yield tokensApi.getTopTokens();
            break;
          case 'extended':
            responce = yield tokensApi.getExtendedTokens();
            break;
          case 'imported':
            responce.data = localStorage.importTokens ? JSON.parse(localStorage.importTokens) : [];
            break;
          default:
            responce = yield tokensApi.getDefaultTokens();
            break;
        }

        self[type] = responce.data;
      } catch (err) {
        clogError(err);
      }
    });

    const setTokens = (type: 'top' | 'default' | 'extended' | 'imported', tokens: any) => {
      self[type] = tokens;
    };

    return {
      getTokens,
      setTokens,
    };
  });

export default TokensModel;
