import 'normalize.css/normalize.css';
import './global.css';

import { render } from 'react-dom';

/* For immutable, invert following commented code. */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerForBrowser, initializeCurrentLocation } from '../../src';
// import { createStore, compose, applyMiddleware } from 'redux';
// import { combineReducers } from 'redux-immutable';
// import { Map, fromJS } from 'immutable';
// import { routerForBrowser, initializeCurrentLocation } from '../../src/immutable';

import routes from './routes';
import wrap from './wrap';
import Demo from './demo';

const { reducer, enhancer, middleware } = routerForBrowser({ routes });

/* For immutable, invert following commented code. */
const initialState = window.__INITIAL_STATE || {};
// const initialState = window.__INITIAL_STATE ? fromJS(window.__INITIAL_STATE) : Map();

const store = createStore(
  combineReducers({ router: reducer }),
  initialState,
  compose(
    enhancer,
    applyMiddleware(middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

/* For immutable, invert following commented code. */
const initialLocation = store.getState().router;
// const initialLocation = store.getState().get('router');

if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

render(wrap(store)(Demo), document.getElementById('content'));
