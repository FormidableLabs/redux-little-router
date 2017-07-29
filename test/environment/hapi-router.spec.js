import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import routerForHapi from '../../src/environment/hapi-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hapi router', () => {
  it('creates a server store connector using Hapi request object', () => {
    const { connect, middleware, reducer } = routerForHapi({
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
});
