import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import reducers from './reducers';
import thunk from 'redux-thunk';

export const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk)
);
