import createMemoryHistory from 'history/createMemoryHistory';
import { Map } from 'immutable';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutable';

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

export const fakeStore = (
  {
    assertion,
    basename,
    pathname = '/home/messages/b-team',
    query = { test: 'ing' },
    route = '/home/messages/:team',
    routes = defaultRoutes
  } = {}
) => {
  const history = createMemoryHistory();

  return {
    subscribe() {},

    getState() {
      return {
        router: {
          basename,
          pathname,
          query,
          search: '?test=ing',
          action: 'POP',
          route
        }
      };
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

export const fakeContext = (
  {
    assertion,
    basename,
    pathname = '/home/messages/b-team',
    route = '/home/messages/:team',
    query = { test: 'ing' }
  } = {}
) => ({
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

export const standardClickEvent = {
  button: 0,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ctrlKey: false,
  preventDefault() {}
};

export const setupStores = (routerForEnv, immutableRouterForEnv, routerArg) => {
  const router = routerForEnv(routerArg);
  const immutableRouter = immutableRouterForEnv(routerArg);
  const store = createStore(
    combineReducers({ router: router.reducer }),
    {},
    compose(router.enhancer, applyMiddleware(router.middleware))
  );
  const immutableStore = createStore(
    immutableCombineReducers({ router: immutableRouter.reducer }),
    Map(),
    compose(immutableRouter.enhancer, applyMiddleware(immutableRouter.middleware))
  );
  return {
    store,
    immutableStore
  };
};

export const getJSState = (store) => {
  const state = store.getState();
  return state.toJS ? state.toJS() : state;
};
