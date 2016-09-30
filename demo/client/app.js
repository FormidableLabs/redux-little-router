import 'normalize.css/normalize.css';
import './global.css';

import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';

import routerForBrowser from '../../src/browser-router';

import routes from './routes';
import wrap from './wrap';
import Demo from './demo';

const {
  routerEnhancer,
  routerMiddleware
} = routerForBrowser({ routes });

const store = createStore(
  state => state,
  // If this is a server render, we grab the
  // initial state the hbs template inserted
  window.__INITIAL_STATE || {},
  compose(
    routerEnhancer,
    applyMiddleware(routerMiddleware),
    window.devToolsExtension ?
      window.devToolsExtension() : f => f
  )
);

render(
  wrap(store)(Demo),
  document.getElementById('content')
);
