// @flow
import createHashHistory from 'history/createHashHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type HashRouterArgs = {
  routes: Object,
  basename: string,
  hashType: string,
  passRouterStateToReducer?: bool
};

export default ({
  routes,
  basename,
  hashType = 'slash'
}: HashRouterArgs) => {
  const history = createHashHistory({ basename, hashType });

  const descriptor = basename
    ? { basename, ...history.location }
    : history.location;

  const location = normalizeHref(descriptor);

  return install({ routes, history, location });
};
