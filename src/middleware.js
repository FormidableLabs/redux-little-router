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
import { get, toJS } from './util/data';

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
type S = { router: Location };

export const createMiddleware = (get, toJS) =>
  ({ history }: MiddlewareArgs) =>
    ({ getState }: Store<S, *>) =>
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
              const query = get(getState(), ['router', 'query']);
              const mergedQueries = mergeQueries(toJS(query), toJS(action.payload.query));
              navigate(history, {
                type: action.type,
                payload: {
                  ...action.payload,
                  ...mergedQueries
                }
              });
            } else {
              navigate(history, action);
            }

            return originalDispatch;
          }

          return next(action);
        };

export default createMiddleware(get, toJS);
