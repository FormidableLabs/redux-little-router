import createMemoryHistory from 'history/createMemoryHistory';

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
  routes = defaultRoutes
} = {}) => {
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

export const fakeContext = ({
  assertion,
  basename,
  pathname = '/home/messages/b-team',
  route = '/home/messages/:team',
  query = { test: 'ing' }
} = {}) => ({
  context: {
    router: {
      store: fakeStore({
        assertion,
        basename,
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
