import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose
} from 'redux';

import routerForExpress from '../../src/environment/express-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Express router', () => {
  it('creates a server store enhancer using Express request object', () => {
    const { enhancer, middleware, reducer } = routerForExpress({
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

  it('supports basenames', () => {
    const { enhancer, middleware, reducer } = routerForExpress({
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
      compose(
        enhancer,
        applyMiddleware(middleware)
      )
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.basename', '/cob-planet');
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
