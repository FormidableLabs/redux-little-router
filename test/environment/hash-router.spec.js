import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { combineReducers as combineImmutableReducers } from 'redux-immutable';

import routerForHash from '../../src/environment/hash-router';
import immutableRouterForHash from '../../src/immutable/environment/hash-router';

import { setupStoreForEnv } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

const hashRouterTest = {
  router: routerForHash,
  combineReducers,
  initialState: {},
  getState: store => store.getState(),
  testLabel: 'hash router'
};
const immutableHashRouterTest = {
  router: immutableRouterForHash,
  combineReducers: combineImmutableReducers,
  initialState: Map(),
  getState: store => store.getState().toJS(),
  testLabel: 'immutable hash router'
};

[hashRouterTest, immutableHashRouterTest].forEach(({
  router,
  combineReducers,
  initialState,
  getState,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
    const setupHashStore = setupStoreForEnv(router, combineReducers, initialState);

    it('creates a hash store enhancer using window.location', () => {
      const store = setupHashStore({
        routes,
        history: {
          listen() {},
          location: {
            pathname: '/home',
            search: '?get=schwifty'
          }
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
      const store = setupHashStore({
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
