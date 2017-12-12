import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { fromJS } from 'immutable';
import { combineReducers as combineReduxReducers } from 'redux';
import { combineReducers as combineImmutableReducers } from 'redux-immutable';
import * as createHashHistory from 'history/createHashHistory';

import routerForHash from '../../src/environment/hash-router';
import immutableRouterForHash from '../../src/immutable/environment/hash-router';

import { setupStoreForEnv } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

const hashRouterTest = {
  router: routerForHash,
  combineReducers: combineReduxReducers,
  toState: state => state,
  readState: state => state,
  testLabel: 'hash router'
};
const immutableHashRouterTest = {
  router: immutableRouterForHash,
  combineReducers: combineImmutableReducers,
  toState: state => fromJS(state),
  readState: state => state.toJS(),
  testLabel: 'immutable hash router'
};

[hashRouterTest, immutableHashRouterTest].forEach(({
  router,
  combineReducers,
  toState,
  readState,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
    const setupHashStore = setupStoreForEnv(router, combineReducers, toState({}));

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

      const state = readState(store.getState());
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

      const state = readState(store.getState());
      expect(state).to.have.nested.property('router.basename', '/cob-planet');
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });

    it('calls createHashHistory when history is not provided', () => {
      sandbox.stub(createHashHistory, 'default').returns({
        listen() {},
        location: {
          pathname: '/home',
          search: '?get=schwifty'
        }
      });
      setupHashStore({
        routes,
        basename: '/cob-planet'
      });
      expect(createHashHistory.default).to.be.calledWith({
        basename: '/cob-planet',
        hashType: 'slash'
      });
    });
  });
});
