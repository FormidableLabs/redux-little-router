// @flow
import type {
  StoreCreator,
  StoreEnhancer,
  Reducer,
  State
} from 'redux';

import type { History } from 'history';

import _assign from 'lodash.assign';
import _omit from 'lodash.omit';

import { default as matcherFactory } from './create-matcher';
import attachRouterToReducer from './reducer-enhancer';
import { locationDidChange } from './action-creators';

import matchCache from './match-cache';

import validateRoutes from './util/validate-routes';
import flattenRoutes from './util/flatten-routes';

type StoreEnhancerArgs = {
  routes: Object,
  history: History,
  location: Location,
  createMatcher?: Function,
  passRouterStateToReducer?: bool,
  immutable?: bool
};

export default ({
  routes: nestedRoutes,
  history,
  location,
  createMatcher = matcherFactory,
  passRouterStateToReducer = false,
  immutable = false
}: StoreEnhancerArgs) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);
  let assign = _assign;
  let omit = _omit;
  let get = (obj, prop) => obj[prop];
  if (immutable === true) {
    assign = (immutableObj, obj2) => {
      if (typeof immutableObj === 'undefined') {
        return immutableObj;
      }
      // don't want router object to be  deeply converted via Immutable.fromJS
      // https://facebook.github.io/immutable-js/docs/#/Map/merge
      const merge = (acc, idx, obj) => {
        const keys = Object.keys(obj);
        if (idx < keys.length) {
          return merge(acc.set(keys[idx], obj[keys[idx]]), idx + 1, obj);
        }

        return acc;
      };

      return merge(immutableObj, 0, obj2);
    };
    omit = (immutableObj, props) => {
      if (typeof immutableObj === 'undefined') {
        return immutableObj;
      }
      return immutableObj.filter((value, key) => props.indexOf(key) === -1);
    };
    get = (immutableObj, prop) => immutableObj.get(prop);
  }
  return (createStore: StoreCreator) => (
    reducer: Reducer,
    initialState: State,
    enhancer: StoreEnhancer
  ) => {
    const enhancedReducer =
      attachRouterToReducer(passRouterStateToReducer, assign, omit, get)(reducer);

    const matchRoute = createMatcher(routes);
    const matchWildcardRoute = createMatcher(routes, true);

    const initialStateWithRouter = assign(
      initialState,
      {
        router: {
          ...location,
          ...matchRoute(location.pathname)
        }
      }
    );

    const store = createStore(
      enhancedReducer,
      initialStateWithRouter,
      enhancer
    );

    history.listen(newLocation => {
      /* istanbul ignore else */
      if (newLocation) {
        matchCache.clear();
        store.dispatch(locationDidChange({
          location: newLocation, matchRoute
        }));
      }
    });

    return {
      ...store,

      // We attach routes here to allow <RouterProvider>
      // to access unserializable properties of route results.
      routes,

      history,
      matchRoute,
      matchWildcardRoute
    };
  };
};
