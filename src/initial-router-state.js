// @flow
import type {
  Query,
  History
} from 'history';

import createMatcher from './create-matcher';

type Args = {
  pathname: string,
  query: Query,
  routes: {[key: string]: Object},
  history: History
};

export default ({
  pathname = '/',
  query = {},
  routes,
  history
}: Args) => ({
  ...history.createLocation({
    pathname,
    query
  }),
  ...createMatcher(routes)(pathname)
});
