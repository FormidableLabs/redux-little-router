import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import routerForHash from '../../src/environment/hash-router';
import immutableRouterForHash from '../../src/immutable/environment/hash-router';

import { setupStores, getJSState } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hash router', () => {
  const setupHashStores = setupStores.bind(null, routerForHash, immutableRouterForHash);

  it('creates a browser store enhancer using window.location', () => {
    const { store, immutableStore } = setupHashStores({
      routes,
      history: {
        listen() {},
        location: {
          pathname: '/home',
          search: '?get=schwifty'
        }
      }
    });

    [store, immutableStore].forEach(s => {
      const state = getJSState(s);
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });
  });

  it('supports basenames', () => {
    const { store, immutableStore } = setupHashStores({
      routes,
      history: {
        listen() {},
        location: {
          pathname: '/home',
          search: '?get=schwifty'
        }
      },
      basename: '/cob-planet'
    });

    [store, immutableStore].forEach(s => {
      const state = getJSState(s);
      expect(state).to.have.nested.property('router.basename', '/cob-planet');
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });
  });
});
