// @flow
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';

import installRouter from './store-enhancer';
import routerMiddleware from './middleware';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    url: string,
    query: {[key: string]: string}
  },
  passRouterStateToReducer?: bool
};

export default ({
  routes,
  request,
  passRouterStateToReducer = false
}: ServerRouterArgs) => {
  const history = useQueries(createMemoryHistory)();

  const location = history.createLocation({
    pathname: request.path,
    query: request.query
  });

  return {
    routerEnhancer: installRouter({
      routes,
      history,
      location,
      passRouterStateToReducer
    }),
    routerMiddleware: routerMiddleware({ history })
  };
};
