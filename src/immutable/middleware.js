import { middleware } from '../middleware';

export default ({ history }: MiddlewareArgs) =>
  ({ getState }: Store<S,*>) =>
    (next: Dispatch<*>) =>
      (action: RouterAction) => {
        const query = getState().getIn(['router', 'query']);
        return middleware({ history, next, action, query });
      };
