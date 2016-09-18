// @flow
import type {
  StoreCreator,
  StoreEnhancer,
  Reducer,
  State
} from 'redux';

import type { History } from 'history';

import { default as matcherFactory } from './create-matcher';
import attachRouterToReducer from './reducer-enhancer';
import { locationDidChange } from './action-creators';
import wrapDispatch from './wrap-dispatch';

import validateRoutes from './util/validate-routes';
import flattenRoutes from './util/flatten-routes';

type StoreEnhancerArgs = {
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
}: StoreEnhancerArgs) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);

  return (createStore: StoreCreator) => (
    reducer: Reducer,
    initialState: State,
    enhancer: StoreEnhancer
  ) => {
    const enhancedReducer = attachRouterToReducer(reducer);

    const matchRoute = createMatcher(routes);
    const matchWildcardRoute = createMatcher(routes, true);

    const initialStateWithRouter = {
      ...initialState,
      router: {
        ...location,
        ...matchRoute(location.pathname)
      }
    };

    const store = createStore(
      enhancedReducer,
      initialStateWithRouter,
      enhancer
    );

    history.listen(newLocation => {
      /* istanbul ignore else */
      if (newLocation) {
        store.dispatch(locationDidChange({
          location: newLocation, matchRoute
        }));
      }
    });

    const dispatch = wrapDispatch(store, history);

    return {
      ...store,
      dispatch,

      // We attach routes here to allow <RouterProvider>
      // to access unserializable properties of route results.
      routes,

      history,
      matchRoute,
      matchWildcardRoute
    };
  };
};
