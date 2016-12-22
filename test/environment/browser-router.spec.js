import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  applyMiddleware,
  combineReducers,
  createStore,
  compose
} from 'redux';

import routerForBrowser from '../../src/environment/browser-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Browser router', () => {
  it('creates a browser store enhancer using window.location', () => {
    const { enhancer, middleware, reducer } = routerForBrowser({
      routes,
      getLocation: () => ({
        pathname: '/home',
        search: '?get=schwifty'
      })
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
    const { enhancer, middleware, reducer } = routerForBrowser({
      routes,
      basename: '/cob-planet',
      getLocation: () => ({
        pathname: '/cob-planet/home',
        search: '?get=schwifty'
      })
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
