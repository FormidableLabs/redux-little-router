/* eslint-env mocha */
import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'src';

import {
  PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from 'src/action-types';

import MockHistory from './mocks/history';

const init = () => {
  const historyStub = sinon.stub(new MockHistory());

  const store = createStore(
    state => state,
    {},
    applyMiddleware(
      routerMiddleware({
        history: historyStub
      })
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

      expect(historyStub[method]).to.have.been.called.once;
    });
  });
});
