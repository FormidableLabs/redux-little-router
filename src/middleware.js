/* eslint-disable consistent-return */
// @flow

import type { History } from 'history';
import type { Dispatch, Store } from 'redux';
import type {
  Location, LocationAction, Query, RouterAction
} from './types';

import qs from 'query-string';

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

const mergeQueries = (query: Query = {}, action: LocationAction): LocationAction => {
  const mergedQuery = {
    ...query,
    ...action.payload.query || {}
  };

  return {
    type: action.type,
    payload: {
      ...action.payload,
      query: mergedQuery,
      search: `?${qs.stringify(mergedQuery)}`
    }
  };
};

type MiddlewareArgs = { history: History };
type S = { router: Location };
export default ({ history }: MiddlewareArgs) =>
  ({getState}: Store<S,*>) =>
    (next: Dispatch<*>) =>
      (action: RouterAction) => {
        if (isNavigationAction(action)) {
          // Synchronously dispatch the original action so that the
          // reducer can add it to its location queue
          const originalDispatch = next(action);

          if (
            (action.type === PUSH || action.type === REPLACE) &&
            action.payload.options &&
            action.payload.options.persistQuery
          ) {
            const { router: { query } } = getState();
            navigate(history, mergeQueries(query, action));
          } else {
            navigate(history, action);
          }

          return originalDispatch;
        }

        return next(action);
      };
