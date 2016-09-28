import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createStore } from 'redux';

import routerForBrowser from '../src/browser-router';

import routes from './fixtures/routes';

chai.use(sinonChai);

describe('Browser router', () => {
  it('creates a browser store enhancer using window.location', () => {
    const store = createStore(
      state => state,
      {},
      routerForBrowser({
        routes,
        getLocation: () => ({
          pathname: '/home',
          search: '?get=schwifty'
        })
      })
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const store = createStore(
      state => state,
      {},
      routerForBrowser({
        routes,
        basename: '/cob-planet',
        getLocation: () => ({
          pathname: '/home',
          search: '?get=schwifty'
        })
      })
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.basename', '/cob-planet');
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
