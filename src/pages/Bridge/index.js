import React from 'react';
import { App } from './App';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
import { ContractProvider } from './app/contexts';
// eslint-disable-next-line no-undef

const Bridge = () => (
    <Provider store={store}>
        <ContractProvider>
            <App />
        </ContractProvider>
    </Provider>
);

export default Bridge;
