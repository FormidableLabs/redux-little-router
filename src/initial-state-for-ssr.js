import createMatcher from './create-matcher';

export default ({ url, query, routes, history }) =>
  Object.assign({},
    history.createLocation({
      pathname: url,
      query
    }),
    createMatcher(routes)(url),
    { url }
  );
