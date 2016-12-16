// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import createLocation from '../util/create-location';
import install from '../install';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    url: string,
    query: {[key: string]: string}
  },
  passRouterStateToReducer?: bool
};

export default ({
  routes,
  request
}: ServerRouterArgs) => {
  const history = createMemoryHistory();

  const location = createLocation({
    pathname: request.path,
    query: request.query
  });

  return install({ routes, history, location });
};
