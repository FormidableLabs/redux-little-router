// @flow

import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History } from 'history';

import type { Location } from './types';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';

type InitialState = {
  router: Location
};

type EnhancerArgs = {|
  history: History,
  matchRoute: Function,
  createMatcher: Function
|};
export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: InitialState,
  enhancer: StoreEnhancer<*, *>
) => {
  let currentMatcher = matchRoute;

export const createStoreSubscriber = (
  store: Store<*, *>,
  createMatcher: Function
) => {
  return (currentMatcher: Function) => {
    const {
      routes,
      pathname,
      search,
      hash,
      options: { updateRoutes } = {}
    } = store.getState().router;
    if (updateRoutes) {
      currentMatcher = createMatcher(routes);
      store.dispatch(didReplaceRoutes());
      store.dispatch(replace({ pathname, search, hash }));
    }
    return currentMatcher;
  };
};

  history.listen((location, action) => {
    matchCache.clear();

    const match = currentMatcher(location.pathname);
    const payload = {
      ...location,
      ...match,
      query: qs.parse(location.search)
    };
    // Other actions come from the user, so they already have a
    // corresponding queued navigation action.
    if (action === 'POP') {
      store.dispatch({
        type: POP,
        payload
      });
    }
    store.dispatch(locationDidChange(payload));
export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: InitialState,
  enhancer: StoreEnhancer<*, *>
) => {
  let currentMatcher = matchRoute;

  const store = createStore(userReducer, initialState, enhancer);
  const storeSubscriber = createStoreSubscriber(store, createMatcher);
  });

  return {
    ...store,
    matchRoute
  };
};
