/* eslint-env browser */
import 'normalize.css/normalize.css';
import './global.css';

import React from 'react';
import { render } from 'react-dom';

import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import {
  createStoreWithRouter,
  RouterProvider
} from '../src';

import routes from './routes';
import Demo from './demo';

const store = createStore(
  state => state,
  {},
  compose(
    createStoreWithRouter({
      routes,
      pathname: window.location.pathname
    }),
    window.devToolsExtension ?
      window.devToolsExtension() : f => f
  )
);

render(
  <Provider store={store}>
    <RouterProvider store={store}>
      <Demo />
    </RouterProvider>
  </Provider>,
  document.getElementById('content')
);
