import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { combineReducers } from 'redux-immutable';
import { combineReducers as combineReducers2 } from 'redux-immutablejs';
import { createStore } from 'redux';
import Immutable from 'immutable';

import immutableStoreEnhancer from '../src/immutable-store-enhancer';
import createStoreWithRouter from '../src/store-enhancer';
import defaultRoutes from './fixtures/routes';
import { LOCATION_CHANGED } from '../src/action-types';

chai.use(sinonChai);

const defaultFakeInitialState = Immutable.fromJS({
  stuff: []
});

const reducer1 = combineReducers({
  stuff: (state = defaultFakeInitialState) => state
});

const reducer2 = combineReducers2({
  stuff: (state = defaultFakeInitialState) => state
});

const reducers = [reducer1, reducer2];


// eslint-disable-next-line max-statements
describe('Router immutable store enhancer', () => {
  reducers.forEach((reducer) => {
    it('should retrieve the router initial state and inject it in the immutable state', () => {
      const store = immutableStoreEnhancer(createStoreWithRouter({
        routes: defaultRoutes, pathname: '/home', query: { ex: 'ample' }
      }))(createStore)(reducer, defaultFakeInitialState);

      expect(store.getState().get('router'))
        .to.have.property('pathname')
        .that.equals('/home');
      expect(store.getState().get('router'))
        .to.have.property('query')
        .that.deep.equals({ ex: 'ample' });
    });

    it('should retrieve the new router state and inject it in the immutable state', (done) => {
      const store = immutableStoreEnhancer(createStoreWithRouter({
        routes: defaultRoutes
      }))(createStore)(reducer, defaultFakeInitialState);

      // eslint-disable-next-line max-nested-callbacks
      store.subscribe(() => {
        const state = store.getState();
        expect(state.get('router')).to.have.deep.property('result')
          .that.deep.equals({ name: 'channel' });
        done();
      });

      store.dispatch({
        type: LOCATION_CHANGED,
        payload: {
          pathname: '/home/messages/a-team/fool-pity',
          result: {
            name: 'channel'
          }
        }
      });
    });
  });
});
