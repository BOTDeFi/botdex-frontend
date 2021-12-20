// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// import { Helmet } from 'react-helmet';
import { ApolloProvider } from '@/services/apolloClient';

import { RefreshContextProvider } from './hooks/useRefresh';
import Connector from './services/MetamaskConnect';
import App from './App';
import rootStore, { Provider } from './store';

/* <Helmet
      base={{ href: '/' }}
      title="Rock`n`Block"
      meta={[
        { charSet: 'utf-8' },
        { content: 'index, nofollow', name: 'robots' },
        { content: 'width=device-width, initial-scale=1', name: 'viewport' },
        { name: 'description', content: 'Project description' },
        { content: 'ie=edge', httpEquiv: 'x-ua-compatible' },
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:creator', content: '@rocknblock' },
        { name: 'twitter:site', content: 'https://rocknblock.io/' },
        { name: 'twitter:url', content: 'https://rocknblock.io/' },
        { name: 'twitter:image', content: 'https://rocknblock.io/img/share.png' },
        { name: 'twitter:title', content: 'Rock`n`Block Website' },
        { name: 'twitter:description', content: 'Project description' },
        { property: 'og:url', content: 'https://rocknblock.io/' },
        { property: 'og:image', content: 'https://rocknblock.io/img/share.png' },
        { property: 'og:title', content: 'Rock`n`Block Website' },
        { property: 'og:description', content: 'Project description' },
      ]}
    /> */

ReactDOM.render(
  <Provider value={rootStore}>
    <Router>
      <Connector>
        <ApolloProvider>
          <RefreshContextProvider>
            <App />
          </RefreshContextProvider>
        </ApolloProvider>
      </Connector>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
