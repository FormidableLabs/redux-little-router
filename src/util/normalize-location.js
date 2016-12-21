// @flow
import type { Href } from '../types';

export default (href: Href) => {
  if (typeof href === 'string') {
    const pathnameAndSearch = href.split('?');
    const pathname = pathnameAndSearch[0];
    const search = pathnameAndSearch[1];
    return search ? { pathname, search: `?${search}` } : { pathname };
  }
  return href;
};
