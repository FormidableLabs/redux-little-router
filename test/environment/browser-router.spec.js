import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { Map } from 'immutable';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutable';

import routerForBrowser from '../../src/environment/browser-router';
import immutableRouterForBrowser from '../../src/immutable/environment/browser-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Browser router', () => {
  const setupStore = (routerArg) => {
    const router = routerForBrowser(routerArg);
    const immutableRouter = immutableRouterForBrowser(routerArg);
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

  const getJSState = (store) => {
    const state = store.getState();
    return state.toJS ? state.toJS() : state;
  };

  it('creates a browser store enhancer using history location', () => {
    const { store, immutableStore } = setupStore({
      routes,
      history: {
        location: {
          pathname: '/home',
          search: '?get=schwifty',
          hash: '#wubbalubbadubdub'
        },
        listen() {}
      }
    });

    [store, immutableStore].forEach(s => {
      const state = getJSState(s);
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });
  });

  it('supports basenames', () => {
    const { store, immutableStore } = setupStore({
      routes,
      basename: '/cob-planet',
      history: {
        location: {
          pathname: '/cob-planet/home',
          search: '?get=schwifty',
          hash: '#wubbalubbadubdub'
        },
        listen() {}
      }
    });

    [store, immutableStore].forEach(s => {
      const state = getJSState(s);
      expect(state).to.have.nested.property('router.basename', '/cob-planet');
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });
  });

  it('matches route without replacing basename', () => {
    const { store, immutableStore } = setupStore({
      routes,
      basename: '/app',
      history: {
        location: {
          pathname: '/foo/app/bar',
        },
        listen() {}
      }
    });

    [store, immutableStore].forEach(s => {
      const state = getJSState(s);
      expect(state).to.have.nested.property('router.basename', '/app');
      expect(state).to.have.nested.property('router.pathname', '/foo/app/bar');
    });
  });
});
