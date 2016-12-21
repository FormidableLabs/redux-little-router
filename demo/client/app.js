import 'normalize.css/normalize.css';
import './global.css';

import { render } from 'react-dom';
import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware
} from 'redux';

import { routerForBrowser } from '../../src';

import routes from './routes';
import wrap from './wrap';
import Demo from './demo';

const {
  reducer,
  enhancer,
  middleware
} = routerForBrowser({ routes });

const store = createStore(
  combineReducers({ router: reducer }),
  // If this is a server render, we grab the
  // initial state the hbs template inserted
  window.__INITIAL_STATE || {},
  compose(
    enhancer,
    applyMiddleware(middleware),
    window.devToolsExtension ?
      window.devToolsExtension() : f => f
  )
);

render(
  wrap(store)(Demo),
  document.getElementById('content')
);
