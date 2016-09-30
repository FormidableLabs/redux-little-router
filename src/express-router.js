// @flow
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';

import installRouter from './store-enhancer';
import routerMiddleware from './middleware';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    baseUrl: string,
    url: string,
    query: {[key: string]: string}
  }
};

export default ({ routes, request }: ServerRouterArgs) => {
  const history = useBasename(useQueries(createMemoryHistory))({
    basename: request.baseUrl
  });

  const location = history.createLocation({
    pathname: request.path,
    query: request.query
  });

  return {
    routerEnhancer: installRouter({ routes, history, location }),
    routerMiddleware: routerMiddleware({ history })
  };
};
