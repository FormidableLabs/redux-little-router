import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, combineReducers, createStore, compose } from 'redux';

import routerForBrowser from '../../src/environment/browser-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Browser router', () => {
  it('creates a browser store enhancer using history location', () => {
    const { enhancer, middleware, reducer } = routerForBrowser({
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
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(enhancer, applyMiddleware(middleware))
    );
    const state = store.getState();
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const { enhancer, middleware, reducer } = routerForBrowser({
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
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(enhancer, applyMiddleware(middleware))
    );
    const state = store.getState();
    expect(state).to.have.nested.property('router.basename', '/cob-planet');
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('matches route without replacing basename', () => {
    const { enhancer, middleware, reducer } = routerForBrowser({
      routes,
      basename: '/app',
      history: {
        location: {
          pathname: '/foo/app/bar',
        },
        listen() {}
      }
    });
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(enhancer, applyMiddleware(middleware))
    );
    const state = store.getState();
    expect(state).to.have.nested.property('router.basename', '/app');
    expect(state).to.have.nested.property('router.pathname', '/foo/app/bar');
  });

});
