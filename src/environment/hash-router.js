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

const HASH = /^#/;
const HASH_BANG = /^#!/;

export default ({
  routes,
  basename,
  hashType = 'slash',
  getLocation = realLocation
}: HashRouterArgs) => {
  const history = createHashHistory({ basename, hashType });

  const { hash = '', search } = getLocation();

  let fullPathname;
  switch (hash) {
  case 'noslash':
    fullPathname = `/${ hash.replace(HASH, '') }`;
    break;
  case 'hashbang':
    fullPathname = hash.replace(HASH_BANG, '');
    break;
  // Default is slash
  default:
    fullPathname = hash.replace(HASH, '');
    break;
  }

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
