/* eslint-disable new-cap */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { Map, fromJS } from 'immutable';
import { createStore, applyMiddleware } from 'redux';

import { PUSH, REPLACE, GO, GO_BACK, GO_FORWARD } from '../src/types';
import middleware from '../src/middleware';
import immutableMiddleware from '../src/immutable/middleware';

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

const actionMethodMap = {
  [PUSH]: 'push',
  [REPLACE]: 'replace',
  [GO]: 'go',
  [GO_BACK]: 'goBack',
  [GO_FORWARD]: 'goForward'
};

describe('Router middleware', () => {
  let testObj;
  let immutableTestObj;

  const setupTest = (routerMiddleware, reducer, initialState) => {
    const historyStub = {
      push: sandbox.stub(),
      replace: sandbox.stub(),
      go: sandbox.stub(),
      goBack: sandbox.stub(),
      goForward: sandbox.stub(),
      listen: sandbox.stub()
    };
    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(routerMiddleware({ history: historyStub }), consumerMiddleware)
    );
    sandbox.spy(store, 'dispatch');
    return { historyStub, store };
  };

  beforeEach(() => {
    const routerInitialState = {
      router: {
        query: {
          is: 'cool'
        }
      }
    };
    testObj = setupTest(middleware, () => routerInitialState, {});
    immutableTestObj = setupTest(immutableMiddleware, () => fromJS(routerInitialState), Map());
  });

  Object.keys(actionMethodMap).forEach(actionType => {
    const method = actionMethodMap[actionType];

    it(`calls history.${method} when intercepting ${actionType}`, () => {
      [testObj, immutableTestObj].forEach(({ store, historyStub }) => {
        store.dispatch({
          type: actionType,
          payload: {}
        });

        expect(historyStub[method]).to.have.been.calledOnce;
      });
    });
  });

  [PUSH, REPLACE].forEach(actionType => {
    const method = actionMethodMap[actionType];

    it(`calls history.${method} with merged queries when requesting persistence`, () => {
      [testObj, immutableTestObj].forEach(({ store, historyStub }) => {
        store.dispatch({
          type: actionType,
          payload: {
            query: {
              has: 'socks'
            },
            options: {
              persistQuery: true
            }
          }
        });

        expect(historyStub[method]).to.have.been.calledWith({
          query: {
            is: 'cool',
            has: 'socks'
          },
          search: '?has=socks&is=cool',
          options: {
            persistQuery: true
          }
        });
      });
    });
  });

  it('passes normal actions through the dispatch chain', () => {
    [testObj, immutableTestObj].forEach(({ store, historyStub }) => {
      store.dispatch({
        type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
        payload: {}
      });

      Object.keys(actionMethodMap).forEach(actionType => {
        const method = actionMethodMap[actionType];
        expect(historyStub[method]).to.not.have.been.called;
      });
    });
  });

  it('allows for dispatching router actions in consumer middleware', () => {
    [testObj, immutableTestObj].forEach(({ store, historyStub }) => {
      store.dispatch({
        type: REFRAGULATE,
        payload: {}
      });

      expect(historyStub.push).to.have.been.calledOnce;
    });
  });
});
