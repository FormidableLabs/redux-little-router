import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from '../src';

import {
  PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from '../src/action-types';

chai.use(sinonChai);

const REFRAGULATE = 'REFRAGULATE';

// Used to test that other middleware can dispatch
// router actions and trigger history updates
const consumerMiddleware = ({ dispatch }) => next => action => {
  if (action.type === REFRAGULATE) {
    dispatch({
      type: PUSH,
      payload: {
        pathname: '/'
      }
    });
    return;
  }

  next(action);
};

const init = () => {
  const historyStub = {
    push: sandbox.stub(),
    replace: sandbox.stub(),
    go: sandbox.stub(),
    goBack: sandbox.stub(),
    goForward: sandbox.stub()
  };

  const store = createStore(
    state => state,
    {},
    applyMiddleware(
      routerMiddleware({
        history: historyStub
      }),
      consumerMiddleware
    )
  );

  return { historyStub, store };
};

const actionMethodMap = {
  [PUSH]: 'push',
  [REPLACE]: 'replace',
  [GO]: 'go',
  [GO_BACK]: 'goBack',
  [GO_FORWARD]: 'goForward'
};

describe('Router middleware', () => {
  Object.keys(actionMethodMap).forEach(actionType => {
    const method = actionMethodMap[actionType];

    it(`calls history.${method} when intercepting ${actionType}`, () => {
      const { historyStub, store } = init();
      store.dispatch({
        type: actionType,
        payload: {}
      });

      expect(historyStub[method]).to.have.been.called.twice;
    });
  });

  it('passes normal actions through the dispatch chain', () => {
    const { store, historyStub } = init();
    store.dispatch({
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {}
    });

    Object.keys(actionMethodMap).forEach(actionType => {
      const method = actionMethodMap[actionType];
      expect(historyStub[method]).to.not.have.been.called;
    });
  });

  it('passes normal actions through the dispatch chain', () => {
    const { store, historyStub } = init();
    store.dispatch({
      type: REFRAGULATE,
      payload: {}
    });

    expect(historyStub.push).to.have.been.called.once;
  });
});
