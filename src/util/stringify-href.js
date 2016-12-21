// @flow
import type { Href } from '../types';
import qs from 'query-string';

export default (href: Href, basename: string) => {
  if (typeof href === 'string') {
    return `${basename || ''}${href}`;
  }

  const { pathname, search, query } = href;

  const resolvedSearch = search || (
    query &&
    Object.keys(query).length &&
    `?${qs.stringify(query)}`
  ) || '';

  return `${basename || ''}${pathname}${resolvedSearch || ''}`;
};
