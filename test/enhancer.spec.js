import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { combineReducers, compose, createStore, applyMiddleware } from 'redux';

import { PUSH, REPLACE_ROUTES, POP } from '../src/types';
import {locationDidChange, didReplaceRoutes, replace} from '../src/actions';
import install from '../src/install';
import createMatcher from '../src/util/create-matcher';
import {createHistoryListener, createStoreSubscriber} from '../src/enhancer';

import defaultRoutes from './test-util/fixtures/routes';

chai.use(sinonChai);

describe('Router store enhancer', () => {
  let store;
  let historyStub;
  let listenStub;

  beforeEach(() => {
    listenStub = sandbox.stub();

    const listen = sandbox.spy(cb => cb({ pathname: '/' }));
    const push = sandbox.spy(() => listen(listenStub));
    const replaceStub = sandbox.spy(() => listen(listenStub));
    historyStub = { push, replace: replaceStub, listen };

    const { reducer, middleware, enhancer } = install({
      routes: defaultRoutes,
      history: historyStub,
      location: { pathname: '/' }
    });

    store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(enhancer, applyMiddleware(middleware))
    );
    sandbox.spy(store, 'dispatch');
  });

  it('dispatches a LOCATION_CHANGED action on location change', () => {
    store.dispatch({
      type: PUSH,
      payload: { pathname: '/' }
    });

    expect(historyStub.push).to.be.calledOnce;
    expect(listenStub).to.be.calledOnce;
    expect(store.dispatch).to.be.calledOnce;
  });

  it('attaches the matcher to the store', () => {
    expect(store).to.have.property('matchRoute');
  });

  it('replaces routes', () => {
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

    const { routes } = store.getState().router;
    const matcher = createMatcher(routes);
    expect(matcher('/')).to.have.deep.property('result', {
      could: 'you not'
    });
  });

  describe('createHistoryListener', () => {
    let historyListener;
    let currentMatcher;
    let storeStub;

    beforeEach(() => {
      storeStub = {
        dispatch: sandbox.spy()
      };
      // Mock the matcher by just returning a object with a single
      // `route` field populated with the pathname.
      // eslint-disable-next-line max-nested-callbacks
      currentMatcher = sandbox.spy((pathname) => ({ route: pathname }));
      historyListener = createHistoryListener(storeStub);
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
      expect(storeStub.dispatch).to.have.been.calledOnce;
      expect(storeStub.dispatch).to.have.been.calledWith(locationDidChange({
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
      expect(storeStub.dispatch).to.have.been.calledTwice;
      expect(storeStub.dispatch.getCall(0).args[0]).to.deep.equal({
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
});
