import createMatcher from './create-matcher';
import assign from 'lodash.assign';

export default ({
  pathname = '/',
  query = {},
  routes,
  history
}) =>
  assign({},
    history.createLocation({
      pathname,
      query
    }),
    createMatcher(routes)(pathname)
  );
