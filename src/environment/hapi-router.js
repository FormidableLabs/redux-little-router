// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    url: string,
    query: { [key: string]: string }
  }
};

export default ({
  routes,
  request
}: ServerRouterArgs) => {
  const history = createMemoryHistory();

  const location = normalizeHref({
    pathname: request.path,
    query: request.query
  });

  return install({ routes, history, location });
};
