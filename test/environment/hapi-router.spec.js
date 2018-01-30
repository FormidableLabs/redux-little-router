import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { fromJS } from 'immutable';
import { combineReducers as combineReduxReducers } from 'redux';
import { combineReducers as combineImmutableReducers } from 'redux-immutable';

import routerForHapi from '../../src/environment/hapi-router';
import immutableRouterForHapi from '../../src/immutable/environment/hapi-router';

import { setupStoreForEnv } from '../test-util';
import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

const hapiRouterTest = {
  router: routerForHapi,
  combineReducers: combineReduxReducers,
  toState: state => state,
  readState: state => state,
  testLabel: 'hapi router'
};
const immutableHapiRouterTest = {
  router: immutableRouterForHapi,
  combineReducers: combineImmutableReducers,
  toState: state => fromJS(state),
  readState: state => state.toJS(),
  testLabel: 'immutable hapi router'
};

[hapiRouterTest, immutableHapiRouterTest].forEach(
  ({ router, combineReducers, toState, readState, testLabel }) => {
    describe(`${testLabel}`, () => {
      const setupHapiStore = setupStoreForEnv(
        router,
        combineReducers,
        toState({})
      );

      it('creates a server store enhancer using Hapi request object', () => {
        const store = setupHapiStore({
          routes,
          request: {
            path: '/home',
            query: { get: 'schwifty' }
          }
        });

        const state = readState(store.getState());
        expect(state).to.have.nested.property('router.pathname', '/home');
        expect(state).to.have.nested.property('router.search', '?get=schwifty');
        expect(state)
          .to.have.nested.property('router.query')
          .that.deep.equals({ get: 'schwifty' });
      });
    });
  }
);
