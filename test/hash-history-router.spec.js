import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createStore } from 'redux';

import routerForHashHistory from '../src/hash-history-router';

import routes from './fixtures/routes';

chai.use(sinonChai);

describe('Hash History router', () => {
  it('creates a browser store enhancer using window.location', () => {
    const { routerEnhancer } = routerForHashHistory({
      routes,
      getLocation: () => ({
        pathname: '/home',
        search: '?get=schwifty'
      })
    });
    const store = createStore(
      state => state,
      {},
      routerEnhancer
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const { routerEnhancer } = routerForHashHistory({
      routes,
      basename: '/cob-planet',
      getLocation: () => ({
        pathname: '/home',
        search: '?get=schwifty'
      })
    });
    const store = createStore(
      state => state,
      {},
      routerEnhancer
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.basename', '/cob-planet');
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
