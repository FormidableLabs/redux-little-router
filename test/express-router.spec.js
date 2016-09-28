import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createStore } from 'redux';

import routerForExpress from '../src/express-router';

import routes from './fixtures/routes';

chai.use(sinonChai);

describe('Express router', () => {
  it('creates a browser store enhancer using window.location', () => {
    const store = createStore(
      state => state,
      {},
      routerForExpress({
        routes,
        request: {
          path: '/home',
          query: { get: 'schwifty' }
        }
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
      routerForExpress({
        routes,
        request: {
          baseUrl: '/cob-planet',
          path: '/home',
          query: { get: 'schwifty' }
        }
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
