// @flow
import type { Store, Dispatch } from 'redux';
import type { Map } from 'immutable';

import type { RouterAction, State } from '../types';
import type { MiddlewareArgs } from '../middleware';

import { isNavigationAction } from '../types';
import { handleNavigationAction } from '../middleware';

type ImmutableState = $Shape<State & Map<*, *>>;

export default ({ history }: MiddlewareArgs) => ({
  getState
}: Store<ImmutableState, *>) => (next: Dispatch<*>) => (
  action: RouterAction
) => {
  const query = getState().getIn(['router', 'query']);
  return isNavigationAction(action)
    ? handleNavigationAction({
        next,
        action,
        history,
        query: query && query.toJS()
      })
    : next(action);
};
