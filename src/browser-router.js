// @flow
import createBrowserHistory from 'history/createBrowserHistory';

import createLocation from './util/create-location';
import installRouter from './store-enhancer';
import routerMiddleware from './middleware';

type BrowserRouterArgs = {
  routes: Object,
  basename: string,
  passRouterStateToReducer?: bool
};

export default ({
  routes,
  basename,
  passRouterStateToReducer = false
}: BrowserRouterArgs) => {
  const history = createBrowserHistory({ basename });

  const { pathname, search } = history.location;
  const descriptor = basename
    ? { pathname, basename, search }
    : { pathname, search };

  const location = createLocation(descriptor);

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
