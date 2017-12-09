import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { combineReducers as combineImmutableReducers } from 'redux-immutable';

import routerForExpress from '../../src/environment/express-router';
import immutableRouterForExpress from '../../src/immutable/environment/express-router';

import { setupStoreForEnv } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

const expressRouterTest = {
  router: routerForExpress,
  combineReducers,
  initialState: {},
  getState: store => store.getState(),
  testLabel: 'express router'
};
const immutableExpressRouterTest = {
  router: immutableRouterForExpress,
  combineReducers: combineImmutableReducers,
  initialState: Map(),
  getState: store => store.getState().toJS(),
  testLabel: 'immutable express router'
};

[expressRouterTest, immutableExpressRouterTest].forEach(({
  router,
  combineReducers,
  initialState,
  getState,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
    const setupExpressStore = setupStoreForEnv(router, combineReducers, initialState);

    it('creates a server store enhancer using Express request object', () => {
      const store = setupExpressStore({
        routes,
        request: {
          path: '/home',
          query: { get: 'schwifty' }
        }
      });

      const state = getState(store);
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });

    it('supports basenames', () => {
      const store = setupExpressStore({
        routes,
        request: {
          baseUrl: '/cob-planet',
          path: '/home',
          query: { get: 'schwifty' }
        }
      });

      const state = getState(store);
      expect(state).to.have.nested.property('router.basename', '/cob-planet');
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });
  });
});
