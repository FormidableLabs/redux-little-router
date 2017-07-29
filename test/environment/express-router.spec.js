import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import routerForExpress from '../../src/environment/express-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Express router', () => {
  it('creates a server store connector using Express request object', () => {
    const { connect, middleware, reducer } = routerForExpress({
      routes,
      request: {
        path: '/home',
        query: { get: 'schwifty' }
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
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const { connect, middleware, reducer } = routerForExpress({
      routes,
      request: {
        baseUrl: '/cob-planet',
        path: '/home',
        query: { get: 'schwifty' }
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
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
