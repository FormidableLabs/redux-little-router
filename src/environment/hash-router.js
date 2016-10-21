// @flow
import createHashHistory from 'history/createHashHistory';

import normalizeHref from '../util/normalize-href';
import install from '../install';

type HashRouterArgs = {
  routes: Object,
  basename: string,
  hashType: string,
  getLocation: () => Location,
  passRouterStateToReducer?: bool
};

/* istanbul ignore next: unstubbable! */
const realLocation = () => window.location;

export default ({
  routes,
  basename,
  hashType = 'slash',
  getLocation = realLocation
}: HashRouterArgs) => {
  const history = createHashHistory({ basename, hashType });

  const { pathname: fullPathname, search } = getLocation();

  // Strip the basename from the initial pathname
  const pathname = basename
    ? fullPathname.replace(basename, '')
    : fullPathname;

  const descriptor = basename
    ? { pathname, basename, search }
    : { pathname, search };

  const location = normalizeHref(descriptor);

  return install({ routes, history, location });
};
