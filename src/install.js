// @flow
import type { History } from 'history';
import type { Location } from './types';

import reducer from './reducer';
import middleware from './middleware';
import enhancer from './enhancer';

import { default as matcherFactory } from './util/create-matcher';
import validateRoutes from './util/validate-routes';
import flattenRoutes from './util/flatten-routes';

type InstallArgs = {
  routes: Object,
  history: History,
  location: Location,
  createMatcher?: Function
};

export default ({
  routes: nestedRoutes,
  history,
  location,
  createMatcher = matcherFactory
}: InstallArgs) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);

  const matchRoute = createMatcher(routes);
  const matchWildcardRoute = createMatcher(routes, true);

  return {
    reducer: reducer({
      ...location,
      ...matchRoute(location.pathname)
    }),
    middleware: middleware({ history }),
    enhancer: enhancer({
      routes,
      history,
      matchRoute,
      matchWildcardRoute
    })
  };
};
