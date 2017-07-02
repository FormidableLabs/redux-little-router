// @flow
import type { History } from 'history';
import createHashHistory from 'history/createHashHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type HashRouterArgs = {
  routes: Object,
  basename: string,
  hashType: string,
  history: History
};

export default (
  {
    routes,
    basename,
    hashType = 'slash',
    history = createHashHistory({ basename, hashType })
  }: HashRouterArgs
) => {
  const descriptor = basename
    ? { basename, ...history.location }
    : history.location;

  const location = normalizeHref(descriptor);

  return install({ routes, history, location });
};
