/* eslint-disable new-cap */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { Map } from 'immutable';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutable';

import { PUSH, REPLACE_ROUTES, POP } from '../src/types';
import { locationDidChange, didReplaceRoutes, replace } from '../src/actions';
import { createHistoryListener, createStoreSubscriber } from '../src/enhancer';
import install from '../src/install';
import immutableInstall from '../src/immutable/install';

import createMatcher from '../src/util/create-matcher';
import defaultRoutes from './test-util/fixtures/routes';

chai.use(sinonChai);

describe('Router store enhancer', () => {
  let testObj;
  let immutableTestObj;

  const setupTest = (installRouter, combineReduxReducers, initialState) => {
    const listenStub = sandbox.stub();
    const listen = sandbox.spy(cb => cb({ pathname: '/' }));
    const push = sandbox.spy(() => listen(listenStub));
    const replaceStub = sandbox.spy(() => listen(listenStub));
    const historyStub = { push, replace: replaceStub, listen };

    const { reducer, middleware, enhancer } = installRouter({
      routes: defaultRoutes,
      history: historyStub,
      location: { pathname: '/' }
    });

    const store = createStore(
      combineReduxReducers({ router: reducer }),
      initialState,
      compose(enhancer, applyMiddleware(middleware))
    );

    sandbox.spy(store, 'dispatch');

    return { store, historyStub, listenStub };
  };

  beforeEach(() => {
    testObj = setupTest(install, combineReducers, {});
    immutableTestObj = setupTest(immutableInstall, immutableCombineReducers, Map());
  });

  it('dispatches a LOCATION_CHANGED action on location change', () => {
    [testObj, immutableTestObj].forEach(({ store, historyStub, listenStub }) => {
      store.dispatch({
        type: PUSH,
        payload: { pathname: '/' }
      });
      expect(historyStub.push).to.be.calledOnce;
      expect(listenStub).to.be.calledOnce;
      expect(store.dispatch).to.be.calledOnce;
    });
  });

  it('attaches the matcher to the store', () => {
    [testObj, immutableTestObj].forEach(({ store }) => {
      expect(store).to.have.property('matchRoute');
    });
  });

  it('replaces routes', () => {
    [testObj, immutableTestObj].forEach(({ store, historyStub, listenStub }) => {
      store.dispatch({
        type: REPLACE_ROUTES,
        payload: {
          routes: { '/': { could: 'you not' } },
          options: {
            updateRoutes: true
          }
        }
      });

      // This dispatch isn't the dispatch used in the enhancer
      // (each enhancer has its own copy of dispatch)
      expect(store.dispatch).to.be.calledOnce;
      expect(historyStub.replace).to.be.calledOnce;
      expect(listenStub).to.be.calledOnce;

      const state = store.getState();
      const routes = state.getIn
        ? state.getIn(['router', 'routes']).toJS()
        : state.router.routes;

      const matcher = createMatcher(routes);
      expect(matcher('/')).to.have.deep.property('result', {
        could: 'you not'
      });
    });
  });

  describe('createHistoryListener', () => {
    let historyListener;
    let currentMatcher;
    let dispatch;

    beforeEach(() => {
      dispatch = sandbox.spy();
      // Mock the matcher by just returning a object with a single
      // `route` field populated with the pathname.
      // eslint-disable-next-line max-nested-callbacks
      currentMatcher = sandbox.spy((pathname) => ({ route: pathname }));
      historyListener = createHistoryListener(dispatch);
    });

    it('should call currentMatcher with the pathname', () => {
      historyListener(
        currentMatcher,
        { pathname: '/lol/k' },
        PUSH
      );
      expect(currentMatcher).to.have.been.calledOnce;
      expect(currentMatcher).to.have.been.calledWith('/lol/k');
    });

    it('should dispatch a LOCATION_CHANGED action', () => {
      historyListener(
        currentMatcher,
        { pathname: '/lol/k', search: '?foo=bar' },
        PUSH
      );
      expect(dispatch).to.have.been.calledOnce;
      expect(dispatch).to.have.been.calledWith(locationDidChange({
        pathname: '/lol/k',
        route: '/lol/k',
        query: { foo: 'bar' },
        search: '?foo=bar'
      }));
    });

    it('should dispatch a POP action for POP events', () => {
      historyListener(
        currentMatcher,
        { pathname: '/lol/k', search: '?foo=bar' },
        "POP"
      );
      // eslint-disable-next-line no-magic-numbers
      expect(dispatch).to.have.been.calledTwice;
      expect(dispatch.getCall(0).args[0]).to.deep.equal({
        type: POP,
        payload: {
          pathname: '/lol/k',
          route: '/lol/k',
          query: { foo: 'bar' },
          search: '?foo=bar'
        }
      });
    });
  });

  describe('createStoreSubscriber', () => {
    let getState;
    let dispatch;
    let currentMatcher;
    let storeSubscriber;
    /* eslint-disable max-nested-callbacks */
    beforeEach(() => {
      getState = sandbox.stub();
      dispatch = sandbox.spy();
      const createMatcherStub = sandbox.spy(routes => routes);
      // The matcher stub is just an empty object that acts as a sigil
      currentMatcher = {};
      storeSubscriber = createStoreSubscriber(getState, dispatch, createMatcherStub);
    });

    /* eslint-enable max-nested-callbacks */
    it('should not update routes if updateRoutes is not true', () => {
      const newRoutes = {};
      getState.returns({ routes: newRoutes });
      expect(storeSubscriber(currentMatcher)).to.equal(currentMatcher);
      expect(dispatch).not.to.have.been.called;
    });

    it('should update routes if updateRoutes is true', () => {
      const newRoutes = {};
      const routeInfo = { pathname: '/lol/k', search: '?what=yeah', hash: '#' };
      getState.returns({
        ...routeInfo,
        routes: newRoutes,
        updateRoutes: true
      });
      expect(storeSubscriber(currentMatcher)).to.equal(newRoutes);
      expect(dispatch).to.have.been.calledTwice;
      expect(dispatch.getCall(0).args[0]).to.deep.equal(didReplaceRoutes());
      expect(dispatch.getCall(1).args[0]).to.deep.equal(replace(routeInfo));
    });
  });
});
