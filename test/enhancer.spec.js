import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { combineReducers, createStore, applyMiddleware } from 'redux';

import { PUSH, REPLACE_ROUTES } from '../src/types';
import install from '../src/install';
import createMatcher from '../src/util/create-matcher';

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
    const replace = sandbox.spy(() => listen(listenStub));
    historyStub = { push, replace, listen };

    const { reducer, middleware, enhancer } = install({
      routes: defaultRoutes,
      history: historyStub,
      location: { pathname: '/' }
    });

    store = createStore(
      combineReducers({ router: reducer }),
      {},
      applyMiddleware(middleware)
    );
    enhancer(store);
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

    expect(store.dispatch).to.be.calledThrice;
    expect(historyStub.replace).to.be.calledOnce;
    expect(listenStub).to.be.calledOnce;

    const { routes } = store.getState().router;
    const matcher = createMatcher(routes);
    expect(matcher('/')).to.have.deep.property('result', {
      could: 'you not'
    });
  });
});
