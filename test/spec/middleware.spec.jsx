/* eslint-env mocha */
import { routerMiddleware } from 'src';
import createMatcher from 'src/create-matcher';

import {
  LOCATION_CHANGED, PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from 'src/action-types';

import MockHistory from './mocks/history';

const fakeRoutes = {
  '/push': 'push',
  '/replace': 'replace',
  '/go': 'go',
  '/goBack': 'goBack',
  '/goForward': 'goForward'
};

const testRouterMiddleware = (initialAction, done, assertion) => {
  const didDispatch = action => {
    assertion(action);
    done();
  };
  const doDispatch = action => didDispatch(action);
  const doGetState = () => {};

  const nextHandler = routerMiddleware({
    history: new MockHistory(),
    matchRoute: createMatcher(fakeRoutes)
  })({
    dispatch: doDispatch,
    getState: doGetState
  })(doDispatch);

  nextHandler(initialAction);
};

describe('Router middleware', () => {
  const actions = {
    [PUSH]: {
      url: '/push',
      action: 'PUSH',
      result: 'push'
    },
    [REPLACE]: {
      url: '/replace',
      action: 'REPLACE',
      result: 'replace'
    },
    [GO]: {
      url: '/go',
      action: 'REPLACE',
      result: 'go'
    },
    [GO_BACK]: {
      url: '/goBack',
      action: 'POP',
      result: 'goBack'
    },
    [GO_FORWARD]: {
      url: '/goForward',
      action: 'PUSH',
      result: 'goForward'
    }
  };

  Object.keys(actions).forEach(actionType => {
    const expected = actions[actionType];

    it(`dispatches location changes with ${actionType} and associated state`, done => {
      const action = {
        type: actionType,
        payload: {
          pathname: expected.url,
          state: {
            bork: 'bork'
          }
        }
      };
      testRouterMiddleware(action, done, resultAction => {
        expect(resultAction).to.deep.equal({
          type: LOCATION_CHANGED,
          payload: {
            url: expected.url,
            params: {},
            action: expected.action,
            result: expected.result,
            state: {
              bork: 'bork'
            }
          }
        });
      });
    });
  });
});
