// @flow
import type { History } from 'history';
import type { State } from './reducer';

import reducer from './reducer';
import middleware from './middleware';
import enhancer from './enhancer';

import validateRoutes from './util/validate-routes';
import flattenRoutes from './util/flatten-routes';

type StoreEnhancerArgs = {
  routes: Object,
  history: History,
  location: State,
  createMatcher?: Function
};

export default ({
  routes: nestedRoutes,
  history,
  location
}: StoreEnhancerArgs) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);

  return {
    reducer: reducer(location),
    middleware: middleware({ history }),
    enhancer: enhancer({ routes, history })
  };
};
