// @flow
import { isNavigationAction } from '../types';
import { handleNavigationAction } from '../middleware';

export default ({ history }: MiddlewareArgs) =>
  ({ getState }: Store<S, *>) =>
    (next: Dispatch<*>) =>
      (action: RouterAction) => {
        const query = getState().getIn(['router', 'query']);
        return isNavigationAction(action) ?
          handleNavigationAction({ next, action, history, query }) :
          next(action);
      };
