// @flow
import type { Href } from '../types';

export default (href: Href, basename: string) => {
  if (typeof href === 'string') {
    return `${basename || ''}${href}`;
  }

  const { pathname, search } = href;
  return `${basename || ''}${pathname}${search || ''}`;
};
