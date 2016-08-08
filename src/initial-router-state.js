import createMatcher from './create-matcher';
import assign from 'lodash.assign';

export default ({ url, query, routes, history }) =>
  assign({},
    history.createLocation({
      pathname: url,
      query
    }),
    createMatcher(routes)(url)
  );
