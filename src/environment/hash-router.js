// @flow
import type { History, HashHistoryOptions } from 'history';
import createHashHistory from 'history/createHashHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type HashRouterArgs = {
  routes: Object,
  basename: string,
  hashType: string,
  historyOptions: HashHistoryOptions,
  history: History
};

export const createHashRouter = (installer: Function) => ({
  routes,
  basename,
  hashType = 'slash',
  historyOptions,
  history = createHashHistory({ basename, hashType, ...historyOptions })
}: HashRouterArgs) => {
  const descriptor = basename
    ? { basename, ...history.location }
    : history.location;

  const location = normalizeHref(descriptor);

  return installer({ routes, history, location });
};

export default createHashRouter(install);
