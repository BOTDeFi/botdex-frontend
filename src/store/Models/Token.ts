import { types } from 'mobx-state-tree';

import AddressModel from './Address';

const TokenModel = types.model({
  symbol: types.string,
  address: AddressModel,
  decimals: types.optional(types.number, 18),
  projectLink: types.optional(types.string, 'https://example.com'),
  logoURI: types.optional(types.string, 'https://logo.com'),
  busdPrice: types.optional(types.string, ''),
});

export default TokenModel;
