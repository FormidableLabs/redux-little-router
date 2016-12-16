// @flow
import type { LocationDescriptor } from 'history';

export default (href: LocationDescriptor) => {
  if (typeof href === 'string') {
    const pathnameAndSearch = href.split('?');
    const pathname = pathnameAndSearch[0];
    const search = pathnameAndSearch[1];
    return search ? { pathname, search: `?${search}` } : { pathname };
  }
  return href;
};
