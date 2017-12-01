import 'normalize.css/normalize.css';
import './global.css';

import { render } from 'react-dom';
// import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';
import { fromJS, Map } from 'immutable';

// import { routerForBrowser, initializeCurrentLocation } from '../../src';
import { routerForBrowser, initializeCurrentLocation } from '../../src/immutable';

import routes from './routes';
import wrap from './wrap';
import Demo from './demo';

const { reducer, enhancer, middleware } = routerForBrowser({ routes });

const initialState = window.__INITIAL_STATE ? fromJS(window.__INITIAL_STATE) : Map();
// const initialState = window.__INITIAL_STATE || {};

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

// const initialLocation = store.getState().router;
const initialLocation = store.getState().get('router');
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

render(wrap(store)(Demo), document.getElementById('content'));
