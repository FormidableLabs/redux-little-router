// @flow
import type { Href, Location } from '../types';

import { parsePath } from 'history/PathUtils';
import qs from 'query-string';

export default (href: Href): Location => {
  if (typeof href === 'string') {
    const { search = '', ...other } = parsePath(href);
    const query = search && qs.parse(search);

    return query ? { ...other, query, search } : { ...other };
  }

  const { search, query } = href;

  const resolvedSearch =
    search ||
    (query && Object.keys(query).length && `?${qs.stringify(query)}`) ||
    '';
  const resolvedQuery = query || qs.parse(search || '');

  return {
    ...href,
    search: resolvedSearch,
    query: resolvedQuery
  };
};
