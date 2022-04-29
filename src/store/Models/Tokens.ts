import { flow, Instance, types } from 'mobx-state-tree';

import { tokensApi } from '@/services/api';
import { clogError } from '@/utils/logger';

import { baseApi } from '../api';

const TokenModel = types.model({
  name: types.string,
  symbol: types.string,
  address: types.string,
  chainId: types.optional(types.number, 56),
  decimals: types.union(types.number, types.string),
  logoURI: types.optional(types.string, ''),
});
export type ITokenModel = Instance<typeof TokenModel>;

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
        let response: any = {};
        let tokenLogos;
        switch (type) {
          case 'top':
            response = yield tokensApi.getTopTokens();
            break;
          case 'extended':
            response = yield tokensApi.getExtendedTokens();
            break;
          case 'imported':
            response.data = localStorage.importTokens ? JSON.parse(localStorage.importTokens) : [];
            break;
          default:
            response = yield tokensApi.getDefaultTokens();

            tokenLogos = yield baseApi.getTokenAllLogos(
              response.data.map(({ address }: any) => address),
            );
            tokenLogos.data.logo_links.forEach((logo: string, index: number) => {
              response.data[index].logoURI = logo || '';
            });
            break;
        }

        self[type] = response.data;
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
