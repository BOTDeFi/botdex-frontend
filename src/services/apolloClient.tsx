import React from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import { SNAPSHOT_API, VOTING_API } from '@/config/constants/dao';
import { TRADE_API } from '@/config/constants/trade';

export enum ServicesEndpoints {
  rfExchange = 'rf-exchange',
  rfPairs = 'refinery-finance-pairs',
  snapshot = 'snapshot',
}

// @see https://github.com/apollographql/apollo-client/issues/84#issuecomment-763833895
// @see https://www.apollographql.com/docs/react/api/link/introduction/#providing-to-apollo-client
const rfExchangeGql = new HttpLink({ uri: TRADE_API });
const rfPairsGql = new HttpLink({ uri: VOTING_API });
const snapshotGql = new HttpLink({ uri: SNAPSHOT_API });

// TODO: How to handle multi endpoints in the application?
export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().serviceName === ServicesEndpoints.rfPairs,
    rfPairsGql,
    ApolloLink.split(
      (operation) => operation.getContext().serviceName === ServicesEndpoints.snapshot,
      snapshotGql,
      rfExchangeGql,
    ),
  ),
  cache: new InMemoryCache(),
});

interface IContextServiceName {
  context: { serviceName: ServicesEndpoints };
}

export const ApolloProvider: React.FC = ({ children }) => {
  return <OriginalApolloProvider client={apolloClient}>{children}</OriginalApolloProvider>;
};

export const getRfPairsContext = (): IContextServiceName => ({
  context: { serviceName: ServicesEndpoints.rfPairs },
});
export const getSnapshotContext = (): IContextServiceName => ({
  context: { serviceName: ServicesEndpoints.snapshot },
});
