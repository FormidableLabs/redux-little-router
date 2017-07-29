import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import routerForBrowser from '../../src/environment/browser-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Browser router', () => {
  it('creates a browser store connector using history location', () => {
    const { connect, middleware, reducer } = routerForBrowser({
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
      applyMiddleware(middleware)
    );
    connect(store);
    const state = store.getState();
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const { connect, middleware, reducer } = routerForBrowser({
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
      applyMiddleware(middleware)
    );
    connect(store);
    const state = store.getState();
    expect(state).to.have.nested.property('router.basename', '/cob-planet');
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
