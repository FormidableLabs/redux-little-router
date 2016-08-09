import createMatcher from './create-matcher';

export default ({
  pathname = '/',
  query = {},
  routes,
  history
}) => ({
  ...history.createLocation({
    pathname,
    query
  }),
  ...createMatcher(routes)(pathname)
});
