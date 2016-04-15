import { createStore } from 'redux';

import { PUSH } from 'src/action-types';
import createStoreWithRouter from 'src/store-enhancer';

import MockHistory from './mocks/history';

const mockCreateMatcher = () => () => {
  return {
    pathname: '/changed'
  };
};

const storeWithMiddleware = middleware => {
  const reducer = state => {
    return {...state, hello: 'world' };
  };
  const initialState = {};

  return createStore(
    reducer,
    initialState,
    createStoreWithRouter({
      middleware,
      history: new MockHistory(),
      createMatcher: mockCreateMatcher,
      routes: {
        '/subcategories': 'test'
      }
    })
  );
};

describe('Router store enhancer', () => {
  it('updates the pathname in the state tree after dispatching history actions', done => {
    const store = storeWithMiddleware([]);

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property(
        'router.pathname', '/changed'
      );
      done();
    });

    store.dispatch({
      type: PUSH,
      payload: {
        pathname: '/wat'
      }
    });
  });

  it('does not interfere with other middleware', done => {
    const nothingMiddleware = () => next => action => {
      next(action);
    };
    const store = storeWithMiddleware([nothingMiddleware]);

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property(
        'router.pathname', '/changed'
      );
      done();
    });

    store.dispatch({
      type: PUSH,
      payload: {
        pathname: '/wat'
      }
    });
  });
});
