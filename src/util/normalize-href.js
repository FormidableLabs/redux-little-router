// @flow
import type { Href, Location } from '../types';

import qs from 'query-string';

export default (href: Href): Location => {
  if (typeof href === 'string') {
    const pathnameAndSearch = href.split('?');
    const pathname = pathnameAndSearch[0];
    const search = pathnameAndSearch[1];
    const query = search && qs.parse(search);

    return query
      ? { pathname, query, search: `?${search}` }
      : { pathname };
  }

  const { search, query } = href;

  const resolvedSearch = search || (
    query &&
    Object.keys(query).length &&
    `?${qs.stringify(query)}`
  ) || '';
  const resolvedQuery = query || qs.parse(search);

  return {
    ...href,
    search: resolvedSearch,
    query: resolvedQuery
  };
};
