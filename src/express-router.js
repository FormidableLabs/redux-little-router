// @flow
import createMemoryHistory from 'history/createMemoryHistory';

import createLocation from './util/create-location';
import installRouter from './store-enhancer';
import routerMiddleware from './middleware';

type ServerRouterArgs = {
  routes: Object,
  request: {
    path: string,
    baseUrl: string,
    url: string,
    query: {[key: string]: string}
  },
  passRouterStateToReducer?: bool
};

const locationForRequest = request => {
  const { path: pathname, baseUrl: basename, query } = request;
  const descriptor = basename
    ? { pathname, basename, query }
    : { pathname, query };
  return createLocation(descriptor);
};

export default ({
  routes,
  request,
  passRouterStateToReducer = false
}: ServerRouterArgs) => {
  const history = createMemoryHistory();

  const location = locationForRequest(request);

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
