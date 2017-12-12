import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { fromJS } from 'immutable';
import { combineReducers as combineReduxReducers } from 'redux';
import { combineReducers as combineImmutableReducers } from 'redux-immutable';
import * as createBrowserHistory from 'history/createBrowserHistory';

import routerForBrowser from '../../src/environment/browser-router';
import immutableRouterForBrowser from '../../src/immutable/environment/browser-router';

import { setupStoreForEnv } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

const browserRouterTest = {
  router: routerForBrowser,
  combineReducers: combineReduxReducers,
  toState: state => state,
  readState: state => state,
  testLabel: 'browser router'
};
const immutableBrowserRouterTest = {
  router: immutableRouterForBrowser,
  combineReducers: combineImmutableReducers,
  toState: state => fromJS(state),
  readState: state => state.toJS(),
  testLabel: 'immutable browser router'
};

[browserRouterTest, immutableBrowserRouterTest].forEach(({
  router,
  combineReducers,
  toState,
  readState,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
    const setupBrowserStore = setupStoreForEnv(router, combineReducers, toState({}));

    it('creates a browser store enhancer using history location', () => {
      const store = setupBrowserStore({
        routes,
        history: {
          location: {
            pathname: '/home',
            search: '?get=schwifty',
            hash: '#wubbalubbadubdub'
          },
          listen() {}
        }
      });
      const state = readState(store.getState());

      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });

    it('supports basenames', () => {
      const store = setupBrowserStore({
        routes,
        basename: '/cob-planet',
        history: {
          location: {
            pathname: '/cob-planet/home',
            search: '?get=schwifty',
            hash: '#wubbalubbadubdub'
          },
          listen() {}
        }
      });
      const state = readState(store.getState());

      expect(state).to.have.nested.property('router.basename', '/cob-planet');
      expect(state).to.have.nested.property('router.pathname', '/home');
      expect(state).to.have.nested.property('router.search', '?get=schwifty');
      expect(state).to.have.nested.property('router.hash', '#wubbalubbadubdub');
      expect(state).to.have.nested
        .property('router.query')
        .that.deep.equals({ get: 'schwifty' });
    });

    it('matches route without replacing basename', () => {
      const store = setupBrowserStore({
        routes,
        basename: '/app',
        history: {
          location: {
            pathname: '/foo/app/bar',
          },
          listen() {}
        }
      });

      const state = readState(store.getState());
      expect(state).to.have.nested.property('router.basename', '/app');
      expect(state).to.have.nested.property('router.pathname', '/foo/app/bar');
    });

    it('calls createBrowserHistory when history is not provided', () => {
      sandbox.stub(createBrowserHistory, 'default').returns({
        listen() {},
        location: {
          pathname: '/home',
          search: '?get=schwifty'
        }
      });
      setupBrowserStore({
        routes,
        basename: '/cob-planet'
      });
      expect(createBrowserHistory.default).to.be.calledWith({ basename: '/cob-planet' });
    });
  });
});
