// @flow

import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History } from 'history';

import { locationDidChange } from './actions';

import { unpackState } from './util/location-state';
import matchCache from './util/match-cache';

type EnhancerArgs = {
  routes: Object,
  history: History,
  matchRoute: Function,
  matchWildcardRoute: Function
};
export default ({
  routes,
  history,
  matchRoute,
  matchWildcardRoute
}: EnhancerArgs) =>
(createStore: StoreCreator<*, *>) => (
  userReducer: Reducer<*, *>,
  initialState: Location,
  enhancer: StoreEnhancer<*, *>
) => {
  const store = createStore(
    userReducer,
    initialState,
    enhancer
  );

  history.listen(location => {
    matchCache.clear();
    store.dispatch(locationDidChange({
      ...unpackState(location),
      ...matchRoute(location.pathname)
    }));
  });

  return {
    ...store,
    routes,
    matchRoute,
    matchWildcardRoute
  };
};
