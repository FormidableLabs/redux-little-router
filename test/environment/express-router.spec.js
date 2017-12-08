import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import routerForExpress from '../../src/environment/express-router';
import immutableRouterForExpress from '../../src/immutable/environment/express-router';

import { setupStores, getJSState } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Express router', () => {
  const setupExpressStores = setupStores.bind(null, routerForExpress, immutableRouterForExpress);

  it('creates a server store enhancer using Express request object', () => {
    const { store, immutableStore } = setupExpressStores({
      routes,
      request: {
        path: '/home',
        query: { get: 'schwifty' }
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
    const { store, immutableStore } = setupExpressStores({
      routes,
      request: {
        baseUrl: '/cob-planet',
        path: '/home',
        query: { get: 'schwifty' }
      }
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
