import createMemoryHistory from 'history/createMemoryHistory';

import createMatcher from '../../src/create-matcher';

import defaultRoutes from '../fixtures/routes';

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
  pathname = '/home/messages/b-team',
  query = { test: 'ing' },
  route = '/home/messages/:team',
  routes = defaultRoutes
} = {}) => {
  const history = createMemoryHistory();

  return {
    subscribe() {},

    getState() {
      return {
        router: {
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

export const fakeContext = ({
  assertion,
  pathname = '/home/messages/b-team',
  route = '/home/messages/:team',
  query = { test: 'ing' }
} = {}) => ({
  context: {
    router: {
      store: fakeStore({
        assertion,
        pathname,
        query,
        route
      })
    }
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
