import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import routerForHapi from '../../src/environment/hapi-router';
import immutableRouterForHapi from '../../src/immutable/environment/hapi-router';

import { setupStores, getJSState } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hapi router', () => {
  const setupHapiStores = setupStores.bind(null, routerForHapi, immutableRouterForHapi);

  it('creates a server store enhancer using Hapi request object', () => {
    const { store, immutableStore } = setupHapiStores({
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
});
