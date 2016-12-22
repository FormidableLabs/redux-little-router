// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    baseUrl: string,
    url: string,
    query: {[key: string]: string}
  },
  passRouterStateToReducer?: bool
};

const locationForRequest = request => {
  const { path: pathname, baseUrl: basename, query } = request;
  const descriptor = basename
    ? { pathname, basename, query }
    : { pathname, query };
  return normalizeHref(descriptor);
};

export default ({ routes, request }: ServerRouterArgs) => {
  const history = createMemoryHistory();
  const location = locationForRequest(request);

  return install({ routes, history, location });
};
