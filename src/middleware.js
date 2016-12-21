/* eslint-disable consistent-return */
// @flow

import type { History } from 'history';
import type { Dispatch } from 'redux';
import type { RouterAction } from './types';

import {
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './types';

type MiddlewareArgs = { history: History };
export default
  ({ history }: MiddlewareArgs) => () =>
  (next: Dispatch<*>) =>
  (action: RouterAction) => {
    switch (action.type) {
    case PUSH:
      history.push(action.payload);
      // No return, no next() here
      // We stop all history events from progressing further through the dispatch chain...
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
      // ...but we want to leave all events we don't care about undisturbed
      return next(action);
    }
  };
