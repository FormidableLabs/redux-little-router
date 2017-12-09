/* eslint-disable new-cap */
import createMemoryHistory from 'history/createMemoryHistory';
import { fromJS } from 'immutable';
import { applyMiddleware, createStore, compose } from 'redux';

import createMatcher from '../../src/util/create-matcher';

import defaultRoutes from '../test-util/fixtures/routes';

export const captureErrors = (done, assertions) => {
  try {
    assertions();
    done();
  } catch (e) {
    done(e);
  }
};

export const fakeStore = ({
  assertion,
  basename,
  pathname = '/home/messages/b-team',
  query = { test: 'ing' },
  route = '/home/messages/:team',
  routes = defaultRoutes,
  immutable = false
} = {}) => {
  const history = createMemoryHistory();
  const state = {
    router: {
      basename,
      pathname,
      query,
      search: '?test=ing',
      action: 'POP',
      route
    }
  };

  return {
    subscribe() {},
    getState() {
      return immutable ? fromJS(state) : state;
    },
    dispatch(action) {
      assertion && assertion(action);
    },
    routes,
    history,
    matchRoute: createMatcher(routes),
    matchWildcardRoute: createMatcher(routes, true)
  };
};

export const fakeContext = ({
  assertion,
  basename,
  pathname = '/home/messages/b-team',
  route = '/home/messages/:team',
  query = { test: 'ing' }
} = {}) => ({
  context: {
    store: fakeStore({
      assertion,
      basename,
      pathname,
      query,
      route
    })
  }
});

export const fakeImmutableContext = ({
  assertion,
  basename,
  pathname = '/home/messages/b-team',
  route = '/home/messages/:team',
  query = { test: 'ing' }
} = {}) => ({
  context: {
    store: fakeStore({
      assertion,
      basename,
      pathname,
      query,
      route,
      immutable: true
    })
  }
});

export const standardClickEvent = {
  button: 0,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ctrlKey: false,
  preventDefault() {}
};

export const setupStoreForEnv = (routerForEnv, combineReducers, initialState) =>
  (routerArg) => {
    const { reducer, middleware, enhancer } = routerForEnv(routerArg);
    return createStore(
      combineReducers({ router: reducer }),
      initialState,
      compose(enhancer, applyMiddleware(middleware))
    );
  };
