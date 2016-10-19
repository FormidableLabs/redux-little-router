import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createStore } from 'redux';

import routerForHapi from '../src/hapi-router';

import routes from './fixtures/routes';

chai.use(sinonChai);

describe('Hapi router', () => {
  it('creates a server store enhancer using Hapi request object', () => {
    const { routerEnhancer } = routerForHapi({
      routes,
      request: {
        path: '/home',
        query: { get: 'schwifty' }
      }
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

});
