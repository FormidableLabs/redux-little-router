/* eslint-disable consistent-return */
// @flow

import type { History } from 'history';
import type { Dispatch } from 'redux';
import type { RouterAction } from './types';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  isNavigationAction
} from './types';

const navigate = (history, action) => {
  switch (action.type) {
    case PUSH:
      history.push(action.payload);
      break;
    case REPLACE:
      history.replace(action.payload);
      break;
    case GO:
      history.go(action.payload);
      break;
    case GO_BACK:
      history.goBack();
      break;
    case GO_FORWARD:
      history.goForward();
      break;
    default:
      break;
  }
};

type MiddlewareArgs = { history: History };
export default ({ history }: MiddlewareArgs) =>
  () =>
    (next: Dispatch<*>) =>
      (action: RouterAction) => {
        if (isNavigationAction(action)) {
          // Synchronously dispatch the original action so that the
          // reducer can add it to its location queue
          const originalDispatch = next(action);
          navigate(history, action);
          return originalDispatch;
        }

        return next(action);
      };
