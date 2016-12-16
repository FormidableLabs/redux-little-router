import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose
} from 'redux';

import routerForHapi from '../../src/environment/hapi-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hapi router', () => {
  it('creates a server store enhancer using Hapi request object', () => {
    const { enhancer, middleware, reducer } = routerForHapi({
      routes,
      request: {
        path: '/home',
        query: { get: 'schwifty' }
      }
    });
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(
        enhancer,
        applyMiddleware(middleware)
      )
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

});
