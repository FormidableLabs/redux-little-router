export const captureErrors = (done, assertions) => {
  try {
    assertions();
    done();
  } catch (e) {
    done(e);
  }
};

export const fakeStore = assertion => ({
  getState() {
    return {
      router: {
        pathname: '/home/messages/b-team',
        search: '?test=ing',
        hash: '',
        state: undefined,
        action: 'POP',
        key: 'witlrs',
        query: { test: 'ing' },
        url: '/home/messages/b-team'
      }
    };
  },

  dispatch(action) {
    assertion && assertion(action);
  }
});

export const fakeContext = ({ fakeNewLocation, assertion }) => ({
  context: {
    router: {
      store: fakeStore(assertion),
      history: {
        createLocation: () => fakeNewLocation
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
