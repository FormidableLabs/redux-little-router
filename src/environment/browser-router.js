// @flow
import type { History, BrowserHistoryOptions } from 'history';

import createBrowserHistory from 'history/createBrowserHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type BrowserRouterArgs = {
  routes: Object,
  basename?: string,
  historyOptions?: BrowserHistoryOptions,
  history?: History
};

export const createBrowserRouter = (installer: Function) => ({
  routes,
  basename,
  historyOptions = {},
  history = createBrowserHistory({ basename, ...historyOptions })
}: BrowserRouterArgs) => {
  const {
    pathname: fullPathname,
    search,
    hash,
    state: { key, state } = {}
  } = history.location;

  // Strip the basename from the initial pathname
  const pathname =
    basename && fullPathname.indexOf(basename) === 0
      ? fullPathname.slice(basename.length)
      : fullPathname;

  const descriptor = basename
    ? { pathname, basename, search, hash, key, state }
    : { pathname, search, hash, key, state };

  const location = normalizeHref(descriptor);

  return installer({ routes, history, location });
};

export default createBrowserRouter(install);
