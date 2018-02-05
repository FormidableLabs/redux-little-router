import 'normalize.css/normalize.css';
import './global.css';

import { render } from 'react-dom';

/* Invert comments for immutable */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import {
  routerForBrowser,
  initializeCurrentLocation,
  block,
  unblock
} from '../../src';
// import { createStore, compose, applyMiddleware } from 'redux';
// import { combineReducers } from 'redux-immutable';
// import { Map, fromJS } from 'immutable';
// import { immutableRouterForBrowser } from '../../src/immutable';
// import { initializeCurrentLocation } from '../../src';

import routes from './routes';
import wrap from './wrap';
import Demo from './demo';

const UNBLOCK_DELAY = 10000;

/* Invert comments for immutable */
const { reducer, enhancer, middleware } = routerForBrowser({ routes });
const initialState = window.__INITIAL_STATE || {};
// const { reducer, enhancer, middleware } = immutableRouterForBrowser({ routes });
// const initialState = window.__INITIAL_STATE ? fromJS(window.__INITIAL_STATE) : Map();

const store = createStore(
  combineReducers({ router: reducer }),
  // If this is a server render, we grab the
  // initial state the hbs template inserted
  initialState,
  compose(
    enhancer,
    applyMiddleware(middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

/* Invert comments for immutable */
const initialLocation = store.getState().router;
// const initialLocation = store.getState().get('router').toJS();

store.dispatch(
  // eslint-disable-next-line consistent-return
  block(() => {
    if (location.pathname.indexOf('cheese') !== -1) {
      return `Are you sure you want to see other pages? It's really all downhill from here.`;
    }
  })
);

setTimeout(() => store.dispatch(unblock()), UNBLOCK_DELAY);

if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

render(wrap(store)(Demo), document.getElementById('content'));
