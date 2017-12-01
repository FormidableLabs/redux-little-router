// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import normalizeHref from './normalize-href';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    baseUrl: string,
    url: string,
    query: { [key: string]: string }
  },
  passRouterStateToReducer?: boolean
};

const locationForRequest = request => {
  const { path: pathname, baseUrl: basename, query } = request;
  const descriptor = basename
    ? { pathname, basename, query }
    : { pathname, query };
  return normalizeHref(descriptor);
};

export default (install) => ({ routes, request }: ServerRouterArgs) => {
  const history = createMemoryHistory();
  const location = locationForRequest(request);

  return install({ routes, history, location });
};
