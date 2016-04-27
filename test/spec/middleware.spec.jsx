/* eslint-env mocha */
import { routerMiddleware } from 'src';
import {
  LOCATION_CHANGED, PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from 'src/action-types';

import MockHistory from './mocks/history';

const testRouterMiddleware = (initialAction, done, assertion) => {
  const didDispatch = action => {
    assertion(action);
    done();
  };
  const doDispatch = action => didDispatch(action);
  const doGetState = () => {};

  const nextHandler = routerMiddleware(new MockHistory())({
    dispatch: doDispatch,
    getState: doGetState
  })(doDispatch);

  nextHandler(initialAction);
};

describe('Router middleware', () => {
  const actions = {
    [PUSH]: {
      url: '/push',
      action: 'PUSH'
    },
    [REPLACE]: {
      url: '/replace',
      action: 'REPLACE'
    },
    [GO]: {
      url: '/go',
      action: 'REPLACE'
    },
    [GO_BACK]: {
      url: '/goBack',
      action: 'POP'
    },
    [GO_FORWARD]: {
      url: '/goForward',
      action: 'PUSH'
    }
  };

  Object.keys(actions).forEach(actionType => {
    const expected = actions[actionType];

    it(`dispatches location changes with ${actionType}`, done => {
      const action = {
        type: actionType,
        payload: {
          pathname: expected.url
        }
      };
      testRouterMiddleware(action, done, resultAction => {
        expect(resultAction).to.deep.equal({
          type: LOCATION_CHANGED,
          payload: {
            url: expected.url,
            action: expected.action
          }
        });
      });
    });
  });
});
