// @flow
import type { MemoryHistoryOptions } from 'history';

import createMemoryHistory from 'history/createMemoryHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    url: string,
    query: { [key: string]: string }
  },
  historyOptions: MemoryHistoryOptions
};

export const createHapiRouter = (installer: Function) => ({
  routes,
  request,
  historyOptions = {}
}: ServerRouterArgs) => {
  const history = createMemoryHistory(historyOptions);

  const location = normalizeHref({
    pathname: request.path,
    query: request.query
  });

  return installer({ routes, history, location });
};

export default createHapiRouter(install);
