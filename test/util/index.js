import createMatcher from '../../src/create-matcher';

import routes from '../fixtures/routes';

export const captureErrors = (done, assertions) => {
  try {
    assertions();
    done();
  } catch (e) {
    done(e);
  }
};

export const fakeStore = (
  assertion,
  pathname = '/home/messages/b-team',
  query = { test: 'ing' }
) => ({
  getState() {
    return {
      router: {
        pathname,
        query,
        search: '?test=ing',
        action: 'POP'
      }
    };
  },

  dispatch(action) {
    assertion && assertion(action);
  },

  matchRoute: createMatcher(routes)
});

export const fakeContext = ({
  fakeNewLocation,
  assertion,
  pathname = '/home/messages/b-team',
  query = { test: 'ing' }
} = {}) => ({
  context: {
    router: {
      store: fakeStore(assertion, pathname, query),
      history: {
        createLocation: () => fakeNewLocation || null
      }
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
