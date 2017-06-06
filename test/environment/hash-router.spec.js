import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose
} from 'redux';

import routerForHash from '../../src/environment/hash-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hash router', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('creates a browser store enhancer using window.location', () => {
    window.location.hash = '/home?get=schwifty';
    const { enhancer, middleware, reducer } = routerForHash({ routes });
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
    window.location.hash = '/cob-planet/home?get=schwifty';
    const { enhancer, middleware, reducer } = routerForHash({
      routes,
      basename: '/cob-planet'
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
