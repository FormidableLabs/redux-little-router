// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import createLocation from './util/create-location';
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
  const history = createMemoryHistory();

  const location = createLocation({
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
