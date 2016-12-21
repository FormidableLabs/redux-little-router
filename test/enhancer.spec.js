import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  combineReducers,
  compose,
  createStore,
  applyMiddleware
} from 'redux';

import { PUSH } from '../src/types';
import install from '../src/install';

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
    historyStub = { push, listen };

    const { reducer, middleware, enhancer } = install({
      routes: defaultRoutes,
      history: historyStub,
      location: { pathname: '/' }
    });

    store = createStore(
      combineReducers({ router: reducer }),
      {},
      compose(
        enhancer,
        applyMiddleware(middleware)
      )
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

  it('attaches the routes and matchers to the store', () => {
    expect(store).to.have.property('routes');
    expect(store.routes).to.deep.equal(defaultRoutes);

    expect(store).to.have.property('matchRoute');
    expect(store).to.have.property('matchWildcardRoute');
  });
});
