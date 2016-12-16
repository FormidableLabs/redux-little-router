// @flow

import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History } from 'history';

import { locationDidChange } from './actions';

import { default as matcherFactory } from './util/create-matcher';
import matchCache from './util/match-cache';

type EnhancerArgs = {
  routes: Object,
  history: History,
  createMatcher?: Function
};
export default
  ({ routes, history, createMatcher = matcherFactory }: EnhancerArgs) =>
  (createStore: StoreCreator<*, *>) =>
  (
    userReducer: Reducer<*, *>,
    initialState: Location,
    enhancer: StoreEnhancer<*, *>
  ) => {
    const matchRoute = createMatcher(routes);
    const matchWildcardRoute = createMatcher(routes, true);

    const store = createStore(
      userReducer,
      initialState,
      enhancer
    );

    history.listen(newLocation => {
      /* istanbul ignore else */
      if (newLocation) {
        matchCache.clear();
        store.dispatch(locationDidChange({
          location: newLocation,
          matchRoute
        }));
      }
    });

    return {
      ...store,
      routes,
      matchRoute,
      matchWildcardRoute
    };
  };
