// @flow
import type { History } from 'history';
import type { Location } from '../types';

import { default as matcherFactory } from '../util/create-matcher';
import validateRoutes from '../util/validate-routes';
import flattenRoutes from '../util/flatten-routes';

type CreateInstallArgs = {|
  reducer: Function,
  middleware: Function,
  enhancer: Function
|};

type InstallArgs = {|
  routes: Object,
  history: History,
  location: Location,
  createMatcher?: Function
|};

export default ({ reducer, middleware, enhancer }: CreateInstallArgs) => ({
  routes: nestedRoutes,
  history,
  location,
  createMatcher = matcherFactory
}: InstallArgs) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);
  const matchRoute = createMatcher(routes);

  return {
    reducer: reducer({
      routes,
      initialLocation: {
        ...location,
        ...matchRoute(location.pathname)
      }
    }),
    middleware: middleware({ history }),
    enhancer: enhancer({
      history,
      matchRoute,
      createMatcher
    })
  };
};
