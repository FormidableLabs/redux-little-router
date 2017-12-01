/* eslint-disable consistent-return */
// @flow

import type { History } from 'history';
import type { Dispatch, Store } from 'redux';
import type { Location, RouterAction } from './types';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  isNavigationAction
} from './types';

import mergeQueries from './util/merge-queries';

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

export const executeMiddleware = ({ history, next, action, query }) => {
  if (isNavigationAction(action)) {
    // Synchronously dispatch the original action so that the
    // reducer can add it to its location queue
    const originalDispatch = next(action);

    if (
      (action.type === PUSH || action.type === REPLACE) &&
      action.payload.options &&
      action.payload.options.persistQuery
    ) {
      navigate(history, {
        type: action.type,
        payload: {
          ...action.payload,
          ...mergeQueries(query, action.payload.query)
        }
      });
    } else {
      navigate(history, action);
    }

    return originalDispatch;
  }

  return next(action);
};

type MiddlewareArgs = { history: History };
type S = { router: Location };

export default ({ history }: MiddlewareArgs) =>
  ({ getState }: Store<S,*>) =>
    (next: Dispatch<*>) =>
      (action: RouterAction) => {
        const { router: { query } } = getState();
        return executeMiddleware({ history, next, action, query });
      };
